import Jobicon from "../components/Jobicon";
import { Bookmark } from "lucide-react";
import JobDetailsModal from "../pages/JobDetailsModal"; // 1. Import add karein
import { useState } from "react";
const SavedJobs = () => {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];

  console.log(savedJobs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
  
    const handleOpenModal = (job) => {
      setSelectedJob(job);
      setIsModalOpen(true);
    };
  return (
    <div className="relative min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-950 via-gray-900 to-black px-6 py-10">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Bookmark className="text-green-400" size={32} />
            <h1 className="text-5xl font-bold text-white">
              Saved{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Jobs
              </span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            You have saved {savedJobs.length} job
            {savedJobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Jobs Grid or Empty State */}
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <Jobicon key={job.id} job={job} onDetailsClick={() => handleOpenModal(job)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Bookmark size={64} className="text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              No Saved Jobs Yet
            </h2>
            <p className="text-gray-500 mb-8 text-center">
              Start saving jobs to view them here later
            </p>
            <a
              href="/jobs"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30"
            >
              Browse Jobs
            </a>
          </div>
        )}
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

export default SavedJobs;
