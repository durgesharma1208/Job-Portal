import { useState } from "react";
import axios from "axios";

const PostJob = () => {
  // 1. Initial State as per your exact Schema Model
  const [jobData, setJobData] = useState({
    company: "",
    logo: "",
    posted: "Just Now", // Default baseline value
    role: "",
    type: "Full Time",   // Default dropdown value
    level: "Entry Level", // Default dropdown value
    salary: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Generic Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Form Submit Handler (API Integration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Axios POST request to your endpoint with credentials
      const response = await axios.post(
        "http://localhost:5000/api/job/",
        jobData,
        { withCredentials: true }
      );

      if (response.data.success || response.status === 201) {
        setMessage({ type: "success", text: "Job Posted Successfully! 🎉" });
        // Reset form after successful post
        window.scrollTo({ top: 0, behavior: "smooth" });
        setJobData({
          company: "",
          logo: "",
          posted: "Just Now",
          role: "",
          type: "Full Time",
          level: "Entry Level",
          salary: "",
          location: "",
        });
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to post job. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white py-12 px-4 md:px-10 relative overflow-hidden">
      {/* Background Glow Ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Post New <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Job Opportunity</span>
          </h1>
          <p className="text-gray-400">Create and publish roles to find the finest tech talent.</p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-center font-medium ${
            message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {message.text}
          </div>
        )}

        {/* main Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <input type="text" name="company" value={jobData.company} onChange={handleChange} required placeholder="e.g., Google" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo Image URL</label>
              <input type="url" name="logo" value={jobData.logo} onChange={handleChange} placeholder="e.g., https://logo.clearbit.com/google.com" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
            </div>
          </div>

          {/* Job Role Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Role / Title</label>
            <input type="text" name="role" value={jobData.role} onChange={handleChange} required placeholder="e.g., Software Development Engineer" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
              <select name="type" value={jobData.type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition">
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Job Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
              <select name="level" value={jobData.level} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition">
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>

            {/* Posted Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Posted Timeline</label>
              <input type="text" name="posted" value={jobData.posted} onChange={handleChange} required placeholder="e.g., 2 days ago" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Salary Package</label>
              <input type="text" name="salary" value={jobData.salary} onChange={handleChange} required placeholder="e.g., 18 LPA" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <input type="text" name="location" value={jobData.location} onChange={handleChange} required placeholder="e.g., Bangalore, India" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-400 transition" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full block mx-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Publishing Job..." : "Publish Job Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;