const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authLimiter, otpLimiter } = require("../middleware/rateLimiter");

router.post("/google", authLimiter, authController.googleAuth);
router.post("/send-otp", otpLimiter, authController.sendRegistrationOTP);
router.post("/verify-otp", otpLimiter, authController.verifyRegistrationOTP);
router.post("/resend-otp", otpLimiter, authController.resendOTP);
router.post("/forgot-password", otpLimiter, authController.forgotPassword);
router.post("/verify-reset-otp", otpLimiter, authController.verifyResetOTP);
router.post("/reset-password", otpLimiter, authController.resetPassword);

module.exports = router;
