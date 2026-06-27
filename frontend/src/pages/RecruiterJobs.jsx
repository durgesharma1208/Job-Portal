import { Link } from "react-router-dom";
import { BriefcaseBusiness, Eye, FilePlus2, MapPin, MoreHorizontal, PencilLine, Users } from "lucide-react";
import Button from "../components/ui/Button";
import {
  Alert,
  Avatar,
  Badge,
  EmptyState,
  PageShell,
  SectionHeader,
  SkeletonCard,
  StatCard,
  TableShell,
} from "../components/ui/Kit";
import { useJobs } from "../hooks/useJobs";

const RecruiterJobs = () => {
  const { jobs, loading, error, usingFallback } = useJobs();
  const ownedJobs = jobs.slice(0, 8);

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Recruiter jobs"
        title="Manage your"
        highlight="open roles"
        description="Review active listings, visibility, and applicant demand from one polished workspace."
        actions={
          <Link to="/post-job">
            <Button leftIcon={FilePlus2}>Post job</Button>
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={BriefcaseBusiness} label="Open roles" value={ownedJobs.length} detail={usingFallback ? "demo" : "live"} />
        <StatCard icon={Users} label="Applicants" value="156" detail="+18%" tone="blue" />
        <StatCard icon={Eye} label="Role views" value="8.4K" detail="30d" tone="violet" />
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : ownedJobs.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No recruiter jobs yet"
          description="Post your first role and manage candidates from this workspace."
          action={
            <Link to="/post-job">
              <Button leftIcon={FilePlus2}>Post a role</Button>
            </Link>
          }
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[820px] text-left">
            <thead className="border-b border-border-soft bg-surface-hover text-xs font-black uppercase tracking-[0.16em] text-text-faint">
              <tr>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Applicants</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {ownedJobs.map((job, index) => (
                <tr key={job._id} className="transition hover:bg-surface-hover">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={job.logo} name={job.company} className="bg-white" />
                      <div>
                        <p className="font-black text-text-strong">{job.role}</p>
                        <p className="text-sm text-text-muted">{job.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4 text-primary" />
                      {job.location}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone="blue">{job.type}</Badge>
                  </td>
                  <td className="px-5 py-4 font-black text-text">{24 + index * 7}</td>
                  <td className="px-5 py-4">
                    <Badge tone={index % 3 === 0 ? "amber" : "green"}>
                      {index % 3 === 0 ? "Review" : "Live"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" leftIcon={PencilLine}>Edit</Button>
                      <Button variant="ghost" size="sm" leftIcon={MoreHorizontal}>More</Button>
                    </div>
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

export default RecruiterJobs;
