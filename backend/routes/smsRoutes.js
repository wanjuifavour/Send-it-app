const express = require("express");
const router = express.Router();
const { notifyRecipient } = require("../controllers/smsController");

router.post("/notify", notifyRecipient);

module.exports = router;
