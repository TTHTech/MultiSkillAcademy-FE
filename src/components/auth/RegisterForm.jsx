import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify"; // Import toast thông báo
import "react-toastify/dist/ReactToastify.css"; // CSS cho Toast

// URL ảnh nền
const COVER_IMAGE = "https://img2.thuthuatphanmem.vn/uploads/2018/12/30/anh-background-dep-nhat_110341130.jpg";
const BACKGROUND_IMAGE = "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Hàm xử lý khi submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu người dùng nhập vào (Optional: Kiểm tra sự hợp lệ của email, mật khẩu)
    if (!email || !password || !firstName || !lastName || !username) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://educoresystem-1.onrender.com/api/auth/register",
        {
          firstName,
          lastName,
          username,
          email,
          password,
        }
      );

      if (response.status === 200) {
        localStorage.setItem("emailForOtp", email);
        toast.success("Registration successful! Please verify your email.");
        window.location.href = "/verify-otp"; // Chuyển hướng đến trang OTP
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User already exists or invalid input.");
        toast.error("User already exists or invalid input.");
      } else {
        setError("An error occurred. Please try again later.");
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Phần bên trái - hình ảnh */}
      <div className="w-1/2 h-full relative flex items-center justify-center bg-gray-100">
        <img src={COVER_IMAGE} className="absolute inset-0 w-full h-full object-cover" alt="cover" />
        <div className="relative z-10 text-white px-12">
          <h1 className="text-4xl font-bold mb-4">
            Start Your Learning Journey Today
          </h1>
          <p className="text-lg">
            Access exclusive courses and learn from top instructors. Register now!
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Lớp mờ trên hình */}
      </div>

      {/* Phần bên phải - form đăng ký */}
      <div
        className="w-1/2 h-full flex flex-col justify-center p-16"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`, // Đặt ảnh nền
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <h2 className="text-4xl font-extrabold text-indigo-600 text-center mb-6">
          Create Your Account
        </h2>

        <p className="text-gray-600 mb-8 text-center">
          Sign up now and start accessing our course library today. It's quick and easy!
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <input
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-800 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-center my-4">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <span className="px-2 text-gray-500">or</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>

        <div className="w-full">
          <button
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ color: "#4285F4" }}
          >
            <FaGoogle className="h-5 w-5 mr-3" />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="w-full mt-4">
          <button
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ color: "#1877F2" }}
          >
            <FaFacebookF className="h-5 w-5 mr-3" />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="w-full text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
