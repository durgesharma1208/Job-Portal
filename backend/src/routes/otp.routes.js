const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.controller");

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", otpController.resendOTP);
router.post("/forgot-password", otpController.forgotPassword);
router.post("/verify-reset-otp", otpController.verifyResetOTP);
router.post("/reset-password", otpController.resetPassword);

module.exports = router;
