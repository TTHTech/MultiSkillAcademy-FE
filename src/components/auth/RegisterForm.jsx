import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const COVER_IMAGE =
  "https://thumbs.dreamstime.com/z/word-training-courses-written-notebook-business-office-desktop-253334437.jpg";
const BACKGROUND_IMAGE =
  "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";

const RegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName || !username) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
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
        window.location.href = "/verify-otp";
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
    <div
      className="flex items-center justify-center w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg flex overflow-hidden">
        <div
          className="w-1/2 hidden lg:flex flex-col justify-center items-center text-center p-10 text-white"
          style={{
            backgroundImage: `url(${COVER_IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
         
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 bg-white">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-4">
            Create Your Account
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Fill out the form to get started. It's fast and easy!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
              <input
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center justify-center my-4 text-gray-400">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <span className="px-2">or</span>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>

          <button
            className="w-full py-2 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition duration-300"
            style={{ color: "#4285F4" }}
          >
            <FaGoogle className="text-red-500 mr-3" />
            Continue with Google
          </button>

          <button
            className="w-full py-2 mt-3 border border-gray-300 flex items-center justify-center rounded-md font-semibold hover:bg-gray-100 transition duration-300"
            style={{ color: "#1877F2" }}
          >
            <FaFacebookF className="text-blue-600 mr-3" />
            Continue with Facebook
          </button>

          <p className="text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-indigo-600 font-semibold cursor-pointer hover:underline"
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
