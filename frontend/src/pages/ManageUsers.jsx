import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null); // Tracking delete state

  // 1. Fetch All Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/user/allusers", {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchUsers();
    };
    init();
  }, [fetchUsers]);

  // 2. Delete User Handler Function
  const handleDeleteUser = async (userId) => {
    // Edge case window confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    setError("");

    try {
      const response = await axios.delete(`http://localhost:5000/api/user/delete/${userId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // UI Optimization: Refresh backend local state immediately without hitting API again
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper Function for Role Badges
  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-red-500/10 text-red-400 border-red-500/20",
      recruiter: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      student: "bg-green-500/10 text-green-400 border-green-500/20",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[role] || "bg-gray-500/10 text-gray-400"}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white py-12 px-4 md:px-10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Manage <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Users</span>
            </h1>
            <p className="text-gray-400 mt-1">View, manage roles, and monitor user profiles inside the application.</p>
          </div>
          <button 
            onClick={fetchUsers} 
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium py-2 px-4 rounded-xl transition"
          >
            Refresh Data
          </button>
        </div>

        {/* Error handling alert */}
        {error && (
          <div className="p-4 rounded-xl mb-6 bg-red-500/10 text-red-400 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-slate-900 rounded-xl w-full"></div>
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="h-16 bg-slate-900/50 rounded-xl w-full"></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg">No users found in the ecosystem.</p>
          </div>
        ) : (
          /* Main Table Container */
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-gray-400 text-sm font-semibold border-b border-white/5">
                    <th className="p-4 md:p-5">Name</th>
                    <th className="p-4 md:p-5">Email Address</th>
                    <th className="p-4 md:p-5">System Role</th>
                    <th className="p-4 md:p-5 text-center">Saved Jobs</th>
                    <th className="p-4 md:p-5 text-center">Applied</th>
                    <th className="p-4 md:p-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition duration-150">
                      <td className="p-4 md:p-5 font-medium text-gray-200">{u.name}</td>
                      <td className="p-4 md:p-5 text-gray-400">{u.email}</td>
                      <td className="p-4 md:p-5">{getRoleBadge(u.role)}</td>
                      <td className="p-4 md:p-5 text-center text-gray-300 font-mono">
                        {u.savedJobs?.length || 0}
                      </td>
                      <td className="p-4 md:p-5 text-center text-gray-300 font-mono">
                        {u.appliedJobs?.length || 0}
                      </td>
                      <td className="p-4 md:p-5 text-center">
                        {/* 🎯 Trap Solved: Admin users have no delete button */}
                        {u.role !== "admin" ? (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={deletingId === u._id}
                            className="text-red-400 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition disabled:opacity-50 cursor-pointer font-bold text-sm"
                            title="Delete User"
                          >
                            {deletingId === u._id ? "..." : "✕"}
                          </button>
                        ) : (
                          <span className="text-gray-600 text-xs font-mono">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;