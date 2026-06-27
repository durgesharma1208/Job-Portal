import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "./ui/Kit";

const AdminRoute = ({ user, loading }) => {
  if (loading) {
    return <PageLoader label="Opening admin controls..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
