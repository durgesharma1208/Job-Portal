import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  FolderKanban,
  LayoutDashboard,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { TextInput } from "./ui/Kit";

const baseCommands = [
  { label: "Dashboard", path: "/home", icon: LayoutDashboard, roles: ["student"] },
  { label: "Browse Jobs", path: "/jobs", icon: BriefcaseBusiness, roles: ["student", "admin"] },
  { label: "Search", path: "/search", icon: Search, roles: ["student"] },
  { label: "Saved Jobs", path: "/saved-jobs", icon: FolderKanban, roles: ["student"] },
  { label: "Applied Jobs", path: "/applied-jobs", icon: BriefcaseBusiness, roles: ["student"] },
  { label: "Profile", path: "/profile", icon: User, roles: ["student", "recruiter", "admin"] },
  { label: "Notifications", path: "/notifications", icon: Bell, roles: ["student", "recruiter", "admin"] },
  { label: "Settings", path: "/settings", icon: Settings, roles: ["student", "recruiter", "admin"] },
  { label: "Recruiter Dashboard", path: "/RecruiterHome", icon: LayoutDashboard, roles: ["recruiter"] },
  { label: "Recruiter Jobs", path: "/recruiter-jobs", icon: BriefcaseBusiness, roles: ["recruiter"] },
  { label: "Applicants", path: "/applications", icon: Users, roles: ["recruiter"] },
  { label: "Admin Dashboard", path: "/AdminHome", icon: LayoutDashboard, roles: ["admin"] },
  { label: "User Management", path: "/manage-users", icon: Users, roles: ["admin"] },
  { label: "Admin Jobs", path: "/admin-jobs", icon: BriefcaseBusiness, roles: ["admin"] },
  { label: "Analytics", path: "/analytics", icon: BarChart3, roles: ["admin"] },
];

const CommandPalette = ({ open, onOpenChange, role = "student" }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      setQuery("");
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const commands = useMemo(() => {
    const available = baseCommands.filter((command) => command.roles.includes(role));
    const normalized = query.trim().toLowerCase();

    if (!normalized) return available;

    return available.filter((command) => command.label.toLowerCase().includes(normalized));
  }, [query, role]);

  const runCommand = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/[0.45] px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="surface-card w-full max-w-xl overflow-hidden p-2"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border-soft p-2">
              <TextInput
                autoFocus
                leftIcon={Search}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages and actions"
                className="border-0 bg-transparent"
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text"
                aria-label="Close command palette"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {commands.length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-text-muted">No matching actions.</div>
              ) : (
                commands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.path}
                      type="button"
                      onClick={() => runCommand(command.path)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-text hover:bg-surface-hover"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-surface-hover text-primary">
                        <Icon className="size-4" />
                      </span>
                      {command.label}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
