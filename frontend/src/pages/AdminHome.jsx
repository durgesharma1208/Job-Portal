const AdminHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const adminName = user?.name || "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black pt-10 px-6">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            Welcome,
            <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              {" "} {adminName}
            </span>
          </h1>

          <p className="text-xl text-gray-400">
            Manage users, recruiters, jobs and platform activities
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-4xl font-bold text-blue-400">1,250</h3>
            <p className="text-gray-300 mt-2">Students</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-4xl font-bold text-purple-400">85</h3>
            <p className="text-gray-300 mt-2">Recruiters</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-4xl font-bold text-green-400">320</h3>
            <p className="text-gray-300 mt-2">Active Jobs</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-4xl font-bold text-yellow-400">4,580</h3>
            <p className="text-gray-300 mt-2">Applications</p>
          </div>

        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <a
            href="/admin/users"
            className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              Manage Students
            </h2>
            <p className="text-blue-100">
              View, edit, suspend or remove student accounts.
            </p>
          </a>

          <a
            href="/admin/recruiters"
            className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              Manage Recruiters
            </h2>
            <p className="text-purple-100">
              Approve recruiters and monitor company activities.
            </p>
          </a>

          <a
            href="/admin/jobs"
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              Manage Jobs
            </h2>
            <p className="text-green-100">
              Review, edit and remove job listings.
            </p>
          </a>

          <a
            href="/admin/applications"
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              Applications
            </h2>
            <p className="text-orange-100">
              Monitor all job applications across the platform.
            </p>
          </a>

          <a
            href="/admin/reports"
            className="bg-gradient-to-r from-rose-500 to-red-700 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              Reports
            </h2>
            <p className="text-red-100">
              Handle complaints and policy violations.
            </p>
          </a>

          <a
            href="/admin/settings"
            className="bg-gradient-to-r from-gray-700 to-slate-800 rounded-2xl p-8 text-white hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mb-2">
              System Settings
            </h2>
            <p className="text-gray-300">
              Configure platform-wide settings and controls.
            </p>
          </a>

        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/admin/analytics"
            className="inline-block bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-4 px-8 rounded-xl hover:scale-110 transition-all duration-300"
          >
            View Platform Analytics
          </a>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;