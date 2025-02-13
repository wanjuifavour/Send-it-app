const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendWelcomeEmail = async (to, username) => {
    try {
        await transporter.sendMail({
            from: '"Send-It App" <your-email@gmail.com>',
            to,
            subject: "Welcome to Send-It!",
            html: `<h1>Welcome, ${username}!</h1><p>Thank you for joining Send-It. We're excited to have you on board.</p>`,
        });
        console.log('Welcome email sent to:', to);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

exports.sendStatusUpdateEmail = async (senderEmail, receiverEmail, status) => {
    await emailQueue.add({
        to: [senderEmail, receiverEmail],
        subject: "Parcel Status Update",
        html: `<h1>Parcel Status Update</h1><p>Your parcel status has been updated to: ${status}</p>`,
    })
}