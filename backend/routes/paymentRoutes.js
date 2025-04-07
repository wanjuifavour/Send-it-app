const express = require("express")
const router = express.Router()
const {
    createPaymentIntent,
    handleStripeWebhook
} = require("../controllers/paymentController")
const { validateUserParcelCreation } = require("../middlewares/validation")

router.post("/payment-success", express.raw({type: 'application/json'}), handleStripeWebhook)
router.post("/payment-intent", validateUserParcelCreation , createPaymentIntent)

module.exports = router