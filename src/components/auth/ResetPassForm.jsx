import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';

const ResetPassForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xóa thông báo lỗi hoặc thành công cũ khi người dùng nhấn "Submit"
    toast.dismiss();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/verify-otp', {
        email,
        otp,
        newPassword
      });

      toast.success('Password reset successful!');
      // Điều hướng đến trang login sau khi reset mật khẩu thành công
      navigate('/login'); // Chuyển hướng đến trang đăng nhập
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data || 'An error occurred!');
      } else {
        toast.error('An error occurred while resetting your password.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-opacity-70 bg-transparent">
      <div className="bg-white p-8 rounded-md shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-800 transition"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassForm;
