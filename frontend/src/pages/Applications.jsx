import { useEffect, useMemo, useState } from "react";
import { Mail, UserCheck, Users, BriefcaseBusiness, Bookmark } from "lucide-react";
import Button from "../components/ui/Button";
import {
  Alert,
  Avatar,
  Badge,
  EmptyState,
  PageLoader,
  PageShell,
  SearchInput,
  SectionHeader,
  StatCard,
} from "../components/ui/Kit";
import api from "@/api/axios";

const Applications = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user/allusers");
        setUsers(response.data.users || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const students = useMemo(() => users.filter((user) => user.role === "student"), [users]);
  const filteredStudents = useMemo(
    () =>
      students.filter((student) =>
        [student.name, student.email].join(" ").toLowerCase().includes(search.toLowerCase())
      ),
    [students, search]
  );

  const totalSavedJobs = students.reduce((acc, student) => acc + (student.savedJobs?.length || 0), 0);
  const totalApplications = students.reduce((acc, student) => acc + (student.appliedJobs?.length || 0), 0);

  if (loading) {
    return <PageLoader label="Loading applicants..." />;
  }

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Applicants"
        title="Candidate"
        highlight="pipeline"
        description="Review students, their saved roles, and application signals from one recruiter dashboard."
      />

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="Students" value={students.length} detail="visible" />
        <StatCard icon={Bookmark} label="Saved jobs" value={totalSavedJobs} detail="signals" tone="blue" />
        <StatCard icon={BriefcaseBusiness} label="Applications" value={totalApplications} detail="total" tone="violet" />
      </div>

      <div className="surface-card mb-6 p-4">
        <SearchInput
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search applicant by name or email"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No applicants found"
          description="Try a different search term or refresh once new candidates apply."
        />
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <article key={student._id} className="interactive-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar name={student.name} className="size-14" />
                  <div>
                    <h2 className="text-xl font-black text-text-strong">{student.name}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-text-muted">
                      <Mail className="size-4 text-primary" />
                      {student.email}
                    </p>
                  </div>
                </div>
                <Badge tone="green">Candidate</Badge>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border-soft bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-black text-text-strong">Saved jobs</h3>
                    <Badge tone="blue">{student.savedJobs?.length || 0}</Badge>
                  </div>
                  <div className="grid gap-2">
                    {(student.savedJobs || []).slice(0, 4).map((job, index) => (
                      <div key={job?._id || index} className="rounded-lg bg-surface-hover px-3 py-2 text-sm font-semibold text-text-muted">
                        {job?.role || job?.company || "Saved role"}
                      </div>
                    ))}
                    {!student.savedJobs?.length && <p className="text-sm text-text-subtle">No saved jobs yet.</p>}
                  </div>
                </div>

                <div className="rounded-lg border border-border-soft bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-black text-text-strong">Applications</h3>
                    <Badge tone="violet">{student.appliedJobs?.length || 0}</Badge>
                  </div>
                  <div className="grid gap-2">
                    {(student.appliedJobs || []).slice(0, 4).map((job, index) => (
                      <div key={job?._id || index} className="rounded-lg bg-surface-hover px-3 py-2 text-sm font-semibold text-text-muted">
                        {job?.role || job?.company || "Applied role"}
                      </div>
                    ))}
                    {!student.appliedJobs?.length && <p className="text-sm text-text-subtle">No applications yet.</p>}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" leftIcon={UserCheck}>View profile</Button>
                <Button size="sm" variant="secondary" leftIcon={Mail}>Contact</Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default Applications;
