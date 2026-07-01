import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import OtpVerification from "../components/OtpVerification";
import Button from "../components/ui/Button";
import { Alert, Field, TextInput } from "../components/ui/Kit";
import api from "@/api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [remainingResend, setRemainingResend] = useState(null);
  const [resetToken, setResetToken] = useState("");
  const [otpResetKey, setOtpResetKey] = useState(0);

  const normalizedEmail = email.trim();

  const sendResetOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email: normalizedEmail });
      setRemainingResend(response.data.remainingResend);
      setStep("otp");
      setOtpResetKey((key) => key + 1);
      toast.success("If the account exists, an OTP has been sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOtp = async (otp) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/verify-reset-otp", { email: normalizedEmail, otp });
      setResetToken(response.data.resetToken);
      setStep("reset");
      toast.success("OTP verified");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendResetOtp = async () => {
    setResending(true);
    try {
      const response = await api.post("/auth/resend-otp", {
        email: normalizedEmail,
        purpose: "reset",
      });
      setRemainingResend(response.data.remainingResend);
      toast.success("OTP resent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: normalizedEmail,
        resetToken,
        password,
      });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Verify your email with an OTP before choosing a new password."
    >
      {step === "email" && (
        <form onSubmit={sendResetOtp} className="grid gap-4">
          <Field label="Email address">
            <TextInput leftIcon={Mail} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required />
          </Field>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Send OTP
          </Button>
        </form>
      )}

      {step === "otp" && (
        <OtpVerification
          key={otpResetKey}
          email={normalizedEmail}
          title="Verify reset OTP"
          onVerify={verifyResetOtp}
          onResend={resendResetOtp}
          loading={loading}
          resending={resending}
          remainingResend={remainingResend}
          buttonLabel="Verify OTP"
        />
      )}

      {step === "reset" && (
        <form onSubmit={resetPassword} className="grid gap-4">
          <Alert type="success">OTP verified. Create a new password for {normalizedEmail}.</Alert>
          <Field label="New password">
            <TextInput leftIcon={Lock} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" required />
          </Field>
          <Field label="Confirm new password">
            <TextInput leftIcon={Lock} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm new password" required />
          </Field>
          <Button type="submit" fullWidth size="lg" loading={loading}>
            Reset password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        Remembered it?{" "}
        <Link to="/login" className="font-bold text-primary hover:text-primary-hover">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
