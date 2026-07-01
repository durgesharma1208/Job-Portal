const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  hashedOTP: { type: String, required: true },
  purpose: { type: String, enum: ["register", "reset"], required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 },
  resendCount: { type: Number, default: 0 },
}, { timestamps: true });

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });

module.exports = mongoose.model("OTP", otpSchema);
