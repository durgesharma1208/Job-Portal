import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axios";
import Button from "../components/ui/Button";
import {
  Alert,
  Field,
  PageLoader,
  PageShell,
  SectionHeader,
  SelectInput,
  TextareaInput,
  TextInput,
} from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";

const emptyJob = {
  company: "",
  logo: "",
  posted: "Just now",
  role: "",
  type: "Full Time",
  level: "Entry Level",
  salary: "",
  location: "",
  description: "",
  requirements: "",
  skills: "",
  deadline: "",
  category: "",
  vacancies: "",
  benefits: "",
};

const joinList = (value) => (Array.isArray(value) ? value.join(", ") : value || "");

const splitList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const formatDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const [jobData, setJobData] = useState(emptyJob);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return undefined;

    let cancelled = false;
    const fetchJob = async () => {
      setFetching(true);
      setError("");
      try {
        const response = await api.get(`/jobs/${id}`);
        const job = response.data.job;
        if (!cancelled) {
          setJobData({
            company: job.company || "",
            logo: job.logo || "",
            posted: job.posted || "Recently",
            role: job.role || job.title || "",
            type: job.type || job.jobType || "Full Time",
            level: job.level || job.experience || "Entry Level",
            salary: job.salary || "",
            location: job.location || "",
            description: job.description || "",
            requirements: joinList(job.requirements),
            skills: joinList(job.skills),
            deadline: formatDateInput(job.deadline),
            category: job.category || "",
            vacancies: job.vacancies ?? "",
            benefits: joinList(job.benefits),
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Unable to load job.");
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    fetchJob();
    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    ...jobData,
    requirements: splitList(jobData.requirements),
    skills: splitList(jobData.skills),
    benefits: splitList(jobData.benefits),
    vacancies: jobData.vacancies === "" ? undefined : Number(jobData.vacancies),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = buildPayload();
      const response = isEditing
        ? await api.put(`/jobs/${id}`, payload)
        : await api.post("/job/", payload);

      if (response.data.success || response.status === 201) {
        toast.success(isEditing ? "Job updated successfully" : "Job published successfully");
        if (isEditing) {
          navigate(user?.role === "admin" ? "/admin-jobs" : "/recruiter-jobs");
        } else {
          setJobData(emptyJob);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || (isEditing ? "Failed to update job." : "Failed to post job."));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <PageLoader label="Loading job..." />;
  }

  return (
    <PageShell>
      <SectionHeader
        eyebrow={isEditing ? "Edit job" : "Post a job"}
        title={isEditing ? "Update this" : "Create a new"}
        highlight="opening"
        description={isEditing ? "Modify the role details and save the latest version." : "Publish a role to attract top-tier talent through the platform."}
      />

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      <div className="surface-card mx-auto max-w-3xl p-5 sm:p-7">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company name">
              <TextInput name="company" value={jobData.company} onChange={handleChange} required placeholder="e.g. Google" />
            </Field>
            <Field label="Logo URL">
              <TextInput name="logo" value={jobData.logo} onChange={handleChange} placeholder="https://logo.clearbit.com/google.com" />
            </Field>
          </div>

          <Field label="Job title">
            <TextInput name="role" value={jobData.role} onChange={handleChange} required placeholder="e.g. Frontend Engineer" />
          </Field>

          <Field label="Description">
            <TextareaInput name="description" value={jobData.description} onChange={handleChange} placeholder="Describe the role, team, and impact." />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Job type">
              <SelectInput name="type" value={jobData.type} onChange={handleChange}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </SelectInput>
            </Field>
            <Field label="Experience level">
              <SelectInput name="level" value={jobData.level} onChange={handleChange}>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </SelectInput>
            </Field>
            <Field label="Posted">
              <TextInput name="posted" value={jobData.posted} onChange={handleChange} required placeholder="e.g. 2 days ago" />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Salary">
              <TextInput name="salary" value={jobData.salary} onChange={handleChange} required placeholder="e.g. $80/hour" />
            </Field>
            <Field label="Location">
              <TextInput name="location" value={jobData.location} onChange={handleChange} required placeholder="e.g. Bangalore, India" />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <TextInput name="category" value={jobData.category} onChange={handleChange} placeholder="e.g. Engineering" />
            </Field>
            <Field label="Vacancies">
              <TextInput type="number" min="0" name="vacancies" value={jobData.vacancies} onChange={handleChange} placeholder="e.g. 3" />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Deadline">
              <TextInput type="date" name="deadline" value={jobData.deadline} onChange={handleChange} />
            </Field>
            <Field label="Skills">
              <TextInput name="skills" value={jobData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </Field>
          </div>

          <Field label="Requirements">
            <TextareaInput name="requirements" value={jobData.requirements} onChange={handleChange} placeholder="Comma-separated requirements" />
          </Field>

          <Field label="Benefits">
            <TextareaInput name="benefits" value={jobData.benefits} onChange={handleChange} placeholder="Health insurance, Remote setup, Learning budget" />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? (isEditing ? "Updating..." : "Publishing...") : (isEditing ? "Update job" : "Publish job")}
            </Button>
            {isEditing && (
              <Button type="button" variant="secondary" fullWidth size="lg" onClick={() => navigate(user?.role === "admin" ? "/admin-jobs" : "/recruiter-jobs")}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </PageShell>
  );
};

export default PostJob;
