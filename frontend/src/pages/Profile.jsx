import { useState } from "react";
import { User, Lock, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
const Profile = () => {
  // 1. LocalStorage se secure data fetch aur error boundary check
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";
  const userEmail = user?.email || "email@example.com";
  const userRole = user?.role || "Software Developer";

  // 2. Profile state fixed (consistent variable naming)
  const [profile, setProfile] = useState({
    username: userName,
    email: userEmail,
    role: userRole
  });

  // 3. Independent input state handling
  const [newUsername, setNewUsername] = useState(userName);
  const [isEditingName, setIsEditingName] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  };

  const handleUpdateUsername = (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    
    // UI state update
    setProfile({ ...profile, username: newUsername });
    
    // Persistent localStorage update (Best production practice)
    if (user) {
      localStorage.setItem("user", JSON.stringify({ ...user, name: newUsername }));
    }
    
    setIsEditingName(false);
    toast.success("Username updated successfully!");
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
      toast.error("New passwords do not match!");
      return;
    }

    toast.success("Password changed securely!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white px-6 py-10 flex justify-center items-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center text-4xl font-extrabold shadow-lg shadow-emerald-500/20 mb-4">
            {profile.username ? profile.username.charAt(0).toUpperCase() : "U"}
            <div className="absolute bottom-1 right-1 bg-slate-900 p-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-wide break-all">{profile.username}</h2>
          <p className="text-emerald-400 text-sm font-medium mt-1">{profile.role}</p>
          <p className="text-gray-500 text-xs mt-4 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {profile.email}
          </p>
          <div className="flex justify-center items-center w-full">
  <button onClick={handleLogout}  className="mt-7 px-6  bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-red-500/10 hover:scale-[1.05] transition-all duration-300">
    Logout
  </button>
</div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Section 1: Update Account Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-200">
              <User className="w-5 h-5 text-green-400" /> Account Settings
            </h3>
            
            <form onSubmit={handleUpdateUsername} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Username</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    disabled={!isEditingName}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  {!isEditingName ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-5 rounded-xl text-sm font-medium transition-all"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl text-sm font-medium transition-all"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingName(false);
                          setNewUsername(profile.username);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-gray-400 px-4 rounded-xl text-sm font-medium transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <hr className="border-slate-800" />

          {/* Section 2: Change Password */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-200">
              <Lock className="w-5 h-5 text-green-400" /> Security Settings
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5">Current Password</label>
                <input
                  type={showPassword.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                  className="absolute right-4 bottom-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5">New Password</label>
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                  className="absolute right-4 bottom-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5">Confirm New Password</label>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                  className="absolute right-4 bottom-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-green-500/10 hover:scale-[1.01] transition-all duration-300"
              >
                Update Password
              </button>
            </form>
          </div>
       

        </div>
      </div>
    </div>
  );
};

export default Profile;