import { MapPin, Clock, Bookmark, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Jobicon = ({ job, onDetailsClick }) => {
  // State for Saving Job
  const [isSaved, setIsSaved] = useState(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    return savedJobs.some((item) => item._id === job._id);
  });

  // State for Applying Job
  const [isApplied, setIsApplied] = useState(() => {
    const appliedJobs = JSON.parse(localStorage.getItem("AppliedJobs")) || [];
    return appliedJobs.some((item) => item._id === job._id);
  });

  // Handle Save / Unsave
  const handleSaveToggle = () => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

    if (isSaved) {
      // Unsave Logic
      const filteredJobs = savedJobs.filter((item) => item._id !== job._id);
      localStorage.setItem("savedJobs", JSON.stringify(filteredJobs));
      setIsSaved(false);
      toast.success("Job Unsaved!");
    } else {
      // Save Logic
      savedJobs.push(job);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      setIsSaved(true);
      toast.success("Job Saved Successfully!");
    }
  };

  // Handle Apply
  const handleApply = () => {
    const appliedJobs = JSON.parse(localStorage.getItem("AppliedJobs")) || [];

    if (isApplied) {
      toast.error("You have already applied for this job!");
    } else {
      // Apply Logic
      appliedJobs.push(job);
      localStorage.setItem("AppliedJobs", JSON.stringify(appliedJobs));
      setIsApplied(true);
      toast.success("Application Submitted successfully!");
    }
  }; // Fixed the extra closing brace that broke your original code

  return (
    <div className="w-full min-h-[380px] bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:scale-[1.02] hover:border-green-200">
      {/* top */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-2 border-gray-200 shadow-md">
          <img
            className="w-8 h-8 object-contain"
            src={job.logo}
            alt={job.company}
          />
        </div>

        <button
          className={`flex items-center gap-1 border-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 font-semibold hover:scale-105 ${
            isSaved
              ? "bg-green-600 border-green-600 text-white"
              : "bg-white border-green-400 text-green-600 hover:bg-green-50"
          }`}
          onClick={handleSaveToggle}
        >
          <Bookmark size={16} />
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {/* content */}
      <div className="flex-grow mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-800">{job.company}</h3>

          <span className="text-gray-400 text-sm flex items-center gap-1">
            <Clock size={14} />
            {job.posted}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 mb-4">
          {job.role}
        </h1>

        <div className="flex gap-2 flex-wrap mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
            {job.type}
          </span>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-semibold">
            {job.level}
          </span>
        </div>
      </div>

      {/* line */}
      <div className="w-full h-px bg-gray-200 my-4"></div>

      {/* bottom */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-1">
            {job.salary}
          </h2>

          <p className="text-gray-500 text-sm flex items-center gap-1">
            <MapPin size={14} />
            {job.location}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onDetailsClick}
            className="flex items-center gap-2 border-2 border-blue-500 text-blue-600 px-4 py-3 rounded-xl font-semibold hover:bg-blue-50"
          >
            <Info size={18} />
            Details
          </button>

          <button
            onClick={handleApply}
           
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
              isApplied
                ? "bg-gray-400 text-white cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 shadow-green-500/20"
            }`}
          >
            {isApplied ? "Applied" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Jobicon;