import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "./ui/Kit";

const RecruiterRoute = ({ user, loading }) => {
  if (loading) {
    return <PageLoader label="Preparing recruiter tools..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default RecruiterRoute;
