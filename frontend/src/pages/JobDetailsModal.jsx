import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BriefcaseBusiness,
  Clock,
  DollarSign,
  MapPin,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Avatar, Badge } from "../components/ui/Kit";
import { toast } from "react-hot-toast";
import api from "@/api/axios";

const details = [
  { key: "location", label: "Location", icon: MapPin },
  { key: "posted", label: "Posted", icon: Clock },
  { key: "type", label: "Type", icon: BriefcaseBusiness },
  { key: "level", label: "Level", icon: BarChart3 },
];

const expectations = [
  "Own product-quality interfaces across responsive web surfaces.",
  "Collaborate closely with design, product, and backend teams.",
  "Use measurable user feedback to improve workflows after launch.",
];

const getAppliedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem("AppliedJobs") || "[]");
  } catch {
    return [];
  }
};

const JobDetailsModal = ({ isOpen, onClose, job }) => {
  const [applying, setApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(
    () => job?._id ? getAppliedJobs().some((item) => item._id === job._id) : false
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleApply = async () => {
    if (isApplied) {
      toast.error("You already applied for this role");
      return;
    }

    setApplying(true);
    try {
      const response = await api.post(`/user/apply/${job._id}`, {});
      if (response.data.success) {
        localStorage.setItem("AppliedJobs", JSON.stringify([...getAppliedJobs(), job]));
        setIsApplied(true);
        toast.success(response.data.message || "Application submitted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/[0.55] px-3 pb-3 pt-16 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${job.role || "Job"} details`}
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="surface-card max-h-[88vh] w-full max-w-3xl overflow-hidden"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border-soft p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <Avatar src={job.logo} name={job.company} className="size-14 bg-white" />
                <div>
                  <Badge tone="green">
                    <ShieldCheck className="size-3.5" />
                    Verified opening
                  </Badge>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-text-strong">{job.role}</h2>
                  <p className="mt-1 text-base font-bold text-text-muted">{job.company}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Close job details"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(88vh-100px)] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="rounded-lg border border-border-soft bg-surface p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-faint">{item.label}</p>
                          <p className="mt-1 font-black text-text-strong">{job[item.key] || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-lg border border-primary/20 bg-[var(--primary-soft)] p-5">
                <div className="flex items-center gap-3">
                  <DollarSign className="size-6 text-primary" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Compensation</p>
                    <p className="text-2xl font-black text-primary">{job.salary || "Competitive"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-black text-text-strong">What you will do</h3>
                <div className="mt-3 grid gap-3">
                  {expectations.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 text-text-muted">
                      <span className="mt-1.5 size-2 rounded-full bg-primary" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button leftIcon={Send} fullWidth onClick={handleApply} loading={applying} disabled={isApplied}>
                  {isApplied ? "Applied" : "Apply now"}
                </Button>
                <Button variant="secondary" fullWidth onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobDetailsModal;
