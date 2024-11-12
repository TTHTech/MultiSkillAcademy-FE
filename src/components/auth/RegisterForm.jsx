import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF} from "react-icons/fa"; // Sử dụng react-icons

// Thay các đường dẫn file ảnh bằng URL trực tiếp
const COVER_IMAGE = "https://th.bing.com/th/id/OIF.TBZ8ikOFhKgY86fCXq4ZmQ?w=282&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState(""); // Thêm state cho firstName
  const [lastName, setLastName] = useState("");   // Thêm state cho lastName
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu POST tới backend để đăng ký
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          firstName: firstName,  // Gửi firstName
          lastName: lastName,    // Gửi lastName
          username: username,
          email: email,
          password: password,
        }
      );

      // Nếu đăng ký thành công, chuyển người dùng đến trang OTP
      if (response.status === 200) {
        localStorage.setItem("emailForOtp", email); // Lưu email cho xác thực OTP
        window.location.href = "/verify-otp"; // Chuyển hướng đến trang xác thực OTP
      }
    } catch (error) {
      // Xử lý lỗi khi đăng ký thất bại
      if (error.response && error.response.status === 409) {
        setError("User already exists or invalid input.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Phần bên trái - hình ảnh */}
      <div className="w-1/2 h-full relative flex items-center justify-center bg-gray-100">
        <img
          src={COVER_IMAGE}
          className="absolute inset-0 w-full h-full object-cover"
          alt="cover"
        />
        <div className="relative z-10 text-white px-12">
          <h1 className="text-4xl font-bold mb-4">
            Start Your Learning Journey Today
          </h1>
          <p className="text-lg">
            Access exclusive courses and learn from top instructors. Register now!
          </p>
        </div>
        <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
        {/* Lớp mờ trên hình */}
      </div>

      {/* Phần bên phải - form đăng ký */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center p-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Interactive Academy
        </h1>

        {/* Tiêu đề Register */}
        <h2 className="text-4xl font-extrabold text-indigo-600 text-center mb-6">
          Create Your Account
        </h2>

        <p className="text-gray-600 mb-8 text-center">
          Sign up now and start accessing our course library today. It's quick and easy!
        </p>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <input
              type="text"
              placeholder="First Name" // Thêm input cho First Name
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-semibold"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Last Name"  // Thêm input cho Last Name
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-semibold"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-semibold"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-semibold"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black font-semibold"
            />
          </div>

          {/* Nút đăng ký */}
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

        {/* Nút đăng nhập bằng Google */}
        <div className="w-full">
          <button
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ display: 'flex', alignItems: 'center', color: '#4285F4' }}
          >
            <FaGoogle className="h-5 w-5 mr-3" /> {/* Icon Google */}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Nút đăng nhập bằng Facebook */}
        <div className="w-full mt-4">
          <button
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ display: 'flex', alignItems: 'center', color: '#1877F2' }}
          >
            <FaFacebookF className="h-5 w-5 mr-3" /> {/* Icon Facebook */}
            <span>Continue with Facebook</span>
          </button>
        </div>

    
       

        {/* Chuyển hướng đến trang đăng nhập */}
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
