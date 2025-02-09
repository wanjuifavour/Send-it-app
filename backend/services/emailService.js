const emailQueue = require("./emailQueue")

exports.sendWelcomeEmail = async (to, username) => {
    await emailQueue.add({
        to,
        subject: "Welcome to Send-It!",
        html: `<h1>Welcome, ${username}!</h1><p>Thank you for joining Send-It. We're excited to have you on board.</p>`,
    })
}

exports.sendStatusUpdateEmail = async (senderEmail, receiverEmail, status) => {
    await emailQueue.add({
        to: [senderEmail, receiverEmail],
        subject: "Parcel Status Update",
        html: `<h1>Parcel Status Update</h1><p>Your parcel status has been updated to: ${status}</p>`,
    })
}