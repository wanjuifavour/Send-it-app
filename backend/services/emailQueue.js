const Queue = require("bull")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const emailQueue = new Queue("email-queue", process.env.REDIS_URL)

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

emailQueue.process(async (job) => {
    const { to, subject, html } = job.data

    try {
        await transporter.sendMail({
            from: '"Send-It App" <noreply@sendit.com>',
            to,
            subject,
            html,
        })
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
})

module.exports = emailQueue