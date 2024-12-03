import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // Mảng để lưu 6 số OTP
  const [error, setError] = useState(null);

  // Hàm xử lý thay đổi trong các ô nhập OTP
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Chỉ cho phép nhập số

    let newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Chuyển đến ô tiếp theo tự động khi người dùng nhập một số
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  // Hàm xử lý khi gửi OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("emailForOtp"); // Lấy email từ localStorage đã lưu khi đăng ký
    const otpCode = otp.join(""); // Ghép 6 số lại thành một chuỗi

    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-otp-register", {
        email: email,
        otp: otpCode,
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500); 
      }
    } catch (error) {
   
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white"> {/* Đặt nền màu trắng */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"> {/* Nền của hộp form cũng màu trắng */}
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-4">Enter the 6-digit code sent to your email.</p>
        
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-semibold text-black bg-white"
                onFocus={(e) => e.target.select()} // Tự động chọn ô khi người dùng nhấp vào
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-800 transition"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
