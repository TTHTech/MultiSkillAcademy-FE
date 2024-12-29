import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css"; // Import css của react-toastify

const BACKGROUND_IMAGE = "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const ForgotPassForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu đến API để gửi OTP
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", { email });

      if (response.status === 200) {
        toast.success("OTP sent to email!"); // Thông báo thành công

        // Lưu email vào localStorage để chuyển đến trang reset password
        localStorage.setItem("resetEmail", email);

        // Điều hướng đến trang reset-password sau khi gửi OTP thành công
        navigate("/reset-password");
      }
    } catch (error) {
      setError("Email not found or other error.");
      toast.error("Email not found or other error."); // Thông báo lỗi
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-4">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Please enter your email address to receive a reset password OTP.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 focus:text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold text-lg hover:bg-indigo-700 transition"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassForm;
