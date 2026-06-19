const RecruiterHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const recruiterName = user?.name || "Recruiter";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black pt-10 px-6">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            Welcome Back,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {recruiterName}
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Find the best talent and grow your team
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-blue-400">12</h3>
              <p className="text-gray-300 mt-2">Active Jobs</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-purple-400">156</h3>
              <p className="text-gray-300 mt-2">Applications Received</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold text-green-400">28</h3>
              <p className="text-gray-300 mt-2">Candidates Shortlisted</p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

            <a
              href="/recruiter/post-job"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">
                Post a New Job
              </h2>
              <p className="text-blue-100">
                Create a new opportunity and start receiving applications.
              </p>
            </a>

            <a
              href="/recruiter/applicants"
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-8 hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">
                View Applicants
              </h2>
              <p className="text-purple-100">
                Review applications and shortlist top candidates.
              </p>
            </a>

          </div>

          {/* CTA */}
          <div className="mt-16">
            <a
              href="/jobs"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:scale-110 transition-all duration-300"
            >
              Manage Job Listings
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default RecruiterHome;