import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();

  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
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

  try {
    console.log("Sending:", formData);

    const response = await axios.post(
      "http://localhost:5000/api/user/login",
      {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      },{ withCredentials: true }
    );

    console.log("Login Success:", response.data);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    localStorage.setItem(
      "token",
      response.data.token
    );

    const role =
      response.data.user.role;

    switch (role) {
      case "admin":
        navigate("/AdminHome");
        break;

      case "recruiter":
        navigate("/RecruiterHome");
        break;

      default:
        navigate("/home");
    }

  } catch (error) {
    console.error("Login Error:", error);

    if (error.response) {
      console.log(
        "Backend Error:",
        error.response.data
      );

      alert(
        error.response.data.message ||
        "Login Failed"
      );
    }
    else if (error.request) {
      alert(
        "Server is not responding."
      );
    }
    else {
      alert(
        "Something went wrong."
      );
    }
  }
};


return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex items-center justify-center px-4">

    {/* Background Effects */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>

    <div className="relative w-full max-w-md">

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="text-gray-300 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block text-gray-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
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
              placeholder="Enter your email"
              required
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
              placeholder="Enter password"
              required
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-300 mb-2">
              Select Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full bg-slate-900 border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            >
              <option value="">Choose Role</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-300"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don't have an account?
            <button
              onClick={() => navigate("/")}  
              className="text-green-400 hover:text-green-300 ml-1"
            >
              Register
            </button>
          </p>
        </div>

      </div>
    </div>
  </div>
);};

export default Login;