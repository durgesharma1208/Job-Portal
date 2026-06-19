import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import { Toaster } from 'react-hot-toast';
import { Routes, Route, useLocation } from "react-router-dom";
import Profile from "./pages/Profile";
import RecruiterHome from "./pages/RecruiterHome";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";

import AdminHome from "./pages/AdminHome";
import ManageUsers from "./pages/ManageUsers";
import AdminJobs from "./pages/AdminJobs";
import Analytics from "./pages/Analytics";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  const location = useLocation();

  const hideLayout = location.pathname === "/login" || location.pathname === "/"

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
<Toaster position="top-right" reverseOrder={false} />
      <main className="flex-grow">
        <Routes element={<ProtectedRoute />}>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
  {/* Student */}
  <Route path="/home" element={<Home />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/saved-jobs" element={<SavedJobs />} />
  <Route path="/profile" element={<Profile />} />

  {/* Recruiter */}
  <Route path="/RecruiterHome" element={<RecruiterHome />} />
  <Route path="/post-job" element={<PostJob />} />
  <Route path="/applications" element={<Applications />} />

  {/* Admin */}
  <Route path="/AdminHome" element={<AdminHome />} />
  <Route path="/manage-users" element={<ManageUsers />} />
  <Route path="/admin-jobs" element={<AdminJobs />} />
  <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;