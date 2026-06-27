import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "./ui/Kit";

const ProtectedRoute = ({ user, loading }) => {
  if (loading) {
    return <PageLoader label="Checking your workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
