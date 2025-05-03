const express = require('express');
const router = express.Router();
const { sendOTP, checkWhatsAppConnection, verifyOTP } = require('../controllers/whatsapp');

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const result = await sendOTP(phoneNumber);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const result = await verifyOTP(phoneNumber, otp);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Check WhatsApp connection status
router.get('/status', async (req, res) => {
  try {
    const status = await checkWhatsAppConnection();
    res.json(status);
  } catch (error) {
    console.error('Error checking WhatsApp status:', error);
    res.status(500).json({ error: 'Failed to check WhatsApp status' });
  }
});

module.exports = router; 