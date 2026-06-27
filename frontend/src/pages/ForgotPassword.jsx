import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/ui/Button";
import { Alert, Field, TextInput } from "../components/ui/Kit";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    toast.success("Reset instructions prepared");
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter your email and we will prepare the next step for your account."
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Email address">
          <TextInput
            leftIcon={Mail}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            required
          />
        </Field>

        {sent && (
          <Alert type="success">
            If an account exists for {email}, the reset flow can be connected to the backend endpoint from here.
          </Alert>
        )}

        <Button type="submit" fullWidth size="lg">
          Continue
        </Button>
      </form>

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
