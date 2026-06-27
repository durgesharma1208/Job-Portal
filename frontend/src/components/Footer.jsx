import { Link } from "react-router-dom";
import { BriefcaseBusiness, Code2, GitBranch, Mail } from "lucide-react";

const groups = [
  {
    title: "Product",
    links: [
      { label: "Browse Jobs", path: "/jobs" },
      { label: "Search", path: "/search" },
      { label: "Tracker", path: "/application-tracker" },
    ],
  },
  {
    title: "Workspaces",
    links: [
      { label: "Recruiters", path: "/RecruiterHome" },
      { label: "Admin", path: "/AdminHome" },
      { label: "Settings", path: "/settings" },
    ],
  },
];

const Footer = () => (
  <footer className="border-t border-border-soft bg-bg px-4 py-10 sm:px-6">
    <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.5fr_1fr_1fr_0.8fr]">
      <div>
        <Link to="/home" className="inline-flex items-center gap-2 text-lg font-black text-text-strong">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-contrast">
            <BriefcaseBusiness className="size-5" />
          </span>
          JobSearch
        </Link>
        <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
          A premium job portal for candidates, hiring teams, and platform operators.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-sm font-black text-text-strong">{group.title}</h3>
          <div className="mt-4 grid gap-2">
            {group.links.map((link) => (
              <Link key={link.path} to={link.path} className="text-sm font-medium text-text-muted hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3 className="text-sm font-black text-text-strong">Connect</h3>
        <div className="mt-4 flex gap-2">
          {[GitBranch, Code2, Mail].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="inline-flex size-10 items-center justify-center rounded-lg border border-border-soft text-text-muted hover:bg-surface-hover hover:text-primary"
              aria-label="Social link"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-border-soft pt-6 text-xs font-medium text-text-subtle sm:flex-row sm:items-center sm:justify-between">
      <span>2026 JobSearch. All rights reserved.</span>
      <span>Designed for focused hiring workflows.</span>
    </div>
  </footer>
);

export default Footer;
