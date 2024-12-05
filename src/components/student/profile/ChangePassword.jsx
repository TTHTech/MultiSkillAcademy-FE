import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        toast.error("Không tìm thấy token hoặc userId trong localStorage.");
        return;
      }

      // Make the API call to change the password with userId
      const response = await axios.post(
        `http://localhost:8080/api/auth/change-password/${userId}`, // API URL based on your endpoint
        {
          currentPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Bearer token for authentication
          },
        }
      );

      if (response.status === 200) {
        toast.success("Mật khẩu đã được thay đổi.");
      } else {
        toast.error(response.data || "Đổi mật khẩu không thành công.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi thay đổi mật khẩu.");
      toast.error("Có lỗi xảy ra khi thay đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đổi Mật Khẩu</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu cũ</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu cũ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md mt-4 hover:bg-purple-700 focus:ring-2 focus:ring-purple-600"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
