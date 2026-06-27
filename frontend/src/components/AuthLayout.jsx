import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "./ui/Kit";

const highlights = [
  "Curated roles from ambitious companies",
  "Saved jobs, application tracking, and profile tools",
  "Separate workspaces for talent, recruiters, and admins",
];

const AuthLayout = ({ title, subtitle, eyebrow, children }) => (
  <main className="premium-bg bg-grid relative min-h-screen overflow-hidden px-4 py-6 text-text sm:px-6">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.12] via-accent/[0.06] to-transparent" />

    <div className="relative mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-7xl flex-col">
      <div className="flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-text-strong">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-contrast">
            <BriefcaseBusiness className="size-5" />
          </span>
          JobSearch
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-text-muted hover:bg-surface-hover hover:text-text"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.03fr_0.97fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="hidden lg:block"
        >
          <Badge tone="blue">
            <Sparkles className="size-3.5" />
            Premium hiring OS
          </Badge>
          <h1 className="mt-6 max-w-2xl text-6xl font-black leading-[0.95] tracking-tight text-text-strong xl:text-7xl">
            Build a career profile that feels like leverage.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text-muted">
            A polished workspace for candidates and hiring teams to move from discovery to decisions with less noise.
          </p>

          <div className="mt-8 grid max-w-xl gap-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-text">
                <CheckCircle2 className="size-5 text-primary" />
                {item}
              </div>
            ))}
          </div>

          <div className="surface-card mt-10 max-w-xl overflow-hidden p-2">
            <img
              src="/hero-hiring-studio.png"
              alt=""
              className="h-72 w-full rounded-md object-cover"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="surface-card p-6 sm:p-7">
            <div className="mb-7">
              {eyebrow && (
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-3xl font-black tracking-tight text-text-strong">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-text-muted">{subtitle}</p>
            </div>
            {children}
          </div>
        </motion.section>
      </div>
    </div>
  </main>
);

export default AuthLayout;
