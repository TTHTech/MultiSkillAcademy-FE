import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COVER_IMAGE =
  "https://thumbs.dreamstime.com/z/online-courses-e-learning-vector-background-text-mobile-phone-s-screen-school-elements-internet-devices-home-181482059.jpg";
const BACKGROUND_IMAGE =
  "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username,
          password,
        }
      );

      const { token, userId, email: userEmail, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

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
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg flex overflow-hidden">
        <div
          className="w-1/2 hidden lg:flex flex-col justify-center items-center text-center p-10 text-yellow-300"
          style={{ backgroundImage: `url(${COVER_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-white">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
            Log In to Your Account
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Access your personalized dashboard and explore your courses.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-600">
                  Remember me
                </span>
              </div>
              <p
                className="text-sm text-indigo-600 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center justify-center my-6 text-gray-400">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <span className="px-2">or</span>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>

          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full py-2 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition duration-300"
          >
            <FaGoogle className="text-red-500 mr-3" /> Continue with Google
          </button>

          <button
            onClick={() => handleOAuthLogin("facebook")}
            className="w-full py-2 mt-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition duration-300"
          >
            <FaFacebookF className="text-blue-600 mr-3" /> Continue with Facebook
          </button>

          <p className="text-center mt-6 text-gray-600">
            Don&apos;t have an account?{' '}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
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
