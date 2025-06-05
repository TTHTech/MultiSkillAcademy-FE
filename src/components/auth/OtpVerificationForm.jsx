import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaGraduationCap, FaShieldAlt, FaCheckCircle, FaClock, FaRedoAlt, FaArrowLeft } from "react-icons/fa";
import { HiSparkles, HiCode, HiLightBulb, HiMail, HiKey, HiShieldCheck } from "react-icons/hi";
import { BsShieldFillCheck } from "react-icons/bs";
import { MdVerified, MdEmail } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Constants
const OTP_TIMER_DURATION = 120; // 2 minutes in seconds
const OTP_LENGTH = 6;

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TIMER_DURATION);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('otp-container')?.classList.add('fade-in-active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format remaining time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (element, index) => {
    const value = element.value;
    
    // Allow only numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    
    if (/^\d+$/.test(pastedData)) {
      const pastedOtp = pastedData.split("").concat(new Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
      setOtp(pastedOtp);
      inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("emailForOtp");
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ mã xác thực");
      toast.error("Vui lòng nhập đầy đủ mã xác thực");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/auth/verify-otp-register`, {
        email,
        otp: otpCode,
      });

      if (response.status === 200) {
        toast.success("Xác thực OTP thành công!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Mã OTP không hợp lệ. Vui lòng thử lại.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("emailForOtp");
    if (!email) {
      toast.error("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${baseUrl}/api/auth/resend-otp`, { email });
      toast.success("Đã gửi lại mã OTP mới!");
      setTimeLeft(OTP_TIMER_DURATION);
      setCanResend(false);
      setOtp(new Array(OTP_LENGTH).fill(""));
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error("Gửi lại OTP thất bại. Vui lòng thử lại.");
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
          <HiMail className="absolute top-[15%] left-[10%] text-white/5 text-6xl animate-float" />
          <HiKey className="absolute top-[25%] right-[15%] text-white/5 text-5xl animate-float animation-delay-2000" />
          <HiShieldCheck className="absolute bottom-[20%] left-[12%] text-white/5 text-7xl animate-float animation-delay-4000" />
          <MdVerified className="absolute bottom-[30%] right-[10%] text-white/5 text-6xl animate-float" />
          <HiSparkles className="absolute top-[60%] right-[20%] text-white/5 text-5xl animate-float animation-delay-2000" />
          <HiCode className="absolute top-[50%] left-[5%] text-white/5 text-5xl animate-float animation-delay-4000" />
        </div>
      </div>

      <div id="otp-container" className="fade-in max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden z-10 border border-white/20">
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
                Xác Thực<br />
                Tài Khoản<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Chỉ Một Bước Nữa
                </span>
              </h2>
              
              <p className="text-white/90 text-base">
                Nhập mã OTP để hoàn tất đăng ký và bắt đầu hành trình học tập
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <FaCheckCircle className="text-green-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Xác Thực Nhanh Chóng</h3>
                  <p className="text-white/80 text-xs">Mã OTP 6 số đơn giản và dễ nhập</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <FaShieldAlt className="text-blue-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Bảo Mật Tuyệt Đối</h3>
                  <p className="text-white/80 text-xs">Mã OTP được mã hóa và bảo mật cao</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <FaClock className="text-purple-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Thời Gian Giới Hạn</h3>
                  <p className="text-white/80 text-xs">Mã OTP có hiệu lực trong 2 phút</p>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <BsShieldFillCheck className="text-green-300 text-4xl" />
                </div>
                <p className="text-white font-semibold text-lg mb-1">99.9% Bảo Mật</p>
                <p className="text-white/80 text-sm">Hơn 100,000 tài khoản được xác thực an toàn</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          
          {/* Shield illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
            <FaShieldAlt className="text-white text-[180px]" />
          </div>
        </div>

        {/* Right side - OTP Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 bg-white flex items-center">
          <div className="max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">MultiSkillAcademy</h1>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                <MdEmail className="text-white text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Xác Thực Email</h2>
              <p className="text-gray-600">Nhập mã 6 số đã được gửi đến email của bạn</p>
              
              {/* Display email */}
              <div className="mt-3 inline-flex items-center space-x-2 text-sm text-gray-500">
                <FaShieldAlt className="text-purple-500" />
                <span>Đã gửi đến: {localStorage.getItem("emailForOtp") || "email@example.com"}</span>
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-8">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 animate-shake">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* OTP Input Fields */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`w-14 h-16 text-center border-2 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-purple-200
                             text-xl font-bold transition-all duration-200
                             ${digit ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'}
                             ${loading ? 'bg-gray-100' : 'hover:border-purple-400'}
                             focus:border-purple-500 focus:bg-white
                             disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="text-center space-y-3">
                {!canResend ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FaClock className="text-purple-500" />
                    <p className="text-gray-600">
                      Gửi lại mã sau <span className="font-bold text-purple-600">{formatTime(timeLeft)}</span>
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors group"
                  >
                    <FaRedoAlt className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Gửi lại mã OTP</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
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
                    Đang xác thực...
                  </div>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Xác thực OTP
                  </>
                )}
              </button>
            </form>

            {/* Help Section */}
            <div className="mt-8 space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Không nhận được mã?</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Kiểm tra thư mục spam/rác trong email</li>
                      <li>• Đảm bảo địa chỉ email chính xác</li>
                      <li>• Chờ {canResend ? "và thử gửi lại" : "vài giây trước khi gửi lại"}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="text-center">
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

export default OtpVerificationForm;