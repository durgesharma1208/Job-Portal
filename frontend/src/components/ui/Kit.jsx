import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { cn } from "../../lib/cn";

export const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const revealItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const toneClasses = {
  green: "bg-[var(--primary-soft)] text-[var(--primary-soft-text)] border-primary/20",
  blue: "bg-[var(--accent-soft)] text-accent border-accent/20",
  violet: "bg-violet/[0.12] text-violet border-violet/20",
  rose: "bg-rose/[0.12] text-rose border-rose/20",
  amber: "bg-amber/[0.12] text-amber border-amber/20",
  neutral: "bg-surface-hover text-text-muted border-border-soft",
};

const iconToneClasses = {
  green: "bg-[var(--primary-soft)] text-[var(--primary-soft-text)]",
  blue: "bg-[var(--accent-soft)] text-accent",
  violet: "bg-violet/[0.12] text-violet",
  rose: "bg-rose/[0.12] text-rose",
  amber: "bg-amber/[0.12] text-amber",
  neutral: "bg-surface-hover text-text-muted",
};

export const PageShell = ({ children, className, wide = false }) => (
  <motion.section
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.28, ease: "easeOut" }}
    className={cn("premium-bg bg-grid relative min-h-[calc(100vh-72px)] overflow-hidden", className)}
  >
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent" />
    <div className={cn("relative mx-auto w-full px-4 py-8 sm:px-6 lg:py-10", wide ? "max-w-[1500px]" : "max-w-7xl")}>
      {children}
    </div>
  </motion.section>
);

export const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  align = "left",
  className,
}) => (
  <div
    className={cn(
      "mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
      align === "center" && "items-center text-center lg:items-center lg:text-left",
      className
    )}
  >
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-black leading-[1.02] tracking-tight text-text-strong sm:text-4xl lg:text-5xl">
        {title}
        {highlight && <span className="text-gradient"> {highlight}</span>}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </div>
);

export const Badge = ({ children, tone = "neutral", className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold",
      toneClasses[tone] || toneClasses.neutral,
      className
    )}
  >
    {children}
  </span>
);

export const IconFrame = ({ icon: Icon, tone = "green", className }) => (
  <span
    className={cn(
      "inline-flex size-10 items-center justify-center rounded-lg",
      iconToneClasses[tone] || iconToneClasses.green,
      className
    )}
  >
    <Icon className="size-5" aria-hidden="true" />
  </span>
);

export const StatCard = ({ icon: Icon, label, value, detail, tone = "green", className }) => (
  <motion.div
    variants={revealItem}
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className={cn("surface-card p-5", className)}
  >
    <div className="flex items-center justify-between gap-4">
      {Icon && <IconFrame icon={Icon} tone={tone} />}
      {detail && <Badge tone={tone}>{detail}</Badge>}
    </div>
    <div className="mt-5">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-1 text-3xl font-black tracking-tight text-text-strong">{value}</p>
    </div>
  </motion.div>
);

export const Avatar = ({ name = "User", src, className }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-soft bg-surface-hover text-sm font-black text-text-strong",
        className
      )}
    >
      {src ? <img src={src} alt="" className="size-full object-contain p-2" /> : initials || "U"}
    </div>
  );
};

export const Field = ({ label, hint, children, className }) => (
  <label className={cn("block", className)}>
    {label && <span className="mb-2 block text-sm font-semibold text-text">{label}</span>}
    {children}
    {hint && <span className="mt-1.5 block text-xs text-text-subtle">{hint}</span>}
  </label>
);

export const TextInput = ({ className, leftIcon: LeftIcon, ...props }) => (
  <div className="relative">
    {LeftIcon && (
      <LeftIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-faint" />
    )}
    <input
      className={cn("input-premium h-11 px-3.5 text-sm", LeftIcon && "pl-10", className)}
      {...props}
    />
  </div>
);

export const SearchInput = ({ className, ...props }) => (
  <TextInput leftIcon={Search} className={className} {...props} />
);

export const TextareaInput = ({ className, ...props }) => (
  <textarea className={cn("input-premium min-h-28 resize-y px-3.5 py-3 text-sm", className)} {...props} />
);

export const SelectInput = ({ className, children, ...props }) => (
  <select className={cn("input-premium h-11 px-3.5 text-sm", className)} {...props}>
    {children}
  </select>
);

export const EmptyState = ({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn("surface-card flex flex-col items-center px-6 py-14 text-center", className)}>
    <IconFrame icon={Icon} tone="neutral" className="size-12" />
    <h2 className="mt-4 text-xl font-black text-text-strong">{title}</h2>
    {description && <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const SkeletonCard = ({ className }) => (
  <div className={cn("surface-card p-5", className)}>
    <div className="flex items-center gap-3">
      <div className="shimmer size-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="shimmer h-4 w-1/2 rounded" />
        <div className="shimmer h-3 w-1/3 rounded" />
      </div>
    </div>
    <div className="mt-6 space-y-3">
      <div className="shimmer h-6 w-4/5 rounded" />
      <div className="shimmer h-4 w-full rounded" />
      <div className="shimmer h-4 w-2/3 rounded" />
    </div>
    <div className="mt-6 flex gap-2">
      <div className="shimmer h-9 flex-1 rounded-lg" />
      <div className="shimmer h-9 flex-1 rounded-lg" />
    </div>
  </div>
);

export const PageLoader = ({ label = "Loading workspace..." }) => (
  <div className="premium-bg bg-grid flex min-h-screen items-center justify-center px-6">
    <div className="surface-card flex items-center gap-3 px-5 py-4 text-sm font-semibold text-text-muted">
      <Loader2 className="size-5 animate-spin text-primary" />
      {label}
    </div>
  </div>
);

export const Alert = ({ type = "info", children, className }) => {
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;
  const tone = type === "success" ? "green" : type === "error" ? "rose" : "blue";
  return (
    <div className={cn("surface-card flex items-start gap-3 p-4 text-sm text-text-muted", className)}>
      <Icon className={cn("mt-0.5 size-5", tone === "rose" ? "text-rose" : tone === "green" ? "text-primary" : "text-accent")} />
      <div>{children}</div>
    </div>
  );
};

export const ProgressBar = ({ value = 0, tone = "green", label }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    tone === "blue"
      ? "bg-accent"
      : tone === "violet"
        ? "bg-violet"
        : tone === "rose"
          ? "bg-rose"
          : tone === "amber"
            ? "bg-amber"
            : "bg-primary";

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-text">{label}</span>
          <span className="font-bold text-text-muted">{clamped}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-bg-subtle">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
};

export const TableShell = ({ children, className }) => (
  <div className={cn("surface-card overflow-hidden", className)}>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export const DetailLink = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
    {children}
    <ChevronRight className="size-4" aria-hidden="true" />
  </span>
);
