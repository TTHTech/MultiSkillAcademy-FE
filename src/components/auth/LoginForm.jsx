import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaEye, FaEyeSlash, FaGraduationCap, FaLock, FaUser, FaArrowRight } from "react-icons/fa";
import { HiSparkles, HiAcademicCap, HiLightBulb, HiCode, HiChartBar, HiGlobeAlt } from "react-icons/hi";
import { BsCheckCircleFill, BsShieldFillCheck } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('login-container')?.classList.add('fade-in-active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        username,
        password,
      });

      const { token, userId, email: userEmail, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);

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
      } else if (error.response && error.response.status === 403) {
        setError("Tài khoản chưa được xác thực. Vui lòng xác thực OTP của bạn.");
        toast.error("Tài khoản chưa được xác thực. Vui lòng xác thực OTP của bạn.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleClientId = "979797905767-l9rt1m82le6jfmmr9v0mbpqnsh8va1es.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = encodeURIComponent("email profile");
    const responseType = "code";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };

  const handleGitHubLogin = () => {
    const githubClientId = "Ov23liczIPidk9u5hA1o";
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent("user:email");
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <HiCode className="absolute top-[10%] left-[5%] text-white/5 text-6xl animate-float" />
          <HiLightBulb className="absolute top-[20%] right-[10%] text-white/5 text-5xl animate-float animation-delay-2000" />
          <HiChartBar className="absolute bottom-[15%] left-[8%] text-white/5 text-7xl animate-float animation-delay-4000" />
          <HiAcademicCap className="absolute bottom-[25%] right-[5%] text-white/5 text-6xl animate-float" />
          <HiGlobeAlt className="absolute top-[50%] left-[3%] text-white/5 text-5xl animate-float animation-delay-2000" />
          <HiSparkles className="absolute top-[70%] right-[8%] text-white/5 text-6xl animate-float animation-delay-4000" />
        </div>
      </div>

      <div id="login-container" className="fade-in max-w-5xl w-full h-[88vh] bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden z-10 border border-white/20">
        {/* Left side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-pink-600/90 p-10 relative">
          <div className="w-full flex flex-col justify-between">
            {/* Logo and Brand */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <h1 className="text-xl font-bold text-white">MultiSkillAcademy</h1>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Chào Mừng<br />
                Trở Lại<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Hành Trình Học Tập
                </span>
              </h2>
              
              <p className="text-white/90 text-base">
                Khám phá hàng ngàn khóa học từ các chuyên gia hàng đầu
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <HiSparkles className="text-yellow-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Học Tập Thông Minh</h3>
                  <p className="text-white/80 text-xs">AI cá nhân hóa lộ trình học tập cho riêng bạn</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <HiGlobeAlt className="text-green-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Kết Nối Toàn Cầu</h3>
                  <p className="text-white/80 text-xs">Học cùng hàng triệu học viên trên thế giới</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <BsShieldFillCheck className="text-blue-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Chứng Chỉ Quốc Tế</h3>
                  <p className="text-white/80 text-xs">Được công nhận bởi các tổ chức hàng đầu</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-white/70 text-xs">Học viên</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">1000+</p>
                <p className="text-white/70 text-xs">Khóa học</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-white/70 text-xs">Hài lòng</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-white flex items-center">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">MultiSkill Academy</h1>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-3 shadow-lg">
                <FaLock className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Đăng Nhập</h2>
              <p className="text-gray-600 text-sm">Tiếp tục hành trình học tập của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-shake">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
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
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <label className="ml-2 text-sm text-gray-700 cursor-pointer hover:text-purple-600 transition-colors">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
                } flex items-center justify-center group`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </div>
                ) : (
                  <>
                    Đăng nhập
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200 hover:border-gray-400 hover:shadow-md group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200 hover:border-gray-400 hover:shadow-md group"
                >
                  <FaGithub className="text-gray-800 text-xl group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">GitHub</span>
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                  >
                    Đăng ký miễn phí
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
        }
        .fade-in-active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default LoginForm;