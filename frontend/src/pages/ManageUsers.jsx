import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  Alert,
  Badge,
  EmptyState,
  PageLoader,
  PageShell,
  SectionHeader,
  StatCard,
  TableShell,
} from "../components/ui/Kit";
import api from "../lib/api";

const roleTone = {
  admin: "rose",
  recruiter: "blue",
  student: "green",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/user/allusers");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(userId);
    setError("");

    try {
      const response = await api.delete(`/user/delete/${userId}`);
      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("User deleted");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <PageLoader label="Loading users..." />;
  }

  return (
    <PageShell wide>
      <SectionHeader
        eyebrow="User management"
        title="Platform"
        highlight="users"
        description="View, manage roles, and monitor user activity across the platform."
        actions={
          <Button variant="secondary" leftIcon={RotateCcw} onClick={fetchUsers}>
            Refresh
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="Total users" value={users.length} detail="registered" />
        <StatCard icon={Users} label="Students" value={users.filter((u) => u.role === "student").length} detail="learners" tone="green" />
        <StatCard icon={Users} label="Recruiters" value={users.filter((u) => u.role === "recruiter").length} detail="hiring" tone="blue" />
      </div>

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Users will appear here once they register on the platform."
        />
      ) : (
        <TableShell>
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-border-soft bg-surface-hover text-xs font-black uppercase tracking-[0.16em] text-text-faint">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4 text-center">Saved</th>
                <th className="px-5 py-4 text-center">Applied</th>
                <th className="px-5 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {users.map((u) => (
                <tr key={u._id} className="transition hover:bg-surface-hover">
                  <td className="px-5 py-4 font-bold text-text-strong">{u.name}</td>
                  <td className="px-5 py-4 text-sm text-text-muted">{u.email}</td>
                  <td className="px-5 py-4">
                    <Badge tone={roleTone[u.role] || "neutral"} className="uppercase">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-center font-black text-text">{u.savedJobs?.length || 0}</td>
                  <td className="px-5 py-4 text-center font-black text-text">{u.appliedJobs?.length || 0}</td>
                  <td className="px-5 py-4 text-center">
                    {u.role !== "admin" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Trash2}
                        loading={deletingId === u._id}
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-rose"
                      >
                        Delete
                      </Button>
                    ) : (
                      <span className="text-xs font-bold text-text-faint">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </PageShell>
  );
};

export default ManageUsers;