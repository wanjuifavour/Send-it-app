const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { calculateDistance } = require("../services/distanceCalculator");

exports.createPaymentIntent = async (req, res) => {
    try {
        const { parcelData } = req.body;
        
        const distance = await calculateDistance(
            parcelData.senderLocation.trim().toLowerCase(), 
            parcelData.destination.trim().toLowerCase()
        );
        const amount = Math.round(distance * process.env.PRICE_PER_KM * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'kes',
            metadata: { parcelData: JSON.stringify(parcelData) }
        });

        res.json({ 
            clientSecret: paymentIntent.client_secret,
            amount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const parcelData = JSON.parse(paymentIntent.metadata.parcelData);

        // Create parcel in your database
        await executeStoredProcedure("sp_CreateParcel", {
            ...parcelData,
            stripePaymentId: paymentIntent.id,
            status: 'Pending'
        });
    }

    res.json({ received: true });
}
