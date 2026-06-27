import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, User } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Field, SelectInput, TextInput } from "../components/ui/Kit";
import api from "../lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/user/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      toast.success("Account created");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Join JobSearch"
      subtitle="Create a candidate or recruiter workspace in under a minute."
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
            placeholder="Create password"
            required
          />
        </Field>

        <Field label="Confirm password">
          <TextInput
            leftIcon={Lock}
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />
        </Field>

        <Field label="Workspace">
          <SelectInput name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </SelectInput>
        </Field>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create account
        </Button>
      </form>

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
