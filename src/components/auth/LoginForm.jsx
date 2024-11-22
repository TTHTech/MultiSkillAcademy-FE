import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF } from 'react-icons/fa'; // Sử dụng react-icons

const COVER_IMAGE = "https://th.bing.com/th/id/OIP.-gBwsfF1KOrChcmovXabUQHaFj?w=203&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      const { token, userId, email: userEmail, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role);

      if (role === "ROLE_STUDENT") {
        navigate('/student/home');
      } else if (role === "ROLE_INSTRUCTOR") {
        navigate('/instructor/user');
      } else if (role === "ROLE_ADMIN") {
        navigate('/admin');
      } else {
        setError("Unknown role.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password.');
      } else if (error.response && error.response.status === 403) {
        setError('Account not verified. Please verify your OTP.');
      } else {
        setError('An error occurred. Please try again later.');
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
      <div className="w-1/2 h-full bg-white flex flex-col justify-center p-16">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Interactive Academy</h1>
        <h2 className="text-4xl font-extrabold text-indigo-600 text-center mb-6">Log In to Your Account</h2>

        <p className="text-gray-600 mb-8 text-center">Welcome back! Log in to continue your learning journey.</p>

        {/* Form đăng nhập */}
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
              style={{
                WebkitBoxShadow: '0 0 0px 1000px white inset', 
                WebkitTextFillColor: 'black', 
                color: '#000', 
              }}
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
              style={{
                WebkitBoxShadow: '0 0 0px 1000px white inset',
                WebkitTextFillColor: 'black',
                color: '#000',
              }}
            />
          </div>

          {/* Remember me và forgot password */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm text-gray-600">Remember me for 30 days</p>
            </div>
            <p className="text-sm text-indigo-600 cursor-pointer">Forgot Password?</p>
          </div>

          {/* Nút đăng nhập */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-800 transition"
          >
            Log in
          </button>
        </form>

        {/* Nút đăng ký */}
        <div className="w-full mt-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 border border-gray-300 text-black rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ color: '#000' }}
          >
            Create a New Account
          </button>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <span className="px-2 text-gray-500">or</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>

        {/* Nút đăng nhập bằng Google */}
        <div className="w-full">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FaGoogle className="h-5 w-5 mr-3 text-[#4285F4]" /> {/* Màu của icon Google */}
            <span className="text-[#4285F4]">Continue with Google</span> {/* Màu văn bản của Google */}
          </button>
        </div>

        {/* Nút đăng nhập bằng Facebook */}
        <div className="w-full mt-4">
          <button
            onClick={() => handleOAuthLogin('facebook')}
            className="w-full py-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <FaFacebookF className="h-5 w-5 mr-3 text-[#1877F2]" /> {/* Màu của icon Facebook */}
            <span className="text-[#1877F2]">Continue with Facebook</span> {/* Màu văn bản của Facebook */}
          </button>
        </div>



        <div className="w-full text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account? <span className="text-indigo-600 cursor-pointer" onClick={() => navigate('/register')}>Sign up for free</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
