const { sendSMS } = require('../services/smsService');

exports.handleSendSMS = async (req, res) => {
    try {
        const { receiverName, receiverPhone, senderLocation, destination } = req.body;
        const message = `Hello ${receiverName}, your parcel from ${senderLocation} to ${destination} has been created successfully.`;
        
        await sendSMS(receiverPhone, message);
        res.status(200).json({ success: true, message: "SMS sent successfully" });
    } catch (error) {
        console.error("SMS Controller Error:", error);
        res.status(500).json({ 
            success: false,
            message: error.message.includes("Invalid") ? error.message : "Failed to send SMS"
        });
    }
};