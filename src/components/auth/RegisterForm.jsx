import { useState, useEffect } from "react";
import axios from "axios";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash, FaUserPlus, FaRocket, FaShieldAlt, FaCertificate } from "react-icons/fa";
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineTrendingUp } from "react-icons/hi";
import { BsCheckCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('register-container')?.classList.add('fade-in-active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

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
      toast.error("Vui lòng điền đầy đủ thông tin.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/register`,
        formData
      );

      if (response.status === 200) {
        localStorage.setItem("emailForOtp", formData.email);
        toast.success("Đăng ký thành công! Vui lòng xác thực email của bạn.");
        window.location.href = "/verify-otp";
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Người dùng đã tồn tại hoặc thông tin không hợp lệ.");
        toast.error("Người dùng đã tồn tại hoặc thông tin không hợp lệ.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleClientId = '979797905767-l9rt1m82le6jfmmr9v0mbpqnsh8va1es.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
    const scope = encodeURIComponent('email profile');
    const responseType = 'code';
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };

  const handleGitHubLogin = () => {
    const githubClientId = 'Ov23liczIPidk9u5hA1o';
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
    const scope = encodeURIComponent('user:email');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return { text: "Rất yếu", color: "text-gray-400" };
      case 1: return { text: "Yếu", color: "text-red-500" };
      case 2: return { text: "Trung bình", color: "text-yellow-500" };
      case 3: return { text: "Mạnh", color: "text-green-500" };
      case 4: return { text: "Rất mạnh", color: "text-green-600" };
      default: return { text: "", color: "" };
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Sparkles effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div id="register-container" className="fade-in max-w-6xl w-full h-[90vh] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex overflow-hidden z-10 border border-white/20">
        {/* Left side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-indigo-600/90 p-8 relative">
          <div className="w-full flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-center mb-4">
                <FaRocket className="text-white text-3xl mr-2 animate-pulse" />
                <h1 className="text-2xl font-bold text-white">EduPlatform</h1>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Bắt Đầu<br />
                Hành Trình<br />
                <span className="text-yellow-300">Thành Công</span>
              </h2>
              
              <p className="text-white/90 text-base mb-6">
                Tham gia cùng hàng nghìn học viên đang phát triển kỹ năng mỗi ngày
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiOutlineSparkles className="text-yellow-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Học Tập Cá Nhân Hóa</h3>
                  <p className="text-white/80 text-xs">AI điều chỉnh lộ trình học phù hợp với bạn</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiOutlineUserGroup className="text-green-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Cộng Đồng Hỗ Trợ</h3>
                  <p className="text-white/80 text-xs">Kết nối với mentor và bạn học toàn cầu</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaCertificate className="text-blue-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Chứng Chỉ Uy Tín</h3>
                  <p className="text-white/80 text-xs">Được công nhận bởi các doanh nghiệp hàng đầu</p>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-4 pt-6 border-t border-white/20">
              <div className="flex items-center space-x-1">
                <FaShieldAlt className="text-green-400 text-base" />
                <span className="text-white text-xs">Bảo mật cao</span>
              </div>
              <div className="flex items-center space-x-1">
                <BsCheckCircleFill className="text-blue-400 text-base" />
                <span className="text-white text-xs">Đăng ký miễn phí</span>
              </div>
              <div className="flex items-center space-x-1">
                <HiOutlineTrendingUp className="text-yellow-400 text-base" />
                <span className="text-white text-xs">Cập nhật liên tục</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-400/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto h-full flex flex-col">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-4">
              <FaRocket className="text-purple-600 text-2xl mr-2" />
              <h1 className="text-xl font-bold text-gray-800">EduPlatform</h1>
            </div>

            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-2">
                <FaUserPlus className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Tạo Tài Khoản Mới</h2>
              <p className="text-gray-600 text-sm">Chỉ mất 30 giây để bắt đầu học tập</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200 text-sm"
                    placeholder="Nguyễn"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tên
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200 text-sm"
                    placeholder="Văn A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200 text-sm"
                  placeholder="Chọn tên đăng nhập độc đáo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200 text-sm"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200 pr-10 text-sm"
                    placeholder="Tạo mật khẩu mạnh"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-1">
                    <div className="flex space-x-1 mb-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${getPasswordStrengthText().color}`}>
                      Độ mạnh: {getPasswordStrengthText().text}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5"
                  required
                />
                <label className="ml-2 text-xs text-gray-600">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Điều khoản
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                    Chính sách
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-lg transform transition-all duration-200 text-sm ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo tài khoản...
                  </div>
                ) : (
                  "Tạo Tài Khoản"
                )}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">Hoặc đăng ký với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200 hover:border-gray-400 hover:shadow-md group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                  </svg>
                  <span className="text-xs font-medium text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all duration-200 hover:border-gray-400 hover:shadow-md group"
                >
                  <FaGithub className="text-gray-800 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-gray-700">GitHub</span>
                </button>
              </div>

              <div className="text-center pt-3 border-t border-gray-200 mt-auto">
                <p className="text-gray-600 text-sm">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => window.location.href = "/login"}
                    className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
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
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: sparkle 5s linear infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { transform: translateY(-100px); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;