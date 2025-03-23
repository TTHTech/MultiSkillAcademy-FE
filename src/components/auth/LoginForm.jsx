import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COVER_IMAGE =
  "https://thumbs.dreamstime.com/z/online-courses-e-learning-vector-background-text-mobile-phone-s-screen-school-elements-internet-devices-home-181482059.jpg";
const BACKGROUND_IMAGE =
  "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      const { token, userId, email: userEmail, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      if (role === "ROLE_STUDENT") {
        navigate("/student/home");
      } else if (role === "ROLE_INSTRUCTOR") {
        navigate("/instructor/user");
      } else if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        setError("Unknown role.");
        toast.error("Unknown role.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid username or password.");
      } else if (error.response && error.response.status === 403) {
        setError("Account not verified. Please verify your OTP.");
        toast.error("Account not verified. Please verify your OTP.");
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    // Sử dụng Client ID Google của bạn
    const googleClientId = '979797905767-l9rt1m82le6jfmmr9v0mbpqnsh8va1es.apps.googleusercontent.com';
    
    // Tạo URL chuyển hướng để người dùng đăng nhập bằng Google
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    
    // Tạo URL đầy đủ
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    // Chuyển hướng đến trang đăng nhập Google
    window.location.href = googleAuthUrl;
  };

  // Hàm xử lý đăng nhập bằng GitHub
  const handleGitHubLogin = () => {
    // Sử dụng Client ID GitHub đã cấu hình
    const githubClientId = 'Ov23liczIPidk9u5hA1o';
    
    // Tạo URL chuyển hướng để người dùng đăng nhập bằng GitHub
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent('user:email');
    
    // Tạo URL đầy đủ cho đăng nhập GitHub
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    // Chuyển hướng đến trang đăng nhập GitHub
    window.location.href = githubAuthUrl;
  };

  // Hàm xử lý đăng nhập bằng Facebook
  const handleFacebookLogin = () => {
    // Giữ nguyên phương thức cũ cho Facebook nếu bạn đang sử dụng
    window.location.href = `http://localhost:8080/oauth2/authorize/facebook`;
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
                <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
                <p className="text-white text-lg opacity-90 mb-6">
                  Continue your learning journey with us
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

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto px-8 py-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>

              <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg shadow-lg text-sm font-medium text-white 
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'} 
                transition-all duration-200 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
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
                onClick={handleGoogleLogin}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
              </button>

              {/* Thêm nút đăng nhập với GitHub */}
              <button
                type="button"
                onClick={handleGitHubLogin}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <FaGithub className="text-gray-800" />
                <span className="text-sm font-medium text-gray-700">Sign in with GitHub</span>
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <FaFacebookF className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Sign in with Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
              >
                Sign up for free
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;