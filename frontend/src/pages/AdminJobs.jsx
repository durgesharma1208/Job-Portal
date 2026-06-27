import { BriefcaseBusiness, Eye, MapPin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  Alert,
  Avatar,
  Badge,
  EmptyState,
  PageLoader,
  PageShell,
  SectionHeader,
  StatCard,
  TableShell,
} from "../components/ui/Kit";
import { useJobs } from "../hooks/useJobs";

const AdminJobs = () => {
  const { jobs, loading, error, usingFallback } = useJobs();

  const handleDelete = (jobId) => {
    toast.success("Job removed (demo — connect backend for live delete)");
  };

  if (loading) {
    return <PageLoader label="Loading platform jobs..." />;
  }

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Admin jobs"
        title="All platform"
        highlight="job listings"
        description="Monitor, review, and remove job postings across the platform."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="Total jobs" value={jobs.length} detail={usingFallback ? "demo" : "live"} tone="green" />
        <StatCard icon={BriefcaseBusiness} label="Active listings" value={jobs.length} detail="published" tone="blue" />
        <StatCard icon={Eye} label="Total views" value="24.8K" detail="across all roles" tone="violet" />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      {jobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No jobs on the platform"
          description="Jobs will appear here once recruiters post them."
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[820px] text-left">
            <thead className="border-b border-border-soft bg-surface-hover text-xs font-black uppercase tracking-[0.16em] text-text-faint">
              <tr>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Salary</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {jobs.map((job) => (
                <tr key={job._id} className="transition hover:bg-surface-hover">
                  <td className="px-5 py-4 font-black text-text-strong">{job.role}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar src={job.logo} name={job.company} className="bg-white" />
                      <span className="font-semibold text-text-muted">{job.company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4 text-primary" />
                      {job.location}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone="blue">{job.type}</Badge>
                  </td>
                  <td className="px-5 py-4 font-black text-primary">{job.salary}</td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={Trash2}
                      onClick={() => handleDelete(job._id)}
                      className="text-rose"
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </PageShell>
  );
};

export default AdminJobs;