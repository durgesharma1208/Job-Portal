import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Field, SelectInput, TextInput } from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";
import { GoogleLogin } from "@react-oauth/google";
const roleDestinations = {
  admin: "/AdminHome",
  recruiter: "/RecruiterHome",
  student: "/home",
};

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
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
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
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

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/user/login", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      const nextUser = response.data.user;
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Welcome back");
      if (nextUser.role && !nextUser.profileCompleted) {
        const setupPath = nextUser.role === "student" ? "/student/profile/setup" : "/recruiter/profile/setup";
        navigate(setupPath);
      } else {
        navigate(roleDestinations[nextUser.role] || "/home");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to JobSearch"
      subtitle="Continue to your tailored hiring workspace."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Full name">
          <TextInput
            leftIcon={User}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Aarav Mehta"
            required
          />
        </Field>

        <Field label="Email address">
          <TextInput
            leftIcon={Mail}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />
        </Field>

        <Field label="Password">
          <TextInput
            leftIcon={Lock}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </Field>

        <Field label="Workspace">
          <SelectInput name="role" value={formData.role} onChange={handleChange} required>
            <option value="student">Candidate</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </SelectInput>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-semibold text-primary hover:text-primary-hover">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Login
        </Button>
      </form>

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
        New here?{" "}
        <Link to="/register" className="font-bold text-primary hover:text-primary-hover">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
