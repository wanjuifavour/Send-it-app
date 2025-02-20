const express = require('express');
const { validateSmsRequest } = require('../middlewares/validation');
const { handleSendSMS } = require('../controllers/smsController');

const router = express.Router();

router.post('/send', validateSmsRequest, handleSendSMS);

module.exports = router;