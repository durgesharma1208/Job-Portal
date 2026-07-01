import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Sparkles, User, Phone, Building2, BookOpen, GitBranch, MapPin, Globe, Link2, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";

const StudentProfileSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    skills: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
    portfolio: "",
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
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const res = await api.patch("/user/profile", payload);
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile completed successfully!");
      navigate("/home");
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
            <Sparkles className="size-4" /> Student Profile
          </div>
          <h1 className="text-3xl font-black tracking-tight text-text-strong sm:text-4xl">
            Complete your <span className="text-gradient">profile</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-6 text-text-muted">
            Help employers discover you. Fill in your details to get started.
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
            <Field label="Full Name" icon={User}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Aarav Mehta" className="input-premium h-11 w-full px-3.5 text-sm" required />
            </Field>

            <Field label="Phone" icon={Phone}>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="College / University" icon={Building2}>
              <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="Indian Institute of Technology" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Degree" icon={GraduationCap}>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="B.Tech in Computer Science" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Branch / Major" icon={BookOpen}>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Computer Science" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Year of Study" icon={GraduationCap}>
              <select name="year" value={formData.year} onChange={handleChange} className="input-premium h-11 w-full px-3.5 text-sm">
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
                <option value="Graduated">Graduated</option>
              </select>
            </Field>
          </div>

          <Field label="Skills (comma-separated)" icon={GitBranch}>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python, MongoDB" className="input-premium h-11 w-full px-3.5 text-sm" />
          </Field>

          <Field label="Bio" icon={Info}>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell employers about yourself..." className="input-premium min-h-24 w-full resize-y px-3.5 py-3 text-sm" />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Location" icon={MapPin}>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Mumbai, India" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="Portfolio URL" icon={Link2}>
              <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://your-portfolio.com" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="GitHub URL" icon={Globe}>
              <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/username" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>

            <Field label="LinkedIn URL" icon={Link2}>
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="input-premium h-11 w-full px-3.5 text-sm" />
            </Field>
          </div>

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

export default StudentProfileSetup;
