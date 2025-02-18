const express = require("express")
const router = express.Router()
const {
    createPaymentIntent,
    handleStripeWebhook
} = require("../controllers/paymentController")

router.post("/payment-success", express.raw({type: 'application/json'}), handleStripeWebhook)
router.post("/payment-intent", createPaymentIntent)

module.exports = router