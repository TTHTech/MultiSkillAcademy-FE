import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Kiểm tra và import các dependencies nếu có
let axios, toast, FaGithub, FaEye, FaEyeSlash, FaUser, FaLock;

try {
  axios = require("axios").default;
} catch (e) {
  console.warn("axios not installed");
}

try {
  const reactToastify = require("react-toastify");
  toast = reactToastify.toast;
  require("react-toastify/dist/ReactToastify.css");
} catch (e) {
  console.warn("react-toastify not installed");
  // Fallback toast function
  toast = {
    success: (msg) => alert("✅ " + msg),
    error: (msg) => alert("❌ " + msg)
  };
}

try {
  const icons = require("react-icons/fa");
  FaGithub = icons.FaGithub;
  FaEye = icons.FaEye;
  FaEyeSlash = icons.FaEyeSlash;
  FaUser = icons.FaUser;
  FaLock = icons.FaLock;
} catch (e) {
  console.warn("react-icons not installed");
  // Fallback components
  FaGithub = () => <span>🐙</span>;
  FaEye = () => <span>👁</span>;
  FaEyeSlash = () => <span>🙈</span>;
  FaUser = () => <span>👤</span>;
  FaLock = () => <span>🔒</span>;
}

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || "";

// Ảnh nền chuyên nghiệp
const COVER_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80";
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!axios) {
        throw new Error("Axios chưa được cài đặt. Vui lòng chạy: npm install axios");
      }

      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      const { token, userId, email: userEmail, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      }

      toast.success("Đăng nhập thành công!");

      if (role === "ROLE_STUDENT") {
        navigate("/student/home");
      } else if (role === "ROLE_INSTRUCTOR") {
        navigate("/instructor/user");
      } else if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        setError("Vai trò không xác định.");
        toast.error("Vai trò không xác định.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng.");
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      } else if (error.response && error.response.status === 403) {
        setError("Tài khoản chưa được xác thực. Vui lòng xác thực OTP.");
        toast.error("Tài khoản chưa được xác thực. Vui lòng xác thực OTP.");
      } else {
        setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    const googleClientId = "979797905767-l9rt1m82le6jfmmr9v0mbpqnsh8va1es.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = encodeURIComponent("email profile");
    const responseType = "code";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };

  // GitHub login handler
  const handleGitHubLogin = () => {
    const githubClientId = "Ov23liczIPidk9u5hA1o";
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent("user:email");
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>

      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4 py-8"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${BACKGROUND_IMAGE})`,
        }}
      >
        <div 
          id="login-form-container"
          className="max-w-6xl w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl flex overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-fadeIn"
        >
          {/* Phần bên trái - Hình ảnh và thông tin */}
          <div className="w-1/2 hidden lg:block relative overflow-hidden animate-slideInLeft">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${COVER_IMAGE})` }}
            ></div>
            
            {/* Gradient overlay với hiệu ứng động */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 opacity-90"></div>
            
            {/* Nội dung */}
            <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
              <div>
                <h1 className="text-5xl font-bold mb-4">
                  E-Learning Platform
                </h1>
                <p className="text-xl opacity-90">
                  Nền tảng học trực tuyến hàng đầu Việt Nam
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6">
                  Chào mừng bạn quay trở lại!
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Hơn 10,000+ khóa học</h3>
                      <p className="text-white/80 text-sm">Từ cơ bản đến nâng cao</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Giảng viên chuyên nghiệp</h3>
                      <p className="text-white/80 text-sm">Đội ngũ giảng viên giàu kinh nghiệm</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Chứng chỉ uy tín</h3>
                      <p className="text-white/80 text-sm">Được công nhận toàn quốc</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm opacity-75">
                © 2024 E-Learning Platform. Tất cả quyền được bảo lưu.
              </div>
            </div>
          </div>

          {/* Phần bên phải - Form đăng nhập */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 animate-slideInRight">
            <div className="max-w-md w-full mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Đăng Nhập
                </h2>
                <p className="text-gray-600">
                  Tiếp tục hành trình học tập của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-pulse">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                      >
                        {showPassword ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white text-base
                    ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-[1.02] hover:shadow-lg"
                    } 
                    transition-all duration-300 flex items-center justify-center shadow-md`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Hoặc đăng nhập bằng
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 group"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="mr-2 group-hover:scale-110 transition-transform duration-300"
                    >
                      <path
                        fill="#EA4335"
                        d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                      />
                      <path
                        fill="#4A90E2"
                        d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 group"
                  >
                    <FaGithub className="text-gray-800 mr-2 text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium text-gray-700">GitHub</span>
                  </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-8">
                  Bạn chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;