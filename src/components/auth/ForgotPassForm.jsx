import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaGraduationCap, FaArrowLeft, FaPaperPlane, FaUnlockAlt, FaUserShield, FaClock } from "react-icons/fa";
import { HiSparkles, HiCode, HiLightBulb, HiMail, HiKey, HiShieldCheck } from "react-icons/hi";
import { BsEnvelopeCheckFill } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ForgotPassForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('forgot-container')?.classList.add('fade-in-active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/forgot-password`, 
        { email }
      );

      if (response.status === 200) {
        localStorage.setItem("resetEmail", email);
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        navigate("/reset-password");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Email không tồn tại hoặc đã xảy ra lỗi.");
      toast.error("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none">
          <HiMail className="absolute top-[20%] left-[8%] text-white/5 text-6xl animate-float" />
          <HiKey className="absolute top-[30%] right-[12%] text-white/5 text-5xl animate-float animation-delay-2000" />
          <HiShieldCheck className="absolute bottom-[25%] left-[15%] text-white/5 text-7xl animate-float animation-delay-4000" />
          <HiCode className="absolute bottom-[35%] right-[8%] text-white/5 text-5xl animate-float" />
          <HiSparkles className="absolute top-[65%] right-[25%] text-white/5 text-6xl animate-float animation-delay-2000" />
          <HiLightBulb className="absolute top-[50%] left-[5%] text-white/5 text-5xl animate-float animation-delay-4000" />
        </div>
      </div>

      <div id="forgot-container" className="fade-in max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden z-10 border border-white/20">
        {/* Left side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600/90 via-indigo-600/90 to-pink-600/90 p-10 relative">
          <div className="w-full flex flex-col justify-between">
            {/* Logo and Brand */}
            <div>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <h1 className="text-xl font-bold text-white">MultiSkillAcademy</h1>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Quên Mật Khẩu?<br />
                Đừng Lo Lắng<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Chúng Tôi Hỗ Trợ Bạn
                </span>
              </h2>
              
              <p className="text-white/90 text-base">
                Khôi phục tài khoản của bạn chỉ trong vài bước đơn giản
              </p>
            </div>

            {/* Process Steps */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-yellow-300 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Nhập Email</h3>
                  <p className="text-white/80 text-xs">Nhập địa chỉ email đã đăng ký</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-green-300 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Nhận Mã OTP</h3>
                  <p className="text-white/80 text-xs">Kiểm tra email để nhận mã xác thực</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <span className="text-blue-300 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Tạo Mật Khẩu Mới</h3>
                  <p className="text-white/80 text-xs">Đặt mật khẩu mới an toàn cho tài khoản</p>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl flex items-center justify-center">
                  <FaClock className="text-purple-300 text-lg" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Hỗ trợ nhanh chóng</p>
                  <p className="text-white/80 text-xs">Nhận OTP trong vòng 60 giây</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl flex items-center justify-center">
                  <FaUserShield className="text-green-300 text-lg" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">An toàn tuyệt đối</p>
                  <p className="text-white/80 text-xs">Mã OTP chỉ có hiệu lực trong 10 phút</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          
          {/* Email illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
            <BsEnvelopeCheckFill className="text-white text-[200px] rotate-12" />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-white flex items-center">
          <div className="max-w-md mx-auto w-full">
            {/* Back button */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Quay lại đăng nhập</span>
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">MultiSkillAcademy</h1>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên Mật Khẩu?</h2>
              <p className="text-gray-600">Nhập email để nhận mã khôi phục tài khoản</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-shake">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="example@email.com"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Nhập email bạn đã sử dụng khi đăng ký tài khoản
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-200 ${
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
                    Đang gửi mã OTP...
                  </div>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Gửi mã khôi phục
                  </>
                )}
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">Lưu ý quan trọng</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Mã OTP sẽ được gửi đến email đã đăng ký</li>
                    <li>• Vui lòng kiểm tra cả thư mục spam/rác</li>
                    <li>• Mã OTP có hiệu lực trong 10 phút</li>
                    <li>• Không chia sẻ mã OTP với bất kỳ ai</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Alternative Options */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Nhớ mật khẩu?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Cần hỗ trợ? Liên hệ{' '}
                  <a href="mailto:support@multiskillacademy.com" className="text-purple-600 hover:text-purple-700 hover:underline">
                    support@multiskillacademy.com
                  </a>
                </p>
              </div>
            </div>
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

export default ForgotPassForm;