const express = require('express');
const { handleSendSMS } = require('../controllers/smsController');

const router = express.Router();

router.post('/send', handleSendSMS);

module.exports = router;