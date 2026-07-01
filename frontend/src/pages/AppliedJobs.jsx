import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, CalendarCheck2, CheckCircle2, Clock3, Search } from "lucide-react";
import Jobicon from "../components/Jobicon";
import JobDetailsModal from "./JobDetailsModal";
import Button from "../components/ui/Button";
import {
  Badge,
  EmptyState,
  PageShell,
  SectionHeader,
  StatCard,
  staggerContainer,
} from "../components/ui/Kit";
import api from "@/api/axios";
import { motion } from "framer-motion";

const getLocalAppliedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem("AppliedJobs") || "[]");
  } catch {
    return [];
  }
};

const AppliedJobs = () => {
  const [jobs, setJobs] = useState(getLocalAppliedJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchAppliedJobs = async () => {
      try {
        const response = await api.get("/user/me");
        const nextJobs = (response.data.user?.appliedJobs || []).filter(Boolean);
        if (!ignore && nextJobs.length > 0) {
          setJobs(nextJobs);
          localStorage.setItem("AppliedJobs", JSON.stringify(nextJobs));
        }
      } catch {
        if (!ignore) setJobs(getLocalAppliedJobs());
      }
    };

    fetchAppliedJobs();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Applied jobs"
        title="Every active"
        highlight="application"
        description="Review the roles you have applied to and jump back into details when conversations pick up."
        actions={
          <Link to="/application-tracker">
            <Button leftIcon={CalendarCheck2}>Open tracker</Button>
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-6 grid gap-4 md:grid-cols-3"
      >
        <StatCard icon={BriefcaseBusiness} label="Applications" value={jobs.length} detail="total" tone="green" />
        <StatCard icon={Clock3} label="In review" value={Math.max(0, jobs.length - 1)} detail="pipeline" tone="blue" />
        <StatCard icon={CheckCircle2} label="Ready follow-ups" value={jobs.length ? 1 : 0} detail="today" tone="violet" />
      </motion.div>

      {jobs.length > 0 ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge tone="green">Applied</Badge>
            <Badge tone="blue">Screening</Badge>
            <Badge tone="violet">Interview ready</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job, index) => (
              <Jobicon
                key={job._id || `applied-${index}`}
                job={job}
                onDetailsClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No applications yet"
          description="Apply to a role from the jobs catalog and it will appear here automatically."
          action={
            <Link to="/jobs">
              <Button leftIcon={Search}>Find roles</Button>
            </Link>
          }
        />
      )}

      <JobDetailsModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob || {}}
      />
    </PageShell>
  );
};

export default AppliedJobs;
