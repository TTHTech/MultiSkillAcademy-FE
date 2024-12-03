import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const COVER_IMAGE = "https://phunugioi.com/wp-content/uploads/2020/02/mau-background-dep.jpg";
const BACKGROUND_IMAGE = "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg"; // Đường dẫn ảnh (đặt ảnh trong thư mục public nếu dùng React)

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", {
      username,
      password,
    });

    const { token, userId, email: userEmail, role } = response.data;

    // Lưu thông tin vào localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("role", role);

    // Thông báo thành công
    toast.success("Login successful!");

    // Điều hướng dựa trên vai trò người dùng
    if (role === "ROLE_STUDENT") {
      navigate("/student/home");
    } else if (role === "ROLE_INSTRUCTOR") {
      navigate("/instructor/user");
    } else if (role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      setError("Unknown role.");
      toast.error("Unknown role.");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      setError("Invalid username or password.");
      toast.error("Invalid username or password.");
    } else if (error.response && error.response.status === 403) {
      setError("Account not verified. Please verify your OTP.");
      toast.error("Account not verified. Please verify your OTP.");
    } else {
      setError("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    }
  }
};


  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorize/${provider}`;
  };

  return (
    <div className="w-full h-screen flex">
      {/* Phần bên trái - hình ảnh */}
      <div className="w-1/2 h-full relative flex items-center justify-center bg-gray-100">
        <img src={COVER_IMAGE} className="absolute inset-0 w-full h-full object-cover" alt="cover" />
        <div className="relative z-10 text-white px-12">
          <h1 className="text-4xl font-bold mb-4">Unlock Your Potential with Top Courses</h1>
          <p className="text-lg">Join thousands of learners and explore our curated course catalog today!</p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Lớp mờ trên hình */}
      </div>

      {/* Phần bên phải - form đăng nhập */}
      <div
        className="w-1/2 h-full bg-white flex flex-col justify-center p-16"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`, // Đặt ảnh nền
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Interactive Academy</h1>
        <h2 className="text-4xl font-extrabold text-indigo-600 text-center mb-6">Log In to Your Account</h2>

        <p className="text-gray-600 mb-8 text-center">Welcome back! Log in to continue your learning journey.</p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && <p className="text-red-500">{error}</p>}
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
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm text-gray-600">Remember me for 30 days</p>
            </div>
            <p className="text-sm text-indigo-600 cursor-pointer">Forgot Password?</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-800 transition"
          >
            Log in
          </button>
        </form>

        <div className="w-full mt-4">
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 border border-gray-300 text-black rounded-md font-semibold hover:bg-gray-100 transition"
          >
            Create a New Account
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <span className="px-2 text-gray-500">or</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>

        <div className="w-full">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
          >
            <FaGoogle className="h-5 w-5 mr-3 text-[#4285F4]" />
            <span className="text-[#4285F4]">Continue with Google</span>
          </button>
        </div>

        <div className="w-full mt-4">
          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
          >
            <FaFacebookF className="h-5 w-5 mr-3 text-[#1877F2]" />
            <span className="text-[#1877F2]">Continue with Facebook</span>
          </button>
        </div>

        <div className="w-full text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-indigo-600 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
