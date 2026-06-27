import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BriefcaseBusiness, Search } from "lucide-react";
import Jobicon from "../components/Jobicon";
import JobDetailsModal from "./JobDetailsModal";
import Button from "../components/ui/Button";
import { EmptyState, PageShell, SectionHeader, SkeletonCard } from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";

const getLocalSavedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem("savedJobs") || "[]");
  } catch {
    return [];
  }
};

const SavedJobs = () => {
  const { user } = useAuth();
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user) {
        setJobsList(getLocalSavedJobs());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get("/user/me");
        if (res.data.success && res.data.user) {
          const validJobs = (res.data.user.savedJobs || []).filter(
            (job) => job && typeof job === "object"
          );
          setJobsList(validJobs);
          localStorage.setItem("savedJobs", JSON.stringify(validJobs));
        }
      } catch {
        setJobsList(getLocalSavedJobs());
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user]);

  const handleRemoveFromUI = (id) => {
    setJobsList((prev) => prev.filter((job) => job._id !== id));
  };

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Saved jobs"
        title="Your curated"
        highlight="shortlist"
        description={`You have ${jobsList.length} role${jobsList.length === 1 ? "" : "s"} saved for deeper review.`}
        actions={
          <Link to="/jobs">
            <Button leftIcon={Search}>Browse more</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : jobsList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobsList.map((job, index) => (
            <Jobicon
              key={job._id || `saved-${index}`}
              job={job}
              onDetailsClick={() => setSelectedJob(job)}
              onUnsaveSuccess={handleRemoveFromUI}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Build a shortlist of roles worth revisiting before you apply."
          action={
            <Link to="/jobs">
              <Button leftIcon={BriefcaseBusiness}>Browse jobs</Button>
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

export default SavedJobs;
