import { useState } from "react";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ChangePassword = ({ onClose }) => {
  const userId = Number(localStorage.getItem("userId"));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      await Swal.fire({
        title: "Lỗi",
        text: "Vui lòng điền đầy đủ thông tin!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      await Swal.fire({
        title: "Lỗi",
        text: "Mật khẩu mới không khớp nhau!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/auth/change-password/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword: confirmNewPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to change password");
      }

      await Swal.fire({
        title: "Thành công",
        text: "Đổi mật khẩu thành công!",
        icon: "success",
        confirmButtonText: "OK",
      });
      onClose();
    } catch (err) {
      await Swal.fire({
        title: "Lỗi",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const inputClass =
    "w-full h-12 px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Change Password
        </h2>
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="currentPassword" className="text-gray-700 font-medium">
                Current Password
              </label>
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="text-gray-600 focus:outline-none"
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              id="currentPassword"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="newPassword" className="text-gray-700 font-medium">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-gray-600 focus:outline-none"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter a new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label htmlFor="confirmNewPassword" className="text-gray-700 font-medium">
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-6">
          <button
            onClick={handleChangePassword}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ease-in-out"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;