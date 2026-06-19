import { Navigate } from "react-router-dom";

const RecruiterRoute = ({
  user,
  loading,
  children,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...ttp://localhost:5173/
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RecruiterRoute;