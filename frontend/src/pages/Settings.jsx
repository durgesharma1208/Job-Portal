import { useState } from "react";
import {
  Bell,
  Eye,
  Lock,
  Moon,
  Save,
  ShieldCheck,
  Sun,
  UserCog,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  Badge,
  Field,
  PageShell,
  SectionHeader,
  SelectInput,
  TextInput,
} from "../components/ui/Kit";
import { useTheme } from "../context/ThemeContext";

const preferenceRows = [
  { key: "jobAlerts", label: "Job match alerts", description: "Notify me when high-fit roles appear.", icon: Bell },
  { key: "profileVisibility", label: "Recruiter visibility", description: "Allow recruiters to discover my profile.", icon: Eye },
  { key: "securityDigest", label: "Security digest", description: "Send account and sign-in summaries.", icon: ShieldCheck },
];

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    jobAlerts: true,
    profileVisibility: true,
    securityDigest: false,
  });
  const [profile, setProfile] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        name: user.name || "",
        email: user.email || "",
        role: user.role || "student",
      };
    } catch {
      return { name: "", email: "", role: "student" };
    }
  });

  const saveSettings = () => {
    const existing = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...existing, ...profile }));
    toast.success("Settings saved");
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Settings"
        title="Tune your"
        highlight="workspace"
        description="Control your profile basics, theme, and notification preferences."
        actions={<Badge tone={theme === "dark" ? "violet" : "amber"}>{theme} mode</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-primary">
              {theme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
            </span>
            <div>
              <h2 className="text-xl font-black text-text-strong">Appearance</h2>
              <p className="text-sm text-text-muted">Switch between polished light and dark modes.</p>
            </div>
          </div>
          <Button className="mt-5" variant="secondary" fullWidth onClick={toggleTheme}>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <UserCog className="size-5 text-primary" />
            <h2 className="text-xl font-black text-text-strong">Profile basics</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Display name">
              <TextInput
                value={profile.name}
                onChange={(event) => setProfile((value) => ({ ...value, name: event.target.value }))}
                placeholder="Your name"
              />
            </Field>
            <Field label="Email">
              <TextInput
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((value) => ({ ...value, email: event.target.value }))}
                placeholder="you@company.com"
              />
            </Field>
            <Field label="Role">
              <SelectInput
                value={profile.role}
                onChange={(event) => setProfile((value) => ({ ...value, role: event.target.value }))}
              >
                <option value="student">Candidate</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </SelectInput>
            </Field>
            <Field label="Security level">
              <div className="flex h-11 items-center gap-2 rounded-lg border border-border-soft bg-surface px-3 text-sm font-bold text-text">
                <Lock className="size-4 text-primary" />
                Standard protection
              </div>
            </Field>
          </div>
          <Button className="mt-5" leftIcon={Save} onClick={saveSettings}>
            Save profile
          </Button>
        </section>
      </div>

      <section className="surface-card mt-6 p-5 sm:p-6">
        <h2 className="text-xl font-black text-text-strong">Preferences</h2>
        <div className="mt-4 grid gap-3">
          {preferenceRows.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={() => setPreferences((value) => ({ ...value, [row.key]: !value[row.key] }))}
              className="flex items-center justify-between gap-4 rounded-lg border border-border-soft p-4 text-left transition hover:bg-surface-hover"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-surface-hover text-primary">
                  <row.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-black text-text-strong">{row.label}</span>
                  <span className="text-sm text-text-muted">{row.description}</span>
                </span>
              </span>
              <span
                className={`inline-flex h-6 w-11 items-center rounded-full p-1 transition ${
                  preferences[row.key] ? "bg-primary" : "bg-bg-subtle"
                }`}
                aria-hidden="true"
              >
                <span
                  className={`size-4 rounded-full bg-white transition ${
                    preferences[row.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Settings;
