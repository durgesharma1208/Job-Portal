import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterRoute from "./components/RecruiterRoute";
import AdminRoute from "./components/AdminRoute";
import { PageLoader } from "./components/ui/Kit";
import { useAuth } from "./hooks/useAuth";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ChooseRole = lazy(() => import("./pages/ChooseRole"));
const StudentProfileSetup = lazy(() => import("./pages/StudentProfileSetup"));
const RecruiterProfileSetup = lazy(() => import("./pages/RecruiterProfileSetup"));
const Home = lazy(() => import("./pages/Home"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Search = lazy(() => import("./pages/Search"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs"));
const ApplicationTracker = lazy(() => import("./pages/ApplicationTracker"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Notifications = lazy(() => import("./pages/Notifications"));
const RecruiterHome = lazy(() => import("./pages/RecruiterHome"));
const RecruiterJobs = lazy(() => import("./pages/RecruiterJobs"));
const PostJob = lazy(() => import("./pages/PostJob"));
const Applications = lazy(() => import("./pages/Applications"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));
const AdminJobs = lazy(() => import("./pages/AdminJobs"));
const Analytics = lazy(() => import("./pages/Analytics"));

const authFreeRoutes = ["/", "/login", "/register", "/forgot-password", "/choose-role"];

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const hideLayout = authFreeRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-bg text-text">
      {!hideLayout && <Navbar />}

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "surface-card",
          style: {
            background: "var(--surface-solid)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      />

      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/choose-role" element={<ChooseRole />} />
              <Route path="/student/profile/setup" element={<StudentProfileSetup />} />
              <Route path="/recruiter/profile/setup" element={<RecruiterProfileSetup />} />

              <Route element={<ProtectedRoute user={user} loading={loading} />}>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Navigate to="/home" replace />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/search" element={<Search />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/application-tracker" element={<ApplicationTracker />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />

                <Route element={<RecruiterRoute user={user} loading={loading} />}>
                  <Route path="/RecruiterHome" element={<RecruiterHome />} />
                  <Route path="/recruiter-dashboard" element={<Navigate to="/RecruiterHome" replace />} />
                  <Route path="/recruiter-jobs" element={<RecruiterJobs />} />
                  <Route path="/post-job" element={<PostJob />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applicants" element={<Navigate to="/applications" replace />} />
                </Route>

                <Route element={<AdminRoute user={user} loading={loading} />}>
                  <Route path="/AdminHome" element={<AdminHome />} />
                  <Route path="/admin-dashboard" element={<Navigate to="/AdminHome" replace />} />
                  <Route path="/manage-users" element={<ManageUsers />} />
                  <Route path="/user-management" element={<Navigate to="/manage-users" replace />} />
                  <Route path="/admin-jobs" element={<AdminJobs />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
