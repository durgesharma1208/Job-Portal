import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BriefcaseBusiness, Clock, Info, MapPin, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";
import { Avatar, Badge } from "./ui/Kit";
import api from "@/api/axios";

const getStoredJobs = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const Jobicon = ({ job, onDetailsClick, onUnsaveSuccess }) => {
  const [isSaved, setIsSaved] = useState(() =>
    getStoredJobs("savedJobs").some((item) => item._id === job._id)
  );
  const [isApplied, setIsApplied] = useState(() =>
    getStoredJobs("AppliedJobs").some((item) => item._id === job._id)
  );
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleSaveToggle = async () => {
    setSaving(true);
    try {
      const res = await api.post(`/user/save/${job._id}`, {});

      if (res.data.success) {
        const savedJobs = getStoredJobs("savedJobs");

        if (isSaved) {
          const filteredJobs = savedJobs.filter((item) => item._id !== job._id);
          localStorage.setItem("savedJobs", JSON.stringify(filteredJobs));
          setIsSaved(false);
          toast.success("Removed from saved jobs");
          onUnsaveSuccess?.(job._id);
        } else {
          localStorage.setItem("savedJobs", JSON.stringify([...savedJobs, job]));
          setIsSaved(true);
          toast.success("Saved to your shortlist");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update saved jobs");
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (isApplied) {
      toast.error("You already applied for this role");
      return;
    }

    setApplying(true);
    try {
      const res = await api.post(`/user/apply/${job._id}`, {});

      if (res.data.success) {
        const appliedJobs = getStoredJobs("AppliedJobs");
        localStorage.setItem("AppliedJobs", JSON.stringify([...appliedJobs, job]));
        setIsApplied(true);
        toast.success(res.data.message || "Application submitted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="interactive-card flex min-h-[360px] flex-col p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={job.logo} name={job.company} className="size-12 bg-white" />
          <div>
            <h3 className="font-black text-text-strong">{job.company}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-text-subtle">
              <Clock className="size-3.5" />
              {job.posted}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveToggle}
          disabled={saving}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border-soft text-text-muted transition hover:border-primary/40 hover:bg-[var(--primary-soft)] hover:text-primary disabled:opacity-60"
          aria-label={isSaved ? "Remove saved job" : "Save job"}
        >
          <Bookmark className={isSaved ? "size-5 fill-primary text-primary" : "size-5"} />
        </button>
      </div>

      <div className="mt-6 flex-1">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="blue">
            <BriefcaseBusiness className="size-3.5" />
            {job.type}
          </Badge>
          <Badge tone="violet">{job.level}</Badge>
        </div>

        <h2 className="text-2xl font-black leading-tight tracking-tight text-text-strong">
          {job.role}
        </h2>

        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <MapPin className="size-4 text-primary" />
          {job.location}
        </p>
      </div>

      <div className="mt-6 border-t border-border-soft pt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-faint">Salary</p>
            <p className="mt-1 text-xl font-black text-primary">{job.salary}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={Info} onClick={onDetailsClick}>
              Details
            </Button>
            <Button
              size="sm"
              leftIcon={Send}
              loading={applying}
              disabled={isApplied}
              onClick={handleApply}
            >
              {isApplied ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default Jobicon;
