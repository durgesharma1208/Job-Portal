import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BriefcaseBusiness, Sparkles, Building2, Globe, User, Phone, Link2, MapPin, Hash, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";

const RecruiterProfileSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: "",
    designation: "",
    industry: "",
    companySize: "",
    website: "",
    companyDescription: "",
    phone: "",
    linkedin: "",
    location: "",
  });

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch("/user/profile", formData);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Company profile completed successfully!");
      navigate("/RecruiterHome");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg bg-grid relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.12] via-accent/[0.06] to-transparent" />

      <div className="relative mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/choose-role")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <ArrowLeft className="size-4" /> Change role
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="size-4" /> Company Profile
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text-strong sm:text-4xl">
            Set up your <span className="text-gradient">company</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-6 text-text-muted">
            Showcase your company to attract the best talent.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="surface-card space-y-6 p-6 sm:p-8"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Your Name" icon={User}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Priya Sharma" className="input-premium h-11 w-full px-3.5 text-sm" required />
            </Field>

            <Field label="Designation" icon={User}>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="HR Manager / CTO" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Company Name" icon={Building2}>
              <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Industry" icon={BriefcaseBusiness}>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Technology / Finance / Healthcare" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Company Size" icon={Hash}>
              <select name="companySize" value={formData.companySize} onChange={handleChange} className="input-premium h-11 w-full px-3.5 text-sm">
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </Field>

            <Field label="Website" icon={Globe}>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://acmecorp.com" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Phone" icon={Phone}>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="LinkedIn URL" icon={Link2}>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/company/acmecorp" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Location" icon={MapPin}>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Bangalore, India" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>
          </div>

          <Field label="Company Description" icon={FileText}>
            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Tell candidates about your company, culture, and mission..." className="input-premium min-h-28 w-full resize-y px-3.5 py-3 text-sm" />
          </Field>

          <div className="flex items-center gap-4 border-t border-border-soft pt-6">
            <button
              type="button"
              onClick={() => navigate("/choose-role")}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-text-muted transition hover:bg-surface-hover hover:text-text"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-contrast shadow-[0_16px_34px_-22px_var(--primary)] transition-all hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  Complete Profile
                  <ArrowLeft className="size-4 rotate-180" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

const Field = ({ label, icon: Icon, children }) => (
  <label className="block">
    <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-text">
      {Icon && <Icon className="size-3.5 text-text-muted" />}
      {label}
    </span>
    {children}
  </label>
);

export default RecruiterProfileSetup;
