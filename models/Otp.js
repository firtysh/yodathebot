const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  w_id: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  },
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = { Otp }; 