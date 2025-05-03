const { wpClient } = require('../../whatsapp/client');
const logger = require('../../config/logger');
const { Otp } = require('../../models/Otp');
const { User } = require('../../models/User');
const jwt = require('jsonwebtoken');

/**
 * Sends an OTP to the specified phone number
 * @param {string} phoneNumber - The phone number to send OTP to
 * @returns {Promise<Object>} - Result of the operation
 */
const sendOTP = async (phoneNumber) => {
  try {
    const validWpNumber = await wpClient.getNumberId("91" + phoneNumber);
    if (!validWpNumber) {
      return {
        success: false,
        message: 'Invalid WhatsApp number'
      }
    }
    const w_id = validWpNumber._serialized;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `Your OTP is ${otp}`;
    await wpClient.sendMessage(w_id, message);
    // Store OTP in MongoDB (replace if exists for this w_id)
    await Otp.findOneAndUpdate(
      { w_id },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );
    logger.info('OTP sent and stored successfully', { w_id });
    return {
      success: true,
      message: 'OTP sent successfully',
      w_id // Return w_id so client can use it for verification
    };
  } catch (error) {
    logger.error('Failed to send OTP', { 
      error: error.message,
      stack: error.stack,
      phoneNumber 
    });
    throw error;
  }
};

/**
 * Verifies the OTP for the specified phone number (resolves w_id internally)
 * @param {string} phoneNumber - The phone number to verify
 * @param {string} otp - The OTP to verify
 * @returns {Promise<Object>} - Result of the verification
 */
const verifyOTP = async (phoneNumber, otp) => {
  try {
    const validWpNumber = await wpClient.getNumberId("91" + phoneNumber);
    if (!validWpNumber) {
      return { success: false, message: 'Invalid WhatsApp number' };
    }
    const w_id = validWpNumber._serialized;
    const record = await Otp.findOne({ w_id });
    if (!record) {
      return { success: false, message: 'No OTP sent or OTP expired' };
    }
    if (record.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }
    // OTP is valid, delete it
    await Otp.deleteOne({ w_id });

    // Find or create user by w_id
    let user = await User.findOne({ w_id });
    if (!user) {
      user = await User.create({ w_id, phoneNumber });
    }

    // Generate JWT
    const payload = { userId: user._id, w_id: user.w_id };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { success: true, message: 'OTP verified', token };
  } catch (error) {
    logger.error('Failed to verify OTP', {
      error: error.message,
      stack: error.stack,
      phoneNumber
    });
    throw error;
  }
};

/**
 * Checks the WhatsApp connection status
 * @returns {Promise<Object>} - Status of the WhatsApp connection
 */
const checkWhatsAppConnection = async () => {
  try {
    const isConnected = wpClient.info !== undefined;
    const status = {
      connected: isConnected,
      timestamp: new Date().toISOString()
    };
    logger.info('WhatsApp connection status checked', { status });
    return status;
  } catch (error) {
    logger.error('Failed to check WhatsApp connection status', { 
      error: error.message,
      stack: error.stack 
    });
    throw error;
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  checkWhatsAppConnection
}; 