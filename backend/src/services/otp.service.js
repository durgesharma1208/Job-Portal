const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const OTP = require("../model/otpmodel");

const getOtpConfig = () => ({
  expiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 5,
  maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
  maxResend: Number(process.env.OTP_MAX_RESEND) || 3,
});

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

exports.createOTP = async ({ email, purpose, resendCount = 0 }) => {
  const { expiryMinutes } = getOtpConfig();
  const otp = generateOTP();
  const hashedOTP = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email, purpose },
    { hashedOTP, expiresAt, attempts: 0, resendCount },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { otp, expiresAt, expiryMinutes };
};

exports.verifyOTP = async ({ email, purpose, otp }) => {
  const { maxAttempts } = getOtpConfig();
  const otpDoc = await OTP.findOne({ email, purpose });

  if (!otpDoc) {
    return { ok: false, status: 400, message: "Invalid or expired OTP" };
  }

  if (otpDoc.expiresAt <= new Date()) {
    await OTP.deleteOne({ _id: otpDoc._id });
    return { ok: false, status: 400, message: "OTP has expired" };
  }

  if (otpDoc.attempts >= maxAttempts) {
    await OTP.deleteOne({ _id: otpDoc._id });
    return { ok: false, status: 429, message: "Maximum OTP attempts exceeded. Request a new OTP." };
  }

  const isMatch = await bcrypt.compare(otp, otpDoc.hashedOTP);
  if (!isMatch) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    const remainingAttempts = Math.max(maxAttempts - otpDoc.attempts, 0);
    return { ok: false, status: 400, message: "Invalid OTP", remainingAttempts };
  }

  await OTP.deleteOne({ _id: otpDoc._id });
  return { ok: true };
};

exports.resendOTP = async ({ email, purpose }) => {
  const { maxResend } = getOtpConfig();
  const existingOtp = await OTP.findOne({ email, purpose });

  if (!existingOtp) {
    return { ok: false, status: 404, message: "Request a new OTP first" };
  }

  if (existingOtp.resendCount >= maxResend) {
    return { ok: false, status: 429, message: "Maximum resend attempts reached", remainingResend: 0 };
  }

  const nextResendCount = existingOtp.resendCount + 1;
  const otpData = await exports.createOTP({ email, purpose, resendCount: nextResendCount });

  return {
    ok: true,
    ...otpData,
    remainingResend: Math.max(maxResend - nextResendCount, 0),
  };
};

exports.getOtpConfig = getOtpConfig;
