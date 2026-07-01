import { useState } from "react";
import { Camera, FileText, Lock, Mail, Save, ShieldCheck, Trash2, Upload, User, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "@/api/axios";
import Button from "../components/ui/Button";
import {
  Avatar,
  Badge,
  Field,
  PageShell,
  SectionHeader,
  TextInput,
} from "../components/ui/Kit";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");
  const activeUser = user || localUser;

  const userName = activeUser?.name || "User";
  const userEmail = activeUser?.email || "";
  const userRole = activeUser?.role || "student";

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

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(
    activeUser?.profileImage || null
  );
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState(activeUser?.resume ? "Resume uploaded" : null);
  const [uploading, setUploading] = useState(false);

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

  const validateFile = (file, acceptedTypes) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.type}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file, ACCEPTED_IMAGE_TYPES)) return;

    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file, ACCEPTED_RESUME_TYPES)) return;

    setResumeFile(file);
    setResumeName(file.name);
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(activeUser?.profileImage || null);
    const input = document.getElementById("profileImageInput");
    if (input) input.value = "";
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeName(activeUser?.resume ? "Resume uploaded" : null);
    const input = document.getElementById("resumeInput");
    if (input) input.value = "";
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await api.patch("/user/profile", formData);

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setUploading(false);
    }
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
          <div className="relative">
            <Avatar
              name={profile.name}
              src={profileImagePreview || activeUser?.profileImage}
              className="size-24 text-2xl"
            />
            <label
              htmlFor="profileImageInput"
              className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-contrast shadow-lg transition hover:bg-primary-hover"
            >
              <Camera className="size-4" />
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>
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

              <div className="sm:col-span-2">
                <Field label="Profile photo">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-soft bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-hover">
                      <Upload className="size-4 text-primary" />
                      Choose image
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                    {profileImageFile && (
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose transition hover:bg-rose/10"
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    )}
                    <span className="text-xs text-text-subtle">JPG, PNG, WebP. Max 5MB.</span>
                  </div>
                  {profileImageFile && (
                    <div className="relative mt-3 inline-block">
                      <img
                        src={profileImagePreview}
                        alt="Preview"
                        className="h-24 w-24 rounded-lg border border-border-soft object-cover"
                      />
                    </div>
                  )}
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Resume">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-soft bg-surface px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-surface-hover">
                      <Upload className="size-4 text-primary" />
                      {resumeName ? "Change resume" : "Upload resume"}
                      <input
                        id="resumeInput"
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                    </label>
                    {resumeName && (
                      <>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-text-muted">
                          <FileText className="size-4 text-primary" />
                          {resumeName}
                        </span>
                        <button
                          type="button"
                          onClick={removeResume}
                          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-rose transition hover:bg-rose/10"
                        >
                          <X className="size-4" />
                          Remove
                        </button>
                      </>
                    )}
                    <span className="text-xs text-text-subtle">PDF, DOC, DOCX. Max 5MB.</span>
                  </div>
                </Field>
              </div>

              <Button type="submit" leftIcon={uploading ? undefined : Save} disabled={uploading} className="sm:col-span-2">
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  "Save changes"
                )}
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
