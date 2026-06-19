
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem(
      "user",
      JSON.stringify(formData)
    );
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
        { withCredentials: true }
      );
        console.log(response.data);


      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center px-4">

      {/* Background Blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-gray-300 mt-2">
              Join the Job Portal today
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create password"
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-300 mb-2">
                Select Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
              >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-300"
            >
              Create Account
            </button>

          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?

              <button
                onClick={() => navigate("/login")}
                className="text-green-400 ml-1 hover:text-green-300"
              >
                Login
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;

