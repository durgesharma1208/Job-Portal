import { motion } from "framer-motion";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Badge,
  PageShell,
  ProgressBar,
  SectionHeader,
  StatCard,
  staggerContainer,
} from "../components/ui/Kit";

const metrics = [
  { icon: Users, label: "Total users", value: "1,335", detail: "+12% vs last month", tone: "green" },
  { icon: BriefcaseBusiness, label: "Active jobs", value: "320", detail: "+18 new this week", tone: "blue" },
  { icon: FileText, label: "Applications", value: "4,580", detail: "92% reviewed", tone: "violet" },
  { icon: TrendingUp, label: "Hire rate", value: "8.2%", detail: "+1.4% improvement", tone: "amber" },
];

const breakdowns = [
  { label: "Student accounts", value: 82, total: 100 },
  { label: "Recruiter accounts", value: 12, total: 100 },
  { label: "Admin accounts", value: 6, total: 100 },
  { label: "Job fill rate", value: 68, total: 100 },
  { label: "Profile completion", value: 74, total: 100 },
];

const Analytics = () => {
  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="Analytics"
        title="Platform"
        highlight="insights"
        description="Key metrics on user growth, job activity, and hiring momentum across the ecosystem."
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-strong">Ecosystem health</h2>
            <Badge tone="green">Live</Badge>
          </div>
          <div className="mt-6 grid gap-5">
            {breakdowns.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <h2 className="text-xl font-black text-text-strong">Quick stats</h2>
          <div className="mt-5 grid gap-4">
            {[
              { label: "Avg. time to hire", value: "18 days" },
              { label: "Applications per job", value: "14.3" },
              { label: "Profile views (30d)", value: "12.4K" },
              { label: "Saved jobs (total)", value: "2,847" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-lg border border-border-soft bg-surface p-4"
              >
                <span className="text-sm font-semibold text-text-muted">{stat.label}</span>
                <span className="font-black text-text-strong">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default Analytics;