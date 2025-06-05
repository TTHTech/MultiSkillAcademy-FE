import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash, FaGraduationCap, FaArrowLeft, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles, HiCode, HiLightBulb, HiMail } from 'react-icons/hi';
import { BsShieldLockFill } from 'react-icons/bs';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ResetPassForm = () => {
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById('reset-container')?.classList.add('fade-in-active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Password strength checker
  useEffect(() => {
    const password = formData.newPassword;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    setPasswordStrength(strength);
  }, [formData.newPassword]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${baseUrl}/api/auth/verify-otp`, formData);
      toast.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data || 'Đã xảy ra lỗi khi đặt lại mật khẩu.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#EF4444', '#F59E0B', '#EAB308', '#10B981'];
    return colors[passwordStrength - 1] || '#E5E7EB';
  };

  const getPasswordStrengthText = () => {
    const texts = ['Yếu', 'Trung bình', 'Khá', 'Mạnh'];
    return texts[passwordStrength - 1] || '';
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
          <HiCode className="absolute top-[15%] left-[10%] text-white/5 text-5xl animate-float" />
          <HiLightBulb className="absolute top-[25%] right-[15%] text-white/5 text-4xl animate-float animation-delay-2000" />
          <BsShieldLockFill className="absolute bottom-[20%] left-[12%] text-white/5 text-6xl animate-float animation-delay-4000" />
          <HiMail className="absolute bottom-[30%] right-[10%] text-white/5 text-5xl animate-float" />
          <HiSparkles className="absolute top-[60%] right-[20%] text-white/5 text-4xl animate-float animation-delay-2000" />
        </div>
      </div>

      <div id="reset-container" className="fade-in max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden z-10 border border-white/20">
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
                Bảo Mật<br />
                Tài Khoản<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  An Toàn Tuyệt Đối
                </span>
              </h2>
              
              <p className="text-white/90 text-base">
                Chúng tôi luôn đặt bảo mật của bạn lên hàng đầu
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <FaCheckCircle className="text-green-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Xác Thực 2 Lớp</h3>
                  <p className="text-white/80 text-xs">Bảo vệ tài khoản với mã OTP an toàn</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <FaShieldAlt className="text-blue-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Mã Hóa Cao Cấp</h3>
                  <p className="text-white/80 text-xs">Mật khẩu được mã hóa với chuẩn quốc tế</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 transform hover:translate-x-2 transition-transform duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <HiSparkles className="text-purple-300 text-lg" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">Bảo Mật Thông Minh</h3>
                  <p className="text-white/80 text-xs">AI theo dõi và bảo vệ tài khoản 24/7</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="mt-8 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl flex items-center justify-center">
                  <FaLock className="text-yellow-300 text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold">Cam kết bảo mật</p>
                  <p className="text-white/80 text-sm">Thông tin của bạn luôn được bảo vệ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Right side - Reset Form */}
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

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-3 shadow-lg">
                <FaKey className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Đặt Lại Mật Khẩu</h2>
              <p className="text-gray-600 text-sm">Nhập thông tin để tạo mật khẩu mới</p>
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Nhập email của bạn"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaKey className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      required
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Nhập mã OTP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Độ mạnh mật khẩu</span>
                        <span className="text-xs font-medium" style={{ color: getPasswordStrengthColor() }}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(passwordStrength / 4) * 100}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    Đặt lại mật khẩu
                    <FaArrowLeft className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Password requirements */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm mb-2">Yêu cầu mật khẩu:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Tối thiểu 8 ký tự</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.match(/[a-z]/) && formData.newPassword.match(/[A-Z]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Chữ hoa & thường</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.match(/[0-9]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Bao gồm số</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.newPassword.match(/[^a-zA-Z0-9]/) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-gray-600">Ký tự đặc biệt</span>
                    </div>
                  </div>
                </div>
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

export default ResetPassForm;