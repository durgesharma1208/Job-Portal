import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import Button from "../components/ui/Button";
import {
  Alert,
  Field,
  PageShell,
  SectionHeader,
  SelectInput,
  TextInput,
} from "../components/ui/Kit";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    company: "",
    logo: "",
    posted: "Just now",
    role: "",
    type: "Full Time",
    level: "Entry Level",
    salary: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/job/", jobData);

      if (response.data.success || response.status === 201) {
        toast.success("Job published successfully");
        setJobData({
          company: "",
          logo: "",
          posted: "Just now",
          role: "",
          type: "Full Time",
          level: "Entry Level",
          salary: "",
          location: "",
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Post a job"
        title="Create a new"
        highlight="opening"
        description="Publish a role to attract top-tier talent through the platform."
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

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Job type">
              <SelectInput name="type" value={jobData.type} onChange={handleChange}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
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

          <Button type="submit" fullWidth size="lg" loading={loading}>
            {loading ? "Publishing..." : "Publish job"}
          </Button>
        </form>
      </div>
    </PageShell>
  );
};

export default PostJob;