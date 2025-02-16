exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Retrieve parcel data from metadata
            const parcelData = JSON.parse(session.metadata.parcel);
            
            // Create the parcel
            await executeStoredProcedure("sp_UpsertParcel", {
                ...parcelData,
                stripePaymentId: session.id,
                status: 'Pending'
            });
        }

        res.status(200).end();
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}; 