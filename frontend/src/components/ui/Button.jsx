import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const VARIANTS = {
  primary:
    "bg-primary text-primary-contrast shadow-[0_16px_34px_-22px_var(--primary)] hover:bg-primary-hover",
  secondary:
    "bg-surface-solid text-text border border-border-strong hover:bg-surface-hover",
  outline:
    "bg-transparent text-text border border-border-strong hover:border-primary hover:bg-surface-hover",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-surface-hover",
  subtle: "bg-[var(--primary-soft)] text-[var(--primary-soft-text)] hover:brightness-105",
  danger:
    "bg-rose text-white shadow-[0_16px_34px_-22px_var(--rose)] hover:brightness-110",
  dark: "bg-text-strong text-bg hover:brightness-110",
};

const SIZES = {
  sm: "min-h-9 px-3 text-sm gap-1.5",
  md: "min-h-11 px-4 text-sm gap-2",
  lg: "min-h-12 px-5 text-base gap-2.5",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? undefined : { y: -1, scale: 1.01 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-lg font-semibold",
        "whitespace-nowrap select-none transition-[background-color,border-color,color,filter,box-shadow] duration-200",
        "disabled:pointer-events-none disabled:opacity-55",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" />
      {loading && <Loader2 className="size-[1.05em] animate-spin" aria-hidden="true" />}
      {!loading && LeftIcon && <LeftIcon className="size-[1.05em]" aria-hidden="true" />}
      <span className="relative">{children}</span>
      {!loading && RightIcon && <RightIcon className="size-[1.05em]" aria-hidden="true" />}
    </motion.button>
  );
};

export default Button;
