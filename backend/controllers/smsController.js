const { sendSMS } = require("../services/smsService");


// Send SMS Notification for Parcel Creation

exports.notifyRecipient = async (req, res) => {
    const { receiverPhone, senderName, parcelId } = req.body;
    
    if (!receiverPhone || !senderName || !parcelId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const message = `Hello, ${senderName} has sent you a parcel (ID: ${parcelId}). Track it on Send-It App.`;

    try {
        await sendSMS(receiverPhone, message);
        res.json({ message: "Notification sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification", error: error.message });
    }
};
