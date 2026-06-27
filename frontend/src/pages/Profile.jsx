import { useState } from "react";
import { Lock, Mail, Save, ShieldCheck, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";
import Button from "../components/ui/Button";
import {
  Avatar,
  Badge,
  Field,
  PageShell,
  SectionHeader,
  TextInput,
} from "../components/ui/Kit";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || localUser?.name || "User";
  const userEmail = user?.email || localUser?.email || "";
  const userRole = user?.role || localUser?.role || "student";

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
    role: userRole,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = async () => {
    try {
      await api.post("/user/logout", {});
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Signed out");
      navigate("/login");
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const updated = { ...localUser, name: profile.name, email: profile.email, role: profile.role };
    localStorage.setItem("user", JSON.stringify(updated));
    toast.success("Profile updated");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    toast.success("Password changed securely");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Profile"
        title="Your account"
        highlight="settings"
        description="Update your profile basics, security credentials, and account preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <section className="surface-card flex flex-col items-center p-6 text-center sm:p-8">
          <Avatar name={profile.name} className="size-24 text-2xl" />
          <h2 className="mt-4 text-2xl font-black text-text-strong">{profile.name}</h2>
          <Badge tone={profile.role === "admin" ? "rose" : profile.role === "recruiter" ? "blue" : "green"} className="mt-2 capitalize">
            {profile.role}
          </Badge>
          <p className="mt-3 flex items-center gap-2 text-sm text-text-muted">
            <Mail className="size-4 text-primary" />
            {profile.email}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-text-subtle">
            <ShieldCheck className="size-4 text-primary" />
            Account secured
          </div>
          <div className="mt-6 w-full">
            <Button variant="danger" fullWidth onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </section>

        <div className="grid gap-6">
          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <User className="size-5 text-primary" />
              <h2 className="text-xl font-black text-text-strong">Account details</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <TextInput
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email">
                <TextInput
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@company.com"
                />
              </Field>
              <Button type="submit" leftIcon={Save} className="sm:col-span-2">
                Save changes
              </Button>
            </form>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-primary" />
              <h2 className="text-xl font-black text-text-strong">Security</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="mt-5 grid gap-4">
              <Field label="Current password">
                <TextInput
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Current password"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password">
                  <TextInput
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="New password"
                  />
                </Field>
                <Field label="Confirm password">
                  <TextInput
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                  />
                </Field>
              </div>
              <Button type="submit" leftIcon={Lock}>
                Update password
              </Button>
            </form>
          </section>
        </div>
      </div>
    </PageShell>
  );
};

export default Profile;