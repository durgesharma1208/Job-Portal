import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import api from "@/api/axios";
import { cn } from "../lib/cn";
import CommandPalette from "./CommandPalette";
import { Avatar, Badge } from "./ui/Kit";

const navigationByRole = {
  student: [
    { label: "Dashboard", path: "/home", icon: LayoutDashboard },
    { label: "Jobs", path: "/jobs", icon: BriefcaseBusiness },
    { label: "Saved", path: "/saved-jobs", icon: Bookmark },
    { label: "Tracker", path: "/application-tracker", icon: FolderKanban },
  ],
  recruiter: [
    { label: "Dashboard", path: "/RecruiterHome", icon: LayoutDashboard },
    { label: "Jobs", path: "/recruiter-jobs", icon: BriefcaseBusiness },
    { label: "Post", path: "/post-job", icon: FilePlus2 },
    { label: "Applicants", path: "/applications", icon: Users },
  ],
  admin: [
    { label: "Dashboard", path: "/AdminHome", icon: LayoutDashboard },
    { label: "Users", path: "/manage-users", icon: Users },
    { label: "Jobs", path: "/admin-jobs", icon: BriefcaseBusiness },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ],
};

const IconButton = ({ children, className, ...props }) => (
  <button
    type="button"
    className={cn(
      "inline-flex size-10 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-text",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const profileRef = useRef(null);

  const localUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const activeUser = user || localUser || { name: "User", role: "student" };
  const role = activeUser.role || "student";
  const links = navigationByRole[role] || navigationByRole.student;

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileOpen(false);
    setProfileOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [location.pathname]);

  // Click-outside to close profile dropdown
  useEffect(() => {
    if (!profileOpen) return undefined;
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    const openCommand = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
    };

    window.addEventListener("keydown", openCommand);
    return () => window.removeEventListener("keydown", openCommand);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {});
    } catch {
      /* Local sign-out still clears the client session. */
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Signed out");
      navigate("/login");
    }
  };

  const navClass = ({ isActive }) =>
    cn(
      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition",
      isActive
        ? "bg-primary text-primary-contrast shadow-[0_12px_30px_-22px_var(--primary)]"
        : "text-text-muted hover:bg-surface-hover hover:text-text"
    );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-soft bg-bg/[0.78] backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to={role === "admin" ? "/AdminHome" : role === "recruiter" ? "/RecruiterHome" : "/home"} className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-contrast shadow-[0_18px_34px_-24px_var(--primary)]">
                <BriefcaseBusiness className="size-5" />
              </span>
              <span className="hidden text-lg font-black tracking-tight text-text-strong sm:block">
                JobSearch
              </span>
            </Link>

            <Badge tone={role === "admin" ? "rose" : role === "recruiter" ? "blue" : "green"} className="hidden capitalize md:inline-flex">
              {role}
            </Badge>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {links.map((item) => (
              <NavLink key={item.path} to={item.path} className={navClass}>
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconButton onClick={() => setCommandOpen(true)} aria-label="Open command palette" title="Search">
              <Search className="size-5" />
            </IconButton>

            <Link
              to="/notifications"
              className="relative inline-flex size-10 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-text"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-rose" />
            </Link>

            <IconButton onClick={toggleTheme} aria-label="Toggle theme" title="Theme">
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </IconButton>

            <div className="relative hidden md:block" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2 rounded-lg border border-border-soft bg-surface px-2 py-1.5 transition hover:bg-surface-hover"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <Avatar name={activeUser.name} src={activeUser.profileImage} className="size-8" />
                <span className="max-w-28 truncate text-sm font-bold text-text">{activeUser.name || "User"}</span>
                <ChevronDown className="size-4 text-text-muted" />
              </button>

              {profileOpen && (
                <div
                  className="surface-card absolute right-0 mt-2 w-56 p-2"
                  role="menu"
                >
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-text hover:bg-surface-hover"
                  >
                    <User className="size-4 text-primary" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-text hover:bg-surface-hover"
                  >
                    <Settings className="size-4 text-primary" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose hover:bg-rose/10"
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>

            <IconButton className="lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle menu">
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </IconButton>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border-soft bg-bg/95 px-4 py-3 backdrop-blur-2xl lg:hidden">
            <div className="grid gap-2">
              {links.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={navClass}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </NavLink>
              ))}
              <div className="my-2 h-px bg-border-soft" />
              <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={navClass}>
                <User className="size-4" />
                Profile
              </NavLink>
              <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={navClass}>
                <Settings className="size-4" />
                Settings
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-rose hover:bg-rose/10"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} role={role} />
    </>
  );
};

export default Navbar;
