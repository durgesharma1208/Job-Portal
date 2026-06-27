import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, FilePlus2, Users } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import { Badge, PageShell, SectionHeader, StatCard, staggerContainer } from "../components/ui/Kit";
import { useAuth } from "../hooks/useAuth";

const recruiterActions = [
  { label: "Post a job", path: "/post-job", icon: FilePlus2, desc: "Create a new opportunity and start receiving applications.", tone: "blue" },
  { label: "View applicants", path: "/applications", icon: Users, desc: "Review applications and shortlist top candidates.", tone: "violet" },
  { label: "Manage jobs", path: "/recruiter-jobs", icon: BriefcaseBusiness, desc: "Edit, close, or republish your active listings.", tone: "green" },
  { label: "Candidate pipeline", path: "/applications", icon: Eye, desc: "Track candidate progress through your hiring stages.", tone: "amber" },
];

const RecruiterHome = () => {
  const { user } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const recruiterName = user?.name || localUser?.name || "Recruiter";

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Recruiter dashboard"
        title={`Welcome back, ${recruiterName}`}
        highlight="ready to hire?"
        description="A focused overview of your active roles, applicant flow, and hiring velocity."
        actions={
          <Link to="/post-job">
            <Button leftIcon={FilePlus2} rightIcon={ArrowRight}>Post a job</Button>
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-6 grid gap-4 md:grid-cols-3"
      >
        <StatCard icon={BriefcaseBusiness} label="Active jobs" value="12" detail="live" tone="green" />
        <StatCard icon={Users} label="Applications" value="156" detail="+18% vs last month" tone="blue" />
        <StatCard icon={Eye} label="Shortlisted" value="28" detail="in review" tone="violet" />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {recruiterActions.map((action) => (
          <Link
            key={action.label}
            to={action.path}
            className="interactive-card flex flex-col justify-between p-6"
          >
            <div>
              <Badge tone={action.tone}>
                <action.icon className="size-3.5" />
                {action.label}
              </Badge>
              <p className="mt-4 text-sm leading-6 text-text-muted">{action.desc}</p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-bold text-primary">
              Open <ArrowRight className="size-4" />
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
};

export default RecruiterHome;