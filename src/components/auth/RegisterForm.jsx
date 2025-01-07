import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COVER_IMAGE =
  "https://thumbs.dreamstime.com/z/word-training-courses-written-notebook-business-office-desktop-253334437.jpg";
const BACKGROUND_IMAGE =
  "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (Object.values(formData).some(value => !value)) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("emailForOtp", formData.email);
        toast.success("Registration successful! Please verify your email.");
        window.location.href = "/verify-otp";
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("User already exists or invalid input.");
        toast.error("User already exists or invalid input.");
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="max-w-5xl w-full h-[90vh] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left side - Cover Image with hover effect */}
        <div className="w-1/2 hidden lg:block relative group">
          {/* Base image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${COVER_IMAGE})` }}
          ></div>
          
          {/* Light overlay always visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
          
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-8 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to Our Learning Platform</h2>
                <p className="text-white text-lg opacity-90 mb-6">
                  Join thousands of students and start your learning journey today
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 transform -translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">Access to 1000+ courses</p>
                  </div>
                  <div className="flex items-center space-x-3 transform translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">Learn at your own pace</p>
                  </div>
                  <div className="flex items-center space-x-3 transform -translate-x-8 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">Join our community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto px-8 py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-sm text-gray-600">
              Start your learning journey with us today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="John"
                />
              </div>

              <div className="relative">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="Choose a unique username"
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg shadow-md text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                transition-all duration-200 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
              </button>

              <button
                type="button"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <FaFacebookF className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Sign up with Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.href = "/login"}
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;