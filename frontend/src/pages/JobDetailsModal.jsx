import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  BarChart3,
} from "lucide-react";

const Modal = ({ isOpen, onClose, job }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-[70%] h-[90%] overflow-y-auto relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <X size={24} className="text-gray-600 hover:text-gray-900" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-10">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
            <img
              src={job.logo}
              alt={job.company}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {job.role}
            </h2>
            <p className="text-lg text-green-600 font-semibold">
              {job.company}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <MapPin size={20} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <Clock size={20} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Posted</p>
              <p className="font-semibold text-gray-800">{job.posted}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <Briefcase size={20} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-semibold text-gray-800">{job.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
            <BarChart3 size={20} className="text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Level</p>
              <p className="font-semibold text-gray-800">{job.level}</p>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-6">
          <DollarSign size={24} className="text-green-600" />
          <div>
            <p className="text-xs text-gray-500">Salary</p>
            <p className="text-xl font-bold text-green-600">{job.salary}</p>
          </div>
        </div>

        {/* Apply Button */}
        <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
          Apply Now
        </button>
      </div>
    </div>
  );
};
export default Modal;
