import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, User } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "../components/AuthLayout";
import OtpVerification from "../components/OtpVerification";
import Button from "../components/ui/Button";
import { Field, SelectInput, TextInput } from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";

const roleDestinations = {
  admin: "/AdminHome",
  recruiter: "/RecruiterHome",
  student: "/home",
};

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [step, setStep] = useState("form");
  const [remainingResend, setRemainingResend] = useState(null);
  const [otpResetKey, setOtpResetKey] = useState(0);
  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const registrationPayload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password,
    role: formData.role,
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const nextUser = res.data.user;
      const { newUser } = res.data;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (newUser) {
        toast.success("Account created! Choose your role.");
        navigate("/choose-role");
      } else {
        toast.success("Welcome back");
        navigate(roleDestinations[nextUser.role] || "/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const sendOtp = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/send-otp", registrationPayload);
      setRemainingResend(response.data.remainingResend);
      setStep("otp");
      setOtpResetKey((key) => key + 1);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { ...registrationPayload, otp });
      toast.success("Account verified and created");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      const response = await api.post("/auth/resend-otp", {
        email: formData.email.trim(),
        purpose: "register",
      });
      setRemainingResend(response.data.remainingResend);
      toast.success("OTP resent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join JobSearch"
      subtitle="Create a candidate or recruiter workspace in under a minute."
    >
      {step === "form" ? (
        <form onSubmit={sendOtp} className="grid gap-4">
          <Field label="Full name">
            <TextInput leftIcon={User} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aarav Mehta" required />
          </Field>

          <Field label="Email address">
            <TextInput leftIcon={Mail} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" required />
          </Field>

          <Field label="Password">
            <TextInput leftIcon={Lock} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" required />
          </Field>

          <Field label="Confirm password">
            <TextInput leftIcon={Lock} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required />
          </Field>

          <Field label="Workspace">
            <SelectInput name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </SelectInput>
          </Field>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Send OTP
          </Button>
        </form>
      ) : (
        <OtpVerification
          key={otpResetKey}
          email={formData.email.trim()}
          title="Verify your email"
          onVerify={verifyOtp}
          onResend={resendOtp}
          loading={loading}
          resending={resending}
          remainingResend={remainingResend}
          buttonLabel="Verify and create account"
        />
      )}

      {step === "otp" && (
        <Button type="button" variant="ghost" fullWidth className="mt-4" onClick={() => setStep("form")}>
          Edit registration details
        </Button>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-soft" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--surface)] px-2 text-text-muted">or continue with</span>
        </div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google sign-in failed")}
          theme="outline"
          size="large"
          shape="rectangular"
          width="400"
        />
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already registered?{" "}
        <Link to="/login" className="font-bold text-primary hover:text-primary-hover">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
