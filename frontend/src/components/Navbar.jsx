import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
   const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
const role = user.role || "student";

   function profileHandler() {
    navigate("/profile");
   }
  return (
    <nav className="sticky top-0 z-50 ">
      <div className=" px-6 md:px-8 py-4 bg-cyan-800 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl flex items-center justify-between w-full">

        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          JobSearch
        </h1>

       {role=="student" && (
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold">
            <Link
              to="/home"
              className="text-white text-xl hover:text-green-400 transition-all duration-300"
            >
              Home
          </Link>

          <Link
            to="/jobs"
            className="text-white text-xl hover:text-green-400 transition-all duration-300"
          >
            Jobs
          </Link>

          <Link
            to="/saved-jobs"
            className={"text-white font-semibold text-xl hover:text-green-400 transition-all duration-300"}
          >
            Saved Jobs
          </Link>

          <button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-110 transition-all duration-300 cursor-pointer"
            onClick={profileHandler} 
          >
            <User size={18} />
            {role}
          </button>
        </div>)}
               {role=="recruiter" && (
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold">
            <Link
              to="/RecruiterHome"
              className="text-white text-xl hover:text-green-400 transition-all duration-300"
            >
              Home
          </Link>

          <Link
            to="/post-job"
            className="text-white text-xl hover:text-green-400 transition-all duration-300"
          >
            Post Job
          </Link>

          <Link
            to="/applications"
            className={"text-white font-semibold text-xl hover:text-green-400 transition-all duration-300"}
          >
            Applications
          </Link>

          <button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-110 transition-all duration-300 cursor-pointer"
            onClick={profileHandler} 
          >
            <User size={18} />
            {role}
          </button>
        </div>)}
               {role=="admin" && (
          <div className="flex items-center gap-6 md:gap-8 text-sm font-semibold">
            <Link
              to="/AdminHome"
              className="text-white text-xl hover:text-green-400 transition-all duration-300"
            >
              Home
          </Link>

          <Link
            to="/manage-users"
            className="text-white text-xl hover:text-green-400 transition-all duration-300"
          >
            Manage Users
          </Link>

          <Link
            to="/Jobs"
            className={"text-white font-semibold text-xl hover:text-green-400 transition-all duration-300"}
          >
            Jobs
          </Link>
 <Link
            to="/Analytics"
            className={"text-white font-semibold text-xl hover:text-green-400 transition-all duration-300"}
          >
            Analytics
          </Link>
          <button 
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-110 transition-all duration-300 cursor-pointer"
            onClick={profileHandler} 
          >
            <User size={18} />
            {role}
          </button>
        </div>)}

      </div>
    </nav>
  );
}

export default Navbar;