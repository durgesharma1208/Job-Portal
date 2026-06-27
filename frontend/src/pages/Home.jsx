import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Button from "../components/ui/Button";
import {
  Avatar,
  Badge,
  DetailLink,
  PageShell,
  ProgressBar,
  SectionHeader,
  StatCard,
  staggerContainer,
} from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";
import { sampleJobs } from "../hooks/useJobs";

const actions = [
  { label: "Browse jobs", path: "/jobs", icon: Search },
  { label: "Saved jobs", path: "/saved-jobs", icon: Bookmark },
  { label: "Application tracker", path: "/application-tracker", icon: CalendarCheck2 },
  { label: "Profile", path: "/profile", icon: FileText },
];

const Home = () => {
  const { user } = useAuth();
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
  const appliedJobs = JSON.parse(localStorage.getItem("AppliedJobs") || "[]");
  const recommendations = sampleJobs.slice(4, 8);

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Candidate dashboard"
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        highlight="ready to move?"
        description="A focused overview of your job search, from curated roles to application momentum."
        actions={
          <Link to="/jobs">
            <Button rightIcon={ArrowRight}>Explore jobs</Button>
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard icon={BriefcaseBusiness} label="Recommended roles" value={recommendations.length} detail="fresh" tone="green" />
        <StatCard icon={Bookmark} label="Saved jobs" value={savedJobs.length} detail="watchlist" tone="blue" />
        <StatCard icon={CheckCircle2} label="Applications" value={appliedJobs.length} detail="active" tone="violet" />
        <StatCard icon={TrendingUp} label="Profile strength" value="86%" detail="+12%" tone="amber" />
      </motion.div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone="green">
                <Sparkles className="size-3.5" />
                Curated for you
              </Badge>
              <h2 className="mt-3 text-2xl font-black text-text-strong">High-signal roles</h2>
            </div>
            <Link to="/search">
              <DetailLink>Advanced search</DetailLink>
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {recommendations.map((job) => (
              <Link
                key={job._id}
                to="/jobs"
                className="group flex flex-col gap-4 rounded-lg border border-border-soft bg-surface p-4 transition hover:border-primary/35 hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={job.logo} name={job.company} />
                  <div>
                    <h3 className="font-black text-text-strong">{job.role}</h3>
                    <p className="text-sm font-medium text-text-muted">{job.company} - {job.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="blue">{job.type}</Badge>
                  <Badge tone="violet">{job.level}</Badge>
                  <span className="text-sm font-black text-primary">{job.salary}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="grid gap-6">
          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-text-strong">Readiness</h2>
              <Badge tone="amber">
                <Clock3 className="size-3.5" />
                Live
              </Badge>
            </div>
            <div className="mt-5 grid gap-5">
              <ProgressBar label="Resume" value={88} />
              <ProgressBar label="Skills" value={74} tone="blue" />
              <ProgressBar label="Portfolio" value={63} tone="violet" />
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <h2 className="text-xl font-black text-text-strong">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              {actions.map((action) => (
                <Link
                  key={action.path}
                  to={action.path}
                  className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-3 text-sm font-bold text-text transition hover:bg-surface-hover"
                >
                  <span className="inline-flex items-center gap-3">
                    <action.icon className="size-4 text-primary" />
                    {action.label}
                  </span>
                  <ArrowRight className="size-4 text-text-faint" />
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
};

export default Home;
