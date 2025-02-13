const Queue = require("bull")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const emailQueue = new Queue("email-queue", {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
    }
})

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
            from: '"Send-It App" kazihub.official@gmail.com',
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

emailQueue.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
    console.error(`Email job ${job.id} failed:`, err);
});

module.exports = emailQueue