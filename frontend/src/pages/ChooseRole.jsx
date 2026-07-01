import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BriefcaseBusiness, GraduationCap, Sparkles, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Looking for internships and jobs to kickstart your career.",
    icon: GraduationCap,
    features: ["Browse internships & jobs", "Track applications", "Build your profile"],
    color: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/50",
    glow: "shadow-emerald-500/10",
    badge: "bg-emerald-500/10 text-emerald-400",
    btnClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Hire talented students and build your dream team.",
    icon: BriefcaseBusiness,
    features: ["Post job openings", "Review applications", "Manage candidates"],
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/50",
    glow: "shadow-blue-500/10",
    badge: "bg-blue-500/10 text-blue-400",
    btnClass: "bg-blue-500 hover:bg-blue-600 text-white",
  },
];

const ChooseRole = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleContinue = async (role) => {
    setSelected(role);
    setLoading(true);
    try {
      const res = await api.patch("/user/role", { role });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(`Welcome aboard as a ${role}!`);
      navigate(role === "student" ? "/student/profile/setup" : "/recruiter/profile/setup");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set role");
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-bg bg-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.12] via-accent/[0.06] to-transparent" />

      <div className="relative w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted transition hover:bg-surface-hover hover:text-text"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="size-4" /> One last step
          </div>
          <h1 className="text-4xl font-black tracking-tight text-text-strong sm:text-5xl">
            Choose your <span className="text-gradient">workspace</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-text-muted">
            Select how you want to use JobSearch. You can always update this later.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-2xl border-2 ${role.border} ${role.hoverBorder} ${role.glow} bg-bg/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isSelected ? "ring-2 ring-primary" : ""}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative z-10">
                  <div className={`mb-5 inline-flex rounded-xl ${role.badge} p-3`}>
                    <Icon className="size-8" />
                  </div>

                  <h2 className="mb-2 text-2xl font-black text-text-strong">{role.title}</h2>
                  <p className="mb-6 text-base leading-6 text-text-muted">{role.description}</p>

                  <ul className="mb-8 space-y-2.5">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleContinue(role.id)}
                    disabled={loading}
                    className={`${role.btnClass} inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold transition-all duration-200 disabled:opacity-60`}
                  >
                    {loading && selected === role.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Setting up...
                      </span>
                    ) : (
                      <>
                        Continue as {role.title}
                        <ArrowLeft className="size-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
