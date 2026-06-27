import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Button from "../components/ui/Button";
import { Badge, DetailLink, ProgressBar, staggerContainer, revealItem } from "../components/ui/Kit";
import { sampleJobs } from "../hooks/useJobs";

const logos = ["Linear", "Vercel", "Stripe", "Figma", "GitHub", "Airbnb", "Raycast", "Cursor"];

const stats = [
  { value: "42K+", label: "active candidates" },
  { value: "8.7K", label: "premium openings" },
  { value: "91%", label: "profile match rate" },
  { value: "36h", label: "avg recruiter response" },
];

const benefits = [
  {
    icon: Search,
    title: "Search that understands intent",
    description: "Filter by role, level, remote fit, compensation, and company signal without losing momentum.",
  },
  {
    icon: ShieldCheck,
    title: "A workspace for every role",
    description: "Candidates, recruiters, and admins each get focused tools that match their daily decisions.",
  },
  {
    icon: LineChart,
    title: "Progress you can see",
    description: "Track applications, saved roles, profile quality, and hiring activity in polished dashboards.",
  },
];

const timeline = [
  "Build a profile with portfolio, skills, and resume context.",
  "Shortlist roles using smart filters and curated company signals.",
  "Apply, save, and track every conversation from one command center.",
];

const faqs = [
  ["Can recruiters use this too?", "Yes. Recruiters get job posting, pipeline, and applicant review screens."],
  ["Does it support dark and light mode?", "Yes. The UI uses CSS variables and a persistent theme switch."],
  ["What happens when the backend is offline?", "The UI still renders curated demo data and clearly labels the fallback state."],
];

const LandingPage = () => {
  const featuredJobs = sampleJobs.slice(0, 4);

  return (
    <main className="bg-bg text-text">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/hero-hiring-studio.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,15,0.88),rgba(8,9,15,0.58)_48%,rgba(8,9,15,0.72)),linear-gradient(180deg,rgba(8,9,15,0.18),rgba(8,9,15,0.95))]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-contrast">
              <BriefcaseBusiness className="size-5" />
            </span>
            <span className="text-lg font-black tracking-tight">JobSearch</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-bold text-white/[0.78] transition hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-white px-4 py-2 text-sm font-black text-[#08090f] transition hover:bg-primary hover:text-primary-contrast"
            >
              Join
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-88px)] max-w-7xl items-center px-4 pb-20 pt-14 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-4xl"
          >
            <Badge tone="green" className="border-white/15 bg-white/10 text-white backdrop-blur-xl">
              <Sparkles className="size-3.5" />
              New premium career workspace
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Find work that compounds your ambition.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.74] sm:text-xl">
              Discover elite roles, manage applications, and move through hiring with the calm precision of a modern product suite.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" rightIcon={ArrowRight}>Create account</Button>
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/[0.18] bg-white/10 px-5 text-base font-bold text-white backdrop-blur-xl transition hover:bg-white/[0.16]"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/[0.12] bg-white/[0.09] p-4 backdrop-blur-xl">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/[0.55]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border-soft bg-bg px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {logos.map((logo) => (
            <div key={logo} className="text-sm font-black uppercase tracking-[0.18em] text-text-faint">
              {logo}
            </div>
          ))}
        </div>
      </section>

      <section className="premium-bg bg-grid px-4 py-20 sm:px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <div className="mb-10 max-w-3xl">
            <Badge tone="blue">Featured roles</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-text-strong sm:text-5xl">
              Premium jobs, presented like products.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredJobs.map((job) => (
              <motion.article key={job._id} variants={revealItem} className="interactive-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-border-soft bg-white p-2">
                    <img src={job.logo} alt="" className="size-full object-contain" />
                  </div>
                  <div>
                    <p className="font-black text-text-strong">{job.company}</p>
                    <p className="text-xs font-semibold text-text-subtle">{job.location}</p>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight text-text-strong">{job.role}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="green">{job.type}</Badge>
                  <Badge tone="violet">{job.level}</Badge>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-faint">Salary</p>
                    <p className="text-lg font-black text-primary">{job.salary}</p>
                  </div>
                  <DetailLink>View</DetailLink>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="amber">Why it feels different</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-text-strong sm:text-5xl">
              A hiring experience with taste and traction.
            </h2>
            <p className="mt-5 text-lg leading-8 text-text-muted">
              Every screen is built around repeated workflows: scanning, saving, applying, reviewing, measuring, and deciding.
            </p>
          </div>

          <div className="grid gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="surface-card p-5">
                <div className="flex gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
                    <benefit.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-text-strong">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-text-muted">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border-soft bg-bg-subtle/[0.55] px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Badge tone="rose">Application flow</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-text-strong">
              From profile to offer pipeline.
            </h2>
          </div>
          <div className="grid gap-4 lg:col-span-2">
            {timeline.map((item, index) => (
              <div key={item} className="surface-card flex items-start gap-4 p-5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-text-strong text-bg text-sm font-black">
                  {index + 1}
                </span>
                <p className="text-lg font-bold leading-7 text-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge tone="green">Live profile score</Badge>
                <h2 className="mt-4 text-3xl font-black text-text-strong">Candidate readiness</h2>
              </div>
              <Badge tone="blue">
                <Clock3 className="size-3.5" />
                Updated today
              </Badge>
            </div>
            <div className="mt-8 grid gap-5">
              <ProgressBar value={92} label="Resume strength" />
              <ProgressBar value={84} tone="blue" label="Portfolio coverage" />
              <ProgressBar value={76} tone="violet" label="Interview readiness" />
            </div>
          </div>

          <div className="grid gap-4">
            {[
              { icon: Users, title: "Recruiter-ready", copy: "Clear signals for screening and follow-up." },
              { icon: BadgeCheck, title: "Verified flow", copy: "Saved, applied, and shortlisted states stay visible." },
              { icon: Star, title: "Memorable polish", copy: "Interactions feel considered on every screen." },
            ].map((item) => (
              <div key={item.title} className="surface-card flex gap-4 p-5">
                <span className="flex size-11 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-accent">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-black text-text-strong">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-text-muted">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-text-strong px-4 py-20 text-bg sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge tone="green" className="border-white/15 bg-white/10 text-white">FAQ</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">Questions hiring teams ask first.</h2>
          </div>
          <div className="grid gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
                <h3 className="font-black text-white">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-white/[0.68]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-lg border border-border-soft bg-surface-solid p-8 text-center shadow-[var(--shadow-lg)]">
          <Building2 className="mx-auto size-10 text-primary" />
          <h2 className="mt-5 text-4xl font-black tracking-tight text-text-strong">
            Step into a job portal that finally looks as serious as your ambition.
          </h2>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" rightIcon={ArrowRight}>Start free</Button>
            </Link>
            <Link to="/login" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-border-strong px-5 font-bold text-text hover:bg-surface-hover">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
