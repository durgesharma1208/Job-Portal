import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, loading } = useAuth();


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black pt-10 px-6">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            Welcome Back,
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {loading ? (
      <span className="text-gray-500 text-3xl animate-pulse">Fetching name...</span>
    ) : user ? (
      user.name
    ) : (
      "Guest"
    )}
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8">
            Discover your next opportunity in tech
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-3xl font-bold text-green-400">500+</h3>
              <p>Active Jobs</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-3xl font-bold text-green-400">1000+</h3>
              <p>Companies</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <h3 className="text-3xl font-bold text-green-400">5000+</h3>
              <p>Placements</p>
            </div>
          </div>

          <div className="mt-16">
            <a
              href="/jobs"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              Explore Jobs Now
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;