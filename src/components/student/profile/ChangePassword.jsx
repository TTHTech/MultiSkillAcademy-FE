import React, { useState } from "react";
import { Eye, EyeOff, Lock, Key, RefreshCw } from "lucide-react";

const Alert = ({ variant = "default", children }) => (
  <div className={`p-4 rounded-lg mb-4 ${
    variant === "destructive" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
  }`}>
    <p className="text-sm font-medium">{children}</p>
  </div>
);

const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validatePasswords = () => {
    if (formData.newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) {
        throw new Error("Không tìm thấy thông tin xác thực");
      }

      const response = await fetch(
        `http://localhost:8080/api/auth/change-password/${userId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currentPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
          })
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Đổi mật khẩu không thành công");
      }

      setSuccess("Mật khẩu đã được thay đổi thành công");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center gap-3 text-white">
            <Key className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Đổi Mật Khẩu</h2>
          </div>
        </div>

        <div className="p-6">
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && <Alert>{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              label="Mật khẩu hiện tại"
              value={formData.oldPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
              placeholder="Nhập mật khẩu hiện tại"
            />

            <PasswordInput
              label="Mật khẩu mới"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
            />

            <PasswordInput
              label="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Nhập lại mật khẩu mới"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Key className="h-5 w-5" />
              )}
              {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;