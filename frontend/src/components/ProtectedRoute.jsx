import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, loading, children }) => {
  toast.success("good job")
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return children;
};

export default ProtectedRoute;