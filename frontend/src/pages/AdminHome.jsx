import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BriefcaseBusiness, FileText, Settings, Users } from "lucide-react";
import Button from "../components/ui/Button";
import { Badge, PageShell, SectionHeader, StatCard, staggerContainer } from "../components/ui/Kit";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const adminLinks = [
  { label: "Manage users", path: "/manage-users", icon: Users, desc: "View, edit, and remove user accounts.", tone: "green" },
  { label: "Manage recruiters", path: "/manage-users", icon: Users, desc: "Approve recruiters and monitor activity.", tone: "blue" },
  { label: "Manage jobs", path: "/admin-jobs", icon: BriefcaseBusiness, desc: "Review, edit, and remove listings.", tone: "violet" },
  { label: "Applications", path: "/applications", icon: FileText, desc: "Monitor all platform applications.", tone: "amber" },
  { label: "Analytics", path: "/analytics", icon: BarChart3, desc: "View platform-wide data and metrics.", tone: "rose" },
  { label: "Settings", path: "/settings", icon: Settings, desc: "Configure platform-wide settings.", tone: "neutral" },
];

const AdminHome = () => {
  const { user } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = user?.name || localUser?.name || "Admin";

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Admin dashboard"
        title={`Welcome, ${adminName}`}
        highlight="platform control"
        description="Manage users, recruiters, jobs, and platform activities from one command center."
        actions={
          <Link to="/analytics">
            <Button rightIcon={ArrowRight}>Analytics</Button>
          </Link>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-6 grid gap-4 md:grid-cols-4"
      >
        <StatCard icon={Users} label="Students" value="1,250" detail="active" tone="green" />
        <StatCard icon={Users} label="Recruiters" value="85" detail="verified" tone="blue" />
        <StatCard icon={BriefcaseBusiness} label="Active jobs" value="320" detail="live" tone="violet" />
        <StatCard icon={FileText} label="Applications" value="4,580" detail="total" tone="amber" />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className="interactive-card flex flex-col justify-between p-6"
          >
            <div>
              <Badge tone={link.tone}>
                <link.icon className="size-3.5" />
                {link.label}
              </Badge>
              <p className="mt-4 text-sm leading-6 text-text-muted">{link.desc}</p>
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

export default AdminHome;