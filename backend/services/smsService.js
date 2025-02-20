const africastalking = require("africastalking");

const at = africastalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
});

const formatPhoneNumber = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/\D/g, "");
    
    if (cleaned.startsWith("0")) {
        return `+254${cleaned.substring(1)}`;
    }
    if (cleaned.startsWith("7")) {
        return `+254${cleaned}`;
    }
    if (cleaned.startsWith("254")) {
        return `+${cleaned}`;
    }
    return cleaned;
};

exports.sendSMS = async (phone, message) => {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        const sms = at.SMS;
        
        return await sms.send({
            to: [formattedPhone],
            message: message,
            from: process.env.AT_SENDER_ID || ""
        });
    } catch (error) {
        console.error("SMS Sending Error:", error);
        throw error;
    }
};