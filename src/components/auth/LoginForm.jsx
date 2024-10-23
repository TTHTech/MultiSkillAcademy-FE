import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi yêu cầu POST tới backend để đăng nhập
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username: username,
        password: password,
      });

      // Xử lý phản hồi đăng nhập thành công
      const { token, userId, email } = response.data;
      console.log("Login successful!", { token, userId, email });

      // Lưu token vào localStorage (hoặc sessionStorage) để sử dụng trong các yêu cầu sau này
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", email);

      // Chuyển hướng người dùng đến trang chính
      window.location.href = "/admin";  // Chuyển đến trang quản trị sau khi đăng nhập

    } catch (error) {
      // Xử lý lỗi khi đăng nhập thất bại
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else if (error.response && error.response.status === 403) {
        setError("Account not verified. Please verify your OTP.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-black">
          Username
        </label>
        <div className="mt-1">
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-black">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
