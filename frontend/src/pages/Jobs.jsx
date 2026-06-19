import Jobicon from "../components/Jobicon";
import JobDetailsModal from "../pages/JobDetailsModal"; // 1. Import add karein
import { useState, useEffect } from "react";
import axios from "axios";
const Jobs = () => {
  // 2. State sirf ek baar declare karein
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/job");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-950 via-gray-900 to-black px-6 py-10">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Explore <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Opportunities</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover {jobs.length} amazing job openings from top companies
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Jobicon key={job._id} job={job} onDetailsClick={() => handleOpenModal(job)} />
          ))}
        </div>
      </div>

      {/* Modal renders conditionally */}
      {selectedJob && (
        <JobDetailsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          job={selectedJob} 
        />
      )}
    </div>
  );
};

export default Jobs;