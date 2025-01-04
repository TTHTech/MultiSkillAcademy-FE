import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const BACKGROUND_IMAGE = "https://toigingiuvedep.vn/wp-content/uploads/2021/02/background-may-dep-cho-khai-giang.jpg";
const OTP_TIMER_DURATION = 120; // 2 minutes in seconds
const OTP_LENGTH = 6;

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TIMER_DURATION);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format remaining time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (element, index) => {
    const value = element.value;
    
    // Allow only numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    
    if (/^\d+$/.test(pastedData)) {
      const pastedOtp = pastedData.split("").concat(new Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
      setOtp(pastedOtp);
      inputRefs.current[Math.min(pastedData.length, OTP_LENGTH - 1)].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("emailForOtp");
    const otpCode = otp.join("");

    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter all digits");
      toast.error("Please enter all digits");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-otp-register", {
        email,
        otp: otpCode,
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("emailForOtp");
    if (!email) {
      toast.error("Email not found. Please try registering again.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/auth/resend-otp", { email });
      toast.success("New OTP sent successfully!");
      setTimeLeft(OTP_TIMER_DURATION);
      setCanResend(false);
      setOtp(new Array(OTP_LENGTH).fill(""));
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleOtpSubmit} className="space-y-8">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center border-2 border-gray-300 rounded-lg 
                           focus:outline-none focus:border-indigo-500 focus:ring-2 
                           focus:ring-indigo-200 text-lg font-semibold transition-all
                           disabled:bg-gray-100"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="text-center space-y-3">
              {!canResend ? (
                <p className="text-gray-600">
                  Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Resend Code
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 focus:ring-offset-2 transition-all
                       disabled:bg-indigo-400 disabled:cursor-not-allowed
                       transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500">
            Didn't receive the code? Check your spam folder or{" "}
            <button
              onClick={handleResendOtp}
              disabled={!canResend || loading}
              className="text-indigo-600 hover:text-indigo-800 font-medium disabled:text-gray-400"
            >
              request a new one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationForm;