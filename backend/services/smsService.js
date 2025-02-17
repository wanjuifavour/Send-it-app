const africastalking = require('africastalking');

const at = africastalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
});

const sms = at.SMS;

/**
 * Send SMS to a recipient
 * @param {string} phoneNumber
 * @param {string} message
 */

const sendSMS = async (phoneNumber, message) => {
    try {
        const response = await sms.send({
            to: [`${phoneNumber}`],
            message: message,
            from: process.env.AT_SENDER_ID
        });
        console.log("SMS sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending SMS:", error);
        throw error;
    }
};

module.exports = { sendSMS };
