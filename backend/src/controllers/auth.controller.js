const { OAuth2Client } = require("google-auth-library");
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOtpEmail } = require("../services/mail.service");
const { createOTP, verifyOTP, resendOTP: resendOTPService, getOtpConfig } = require("../services/otp.service");

const getClient = () => new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validRoles = ["student", "recruiter"];

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const isValidEmail = (email) => emailRegex.test(email);
const isValidOTP = (otp) => /^\d{6}$/.test(String(otp || ""));
const isValidPassword = (password) => typeof password === "string" && password.length >= 6;
const sendError = (res, status, message) => res.status(status).json({ success: false, message });

const validateRegistrationInput = ({ name, email, password, role }) => {
  if (!name || typeof name !== "string" || name.trim().length < 2) return "Name must be at least 2 characters";
  if (!isValidEmail(email)) return "A valid email is required";
  if (!isValidPassword(password)) return "Password must be at least 6 characters";
  if (!validRoles.includes(role)) return "A valid role is required";
  return null;
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    const client = getClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    let user = await User.findOne({ email: email.toLowerCase() });
    let newUser = false;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";
        user.avatar = user.avatar || picture;
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        provider: "google",
        googleId,
        avatar: picture,
        isVerified: true,
        role: null,
        profileCompleted: false,
        savedJobs: [],
        appliedJobs: [],
      });
      newUser = true;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token,
      user: userResponse,
      newUser,
    });
  } catch (error) {
    console.error("Google auth error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "User validation failed. Please try again.",
      });
    }

    if (error.message?.includes("Wrong number of segments") || error.message?.includes("Invalid token")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token. Please try signing in again.",
      });
    }

    res.status(401).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
};

exports.sendRegistrationOTP = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const validationError = validateRegistrationInput({ name, email: normalizedEmail, password, role });

    if (validationError) return sendError(res, 400, validationError);

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return sendError(res, 409, "Email already registered");

    const { otp, expiryMinutes } = await createOTP({ email: normalizedEmail, purpose: "register" });
    await sendOtpEmail({ email: normalizedEmail, otp, purpose: "register", expiryMinutes });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      expiresInMinutes: expiryMinutes,
      remainingResend: getOtpConfig().maxResend,
    });
  } catch (error) {
    console.error("Send registration OTP error:", error);
    res.status(500).json({ success: false, message: "Unable to send OTP. Please try again." });
  }
};

exports.verifyRegistrationOTP = async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const validationError = validateRegistrationInput({ name, email: normalizedEmail, password, role });

    if (validationError) return sendError(res, 400, validationError);
    if (!isValidOTP(otp)) return sendError(res, 400, "OTP must be a 6-digit number");

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return sendError(res, 409, "Email already registered");

    const verification = await verifyOTP({ email: normalizedEmail, purpose: "register", otp });
    if (!verification.ok) {
      return res.status(verification.status).json({
        success: false,
        message: verification.message,
        remainingAttempts: verification.remainingAttempts,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      provider: "local",
      isVerified: true,
      savedJobs: [],
      appliedJobs: [],
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: "Email verified and account created", user: userResponse });
  } catch (error) {
    console.error("Verify registration OTP error:", error);
    res.status(500).json({ success: false, message: "Unable to verify OTP. Please try again." });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) return sendError(res, 400, "A valid email is required");
    if (!["register", "reset"].includes(purpose)) return sendError(res, 400, "A valid OTP purpose is required");

    if (purpose === "register") {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) return sendError(res, 409, "Email already registered");
    }

    const resendResult = await resendOTPService({ email: normalizedEmail, purpose });
    if (!resendResult.ok) {
      return res.status(resendResult.status).json({
        success: false,
        message: resendResult.message,
        remainingResend: resendResult.remainingResend,
      });
    }

    await sendOtpEmail({
      email: normalizedEmail,
      otp: resendResult.otp,
      purpose,
      expiryMinutes: resendResult.expiryMinutes,
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      expiresInMinutes: resendResult.expiryMinutes,
      remainingResend: resendResult.remainingResend,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Unable to resend OTP. Please try again." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body.email);
    if (!isValidEmail(normalizedEmail)) return sendError(res, 400, "A valid email is required");

    const user = await User.findOne({ email: normalizedEmail });
    if (user && user.password) {
      const { otp, expiryMinutes } = await createOTP({ email: normalizedEmail, purpose: "reset" });
      await sendOtpEmail({ email: normalizedEmail, otp, purpose: "reset", expiryMinutes });
    }

    res.status(200).json({
      success: true,
      message: "If an account exists, a password reset OTP has been sent.",
      remainingResend: getOtpConfig().maxResend,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Unable to process password reset. Please try again." });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) return sendError(res, 400, "A valid email is required");
    if (!isValidOTP(otp)) return sendError(res, 400, "OTP must be a 6-digit number");

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) return sendError(res, 400, "Invalid or expired OTP");

    const verification = await verifyOTP({ email: normalizedEmail, purpose: "reset", otp });
    if (!verification.ok) {
      return res.status(verification.status).json({
        success: false,
        message: verification.message,
        remainingAttempts: verification.remainingAttempts,
      });
    }

    const resetToken = jwt.sign(
      { email: normalizedEmail, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ success: true, message: "OTP verified", resetToken });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    res.status(500).json({ success: false, message: "Unable to verify OTP. Please try again." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) return sendError(res, 400, "A valid email is required");
    if (!resetToken) return sendError(res, 400, "Reset token is required");
    if (!isValidPassword(password)) return sendError(res, 400, "Password must be at least 6 characters");

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return sendError(res, 401, "Reset session expired. Please request a new OTP.");
    }

    if (decoded.email !== normalizedEmail || decoded.purpose !== "password-reset") {
      return sendError(res, 401, "Invalid reset session");
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !user.password) return sendError(res, 404, "Account not found");

    user.password = await bcrypt.hash(password, 12);
    user.provider = user.googleId ? user.provider : "local";
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Unable to reset password. Please try again." });
  }
};
