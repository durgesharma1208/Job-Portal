import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  FileText,
  MessagesSquare,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  Avatar,
  Badge,
  EmptyState,
  PageShell,
  ProgressBar,
  SectionHeader,
  StatCard,
  staggerContainer,
} from "../components/ui/Kit";

const getAppliedJobs = () => {
  try {
    return JSON.parse(localStorage.getItem("AppliedJobs") || "[]");
  } catch {
    return [];
  }
};

const stages = [
  { label: "Applied", icon: FileText, tone: "green" },
  { label: "Screening", icon: CircleDot, tone: "blue" },
  { label: "Interview", icon: MessagesSquare, tone: "violet" },
  { label: "Decision", icon: BadgeCheck, tone: "amber" },
];

const ApplicationTracker = () => {
  const appliedJobs = getAppliedJobs();
  const progress = appliedJobs.length ? Math.min(92, 28 + appliedJobs.length * 18) : 0;

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Application tracker"
        title="Pipeline clarity"
        highlight="without the spreadsheet"
        description="A calm overview of application movement, upcoming follow-ups, and where each role sits."
        actions={
          <Link to="/applied-jobs">
            <Button variant="secondary" rightIcon={ArrowRight}>Applied jobs</Button>
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-6 grid gap-4 md:grid-cols-3"
      >
        <StatCard icon={BriefcaseBusiness} label="Tracked roles" value={appliedJobs.length} detail="active" />
        <StatCard icon={CalendarClock} label="Next follow-up" value={appliedJobs.length ? "2d" : "-"} detail="planned" tone="blue" />
        <StatCard icon={CheckCircle2} label="Profile fit" value={`${progress || 64}%`} detail="score" tone="violet" />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-strong">Overall momentum</h2>
            <Badge tone="green">Live</Badge>
          </div>
          <div className="mt-6">
            <ProgressBar value={progress || 64} label="Application readiness" />
          </div>
          <div className="mt-6 grid gap-3">
            {stages.map((stage, index) => (
              <div key={stage.label} className="flex items-center gap-3 rounded-lg border border-border-soft p-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-surface-hover text-primary">
                  <stage.icon className="size-4" />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-text">{stage.label}</p>
                  <p className="text-xs text-text-subtle">Stage {index + 1} of {stages.length}</p>
                </div>
                <Badge tone={stage.tone}>{index === 0 ? appliedJobs.length : Math.max(0, appliedJobs.length - index)}</Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <h2 className="text-xl font-black text-text-strong">Tracked roles</h2>
          <div className="mt-5 grid gap-3">
            {appliedJobs.length === 0 ? (
              <EmptyState
                icon={BriefcaseBusiness}
                title="No roles in the tracker"
                description="Apply to your first role and the tracker will build a timeline around it."
                action={
                  <Link to="/jobs">
                    <Button>Browse jobs</Button>
                  </Link>
                }
              />
            ) : (
              appliedJobs.map((job, index) => {
                const stage = stages[Math.min(index % stages.length, stages.length - 1)];
                return (
                  <article key={job._id || index} className="rounded-lg border border-border-soft bg-surface p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={job.logo} name={job.company} className="bg-white" />
                        <div>
                          <h3 className="font-black text-text-strong">{job.role}</h3>
                          <p className="text-sm font-medium text-text-muted">{job.company}</p>
                        </div>
                      </div>
                      <Badge tone={stage.tone}>{stage.label}</Badge>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      {stages.map((item, stageIndex) => (
                        <div
                          key={item.label}
                          className={`h-2 rounded-full ${stageIndex <= index % stages.length ? "bg-primary" : "bg-bg-subtle"}`}
                        />
                      ))}
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default ApplicationTracker;
