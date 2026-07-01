import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "./ui/Kit";

const ProtectedRoute = ({ user, loading }) => {
  const location = useLocation();

  if (loading) {
    return <PageLoader label="Checking your workspace..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const profilePaths = ["/choose-role", "/student/profile/setup", "/recruiter/profile/setup"];
  const isProfilePath = profilePaths.some((p) => location.pathname.startsWith(p));

  if (user.role === null && !isProfilePath) {
    return <Navigate to="/choose-role" replace />;
  }

  if (user.role && !user.profileCompleted && !isProfilePath) {
    const setupPath = user.role === "student" ? "/student/profile/setup" : "/recruiter/profile/setup";
    return <Navigate to={setupPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
