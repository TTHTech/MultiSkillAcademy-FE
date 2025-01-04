import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const BACKGROUND_IMAGE = "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const FormInput = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 
                 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 
                 focus:border-indigo-500 transition-all duration-200"
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
  </div>
);

const ResetPassForm = () => {
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', formData);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data || 'An error occurred while resetting your password.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
         style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}>
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl">
        {/* Header */}
        <div className="text-center p-6 border-b border-gray-200">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-3">
            <FaKey className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-600">Reset Password</h2>
          <p className="text-sm text-gray-600 mt-1">Enter your details to reset password</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <FormInput
                  type="email"
                  name="email"
                  icon={FaEnvelope}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">OTP Code</label>
                <FormInput
                  type="text"
                  name="otp"
                  icon={FaKey}
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP code"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 
                             bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 
                             focus:border-indigo-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 
                             text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-sm font-medium text-white 
                        ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
                        transition-all duration-200 flex items-center justify-center mt-4`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" 
                            stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </>
              ) : 'Reset Password'}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Back to Login
              </button>
            </div>
          </form>

          {/* Password Tips */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
            <div className="flex items-start">
              <FaLock className="h-4 w-4 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <p className="font-medium text-blue-800">Password Requirements:</p>
                <ul className="mt-1 text-blue-700 text-xs space-y-1">
                  <li>• Minimum 8 characters</li>
                  <li>• Mix of upper & lowercase letters</li>
                  <li>• Include numbers and symbols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassForm;