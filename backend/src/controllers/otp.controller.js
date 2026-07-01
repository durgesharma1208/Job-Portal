const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../model/otp.model");
const User = require("../model/usermodel");
const { sendOtpEmail } = require("../services/mail.service");

const getConfig = () => ({
  expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES) || 5,
  maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS) || 5,
  maxResend: parseInt(process.env.OTP_MAX_RESEND) || 3,
});

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const generateOTP = () =>
  otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

// ===============================
// SEND OTP (Registration)
// ===============================
exports.sendOTP = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!name || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, password, and role are required" });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be student or recruiter" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    await OTP.deleteMany({ email: normalizedEmail, purpose: "registration" });

    const otp = generateOTP();
    const { expiryMinutes } = getConfig();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.create({
      email: normalizedEmail,
      hashedOTP,
      purpose: "registration",
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
      attempts: 0,
      resendCount: 0,
    });

    await sendOtpEmail({ email: normalizedEmail, otp, purpose: "registration", expiryMinutes: getConfig().expiryMinutes });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
  }
};

// ===============================
// VERIFY OTP (Registration)
// ===============================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { maxAttempts } = getConfig();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "registration",
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.attempts >= maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.hashedOTP);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = maxAttempts - otpRecord.attempts;
      if (remaining <= 0) {
        await OTP.deleteOne({ _id: otpRecord._id });
      }
      return res.status(400).json({
        success: false,
        message: remaining > 0 ? `Invalid OTP. ${remaining} attempts remaining.` : "Too many failed attempts. Please request a new OTP.",
      });
    }

    if (!name || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, password, and role are required" });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be student or recruiter" });
    }

    // Double-check user doesn't already exist (race condition)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      provider: "local",
      isVerified: true,
      savedJobs: [],
      appliedJobs: [],
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Email verified and account created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Verification failed. Please try again." });
  }
};

// ===============================
// RESEND OTP
// ===============================
exports.resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validPurpose = purpose || "registration";

    if (!["registration", "reset-password"].includes(validPurpose)) {
      return res.status(400).json({ success: false, message: "Invalid purpose" });
    }

    const { maxResend, expiryMinutes } = getConfig();

    let otpRecord = await OTP.findOne({ email: normalizedEmail, purpose: validPurpose });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No OTP request found. Please request a new OTP." });
    }

    if (otpRecord.resendCount >= maxResend) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "Maximum resend attempts reached. Please try again later.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    otpRecord.hashedOTP = hashedOTP;
    otpRecord.expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    otpRecord.attempts = 0;
    otpRecord.resendCount += 1;
    await otpRecord.save();

    await sendOtpEmail({ email: normalizedEmail, otp, purpose: validPurpose === "reset-password" ? "reset" : validPurpose, expiryMinutes });

    const remainingResends = maxResend - otpRecord.resendCount;

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      remainingResends,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP. Please try again." });
  }
};

// ===============================
// FORGOT PASSWORD (Send OTP for reset)
// ===============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Don't reveal whether email exists (security)
    const user = await User.findOne({ email: normalizedEmail });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    if (user.provider !== "local") {
      return res.status(200).json({
        success: true,
        message: "If an account with this email exists, an OTP has been sent.",
      });
    }

    await OTP.deleteMany({ email: normalizedEmail, purpose: "reset-password" });

    const otp = generateOTP();
    const { expiryMinutes } = getConfig();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.create({
      email: normalizedEmail,
      hashedOTP,
      purpose: "reset-password",
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000),
      attempts: 0,
      resendCount: 0,
    });

    await sendOtpEmail({ email: normalizedEmail, otp, purpose: "reset", expiryMinutes });

    res.status(200).json({
      success: true,
      message: "If an account with this email exists, an OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Failed to process request. Please try again." });
  }
};

// ===============================
// VERIFY RESET OTP
// ===============================
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: "OTP must be 6 digits" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { maxAttempts } = getConfig();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "reset-password",
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.attempts >= maxAttempts) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "Too many failed attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.hashedOTP);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = maxAttempts - otpRecord.attempts;
      if (remaining <= 0) {
        await OTP.deleteOne({ _id: otpRecord._id });
      }
      return res.status(400).json({
        success: false,
        message: remaining > 0 ? `Invalid OTP. ${remaining} attempts remaining.` : "Too many failed attempts. Please request a new OTP.",
      });
    }

    // OTP verified - generate a temporary reset token
    const resetToken = jwt.sign(
      { email: normalizedEmail, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    res.status(500).json({ success: false, message: "Verification failed. Please try again." });
  }
};

// ===============================
// RESET PASSWORD
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, password, confirmPassword } = req.body;

    if (!email || !resetToken || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token. Please request a new OTP." });
    }

    if (decoded.email !== email.trim().toLowerCase() || decoded.purpose !== "reset-password") {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password. Please try again." });
  }
};
