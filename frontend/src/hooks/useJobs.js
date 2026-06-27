import { useEffect, useMemo, useState } from "react";
import jobsData from "../data/Jobsdata";
import api from "../lib/api";

const normalizeJob = (job, index = 0) => ({
  ...job,
  _id: job._id || String(job.id || `${job.company}-${job.role}-${index}`),
  company: job.company || "Unknown Company",
  role: job.role || job.title || "Open Role",
  type: job.type || "Full Time",
  level: job.level || "Mid Level",
  salary: job.salary || "Competitive",
  location: job.location || "Remote",
  posted: job.posted || "Recently",
  logo:
    job.logo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || "JobSearch")}&background=0f9f7f&color=fff`,
});

export const sampleJobs = jobsData.map(normalizeJob);

export const filterJobs = (jobs, { query = "", type = "All", level = "All", location = "All" }) => {
  const normalizedQuery = query.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesQuery =
      !normalizedQuery ||
      [job.company, job.role, job.location, job.type, job.level]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesType = type === "All" || job.type === type;
    const matchesLevel = level === "All" || job.level === level;
    const matchesLocation =
      location === "All" ||
      job.location?.toLowerCase().includes(location.toLowerCase()) ||
      (location === "Remote" && job.type === "Remote");

    return matchesQuery && matchesType && matchesLevel && matchesLocation;
  });
};

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      setUsingFallback(false);

      try {
        const response = await api.get("/job");
        const data = Array.isArray(response.data) ? response.data : response.data?.jobs || [];
        if (!ignore) {
          setJobs(data.map(normalizeJob));
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Live jobs are unavailable. Showing curated examples.");
          setJobs(sampleJobs);
          setUsingFallback(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      ignore = true;
    };
  }, []);

  const meta = useMemo(() => {
    const types = ["All", ...new Set(jobs.map((job) => job.type).filter(Boolean))];
    const levels = ["All", ...new Set(jobs.map((job) => job.level).filter(Boolean))];
    const locations = ["All", "Remote", ...new Set(jobs.map((job) => job.location).filter(Boolean).slice(0, 8))];

    return { types, levels, locations };
  }, [jobs]);

  return { jobs, loading, error, usingFallback, meta };
};
