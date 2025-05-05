import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Cấu hình Google OAuth2 
const GOOGLE_CLIENT_ID = "979797905767-l9rt1m82le6jfmmr9v0mbpqnsh8va1es.apps.googleusercontent.com";
const BACKEND_URL = `${baseUrl}`;

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Sử dụng useRef để theo dõi việc đã gọi API hay chưa
  const hasCalledApi = useRef(false);

  useEffect(() => {
    // Chỉ xử lý khi component được mount lần đầu
    if (hasCalledApi.current) {
      console.log("API đã được gọi trước đó, bỏ qua");
      return;
    }

    hasCalledApi.current = true; // Đánh dấu đã gọi API

    // Lấy code từ query parameters
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    console.log("Google callback initiated, checking code...");

    if (!code) {
      console.error("No Google code found in URL");
      setError('Không nhận được mã xác thực từ Google');
      setLoading(false);
      return;
    }

    console.log("Google code received:", code.substring(0, 10) + "...");

    const processGoogleAuth = async () => {
      console.log("Starting Google authentication process...");
      try {
        console.log("Sending request to:", `${BACKEND_URL}/api/auth/google/exchange-code`);
        console.log("Sending Google code to backend...");
        
        // CÁCH 1: Gửi code đến backend để xử lý với timeout
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/google/exchange-code`, 
          { code },
          { timeout: 10000 } // Thêm timeout để tránh request treo
        );

        console.log("Response received from server:", {
          status: response.status,
          hasToken: response.data && !!response.data.token,
          role: response.data && response.data.role,
          userId: response.data && response.data.userId
        });

        // Xử lý kết quả đăng nhập
        if (response.data && response.data.token) {
          // Lưu thông tin đăng nhập
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('role', response.data.role);
          
          console.log("Auth data saved to localStorage, role:", response.data.role);
          toast.success('Đăng nhập bằng Google thành công!');
          
          // Chuyển hướng người dùng dựa trên vai trò
          setTimeout(() => {
            if (response.data.role === 'ROLE_STUDENT') {
              console.log("Navigating to student home page...");
              navigate('/student/home');
            } else if (response.data.role === 'ROLE_INSTRUCTOR') {
              console.log("Navigating to instructor page...");
              navigate('/instructor/user');
            } else if (response.data.role === 'ROLE_ADMIN') {
              console.log("Navigating to admin page...");
              navigate('/admin');
            } else {
              console.log("Unknown role, navigating to login page...");
              navigate('/login');
            }
          }, 100); // Thêm một chút delay để đảm bảo state được cập nhật
        } else {
          console.error("Invalid response format from server:", response.data);
          setError('Lỗi đăng nhập: Không nhận được token từ server');
          setLoading(false);
        }
      } catch (error) {
        console.error('Google login error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack
        });
        
        // Kiểm tra xem mặc dù có lỗi nhưng token đã được lưu chưa
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token && role) {
          console.log("Lỗi nhưng đã có token, có thể đăng nhập thành công từ request khác");
          toast.warning("Có lỗi xảy ra nhưng đăng nhập vẫn thành công");
          
          // Chuyển hướng dựa trên role đã lưu
          setTimeout(() => {
            if (role === 'ROLE_STUDENT') {
              navigate('/student/home');
            } else if (role === 'ROLE_INSTRUCTOR') {
              navigate('/instructor/user');
            } else if (role === 'ROLE_ADMIN') {
              navigate('/admin');
            }
          }, 100);
          return;
        }
        
        // Nếu có thông tin chi tiết về lỗi, hiển thị nó
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập bằng Google';
        
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage);
      }
    };

    processGoogleAuth();
  }, [location, navigate]); // Chỉ chạy khi location hoặc navigate thay đổi

  // Kiểm tra nếu đã đăng nhập thành công để tránh hiển thị lỗi
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role && error) {
      console.log("Đã tìm thấy token trong localStorage. Chuyển hướng mặc dù có lỗi.");
      if (role === 'ROLE_STUDENT') {
        navigate('/student/home');
      } else if (role === 'ROLE_INSTRUCTOR') {
        navigate('/instructor/user');
      } else if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      }
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Đang xử lý đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Kiểm tra một lần nữa xem có đã đăng nhập thành công không
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // Nếu đã có token, chuyển hướng ngay lập tức
      if (role === 'ROLE_STUDENT') {
        navigate('/student/home');
      } else if (role === 'ROLE_INSTRUCTOR') {
        navigate('/instructor/user');
      } else if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      }
      return null; // Không hiển thị gì cả trong quá trình chuyển hướng
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Đăng nhập thất bại</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
            >
              Quay lại trang đăng nhập
            </button>
            <button
              onClick={() => {
                // Kiểm tra xem có thông tin đăng nhập không
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('role');
                
                console.log("Kiểm tra localStorage:", {
                  token: token ? "exists" : "not found",
                  userId: localStorage.getItem('userId'),
                  email: localStorage.getItem('email'),
                  role
                });
                
                // Nếu đã có thông tin đăng nhập, thử điều hướng
                if (token && role) {
                  toast.info("Đã tìm thấy thông tin đăng nhập. Đang chuyển hướng...");
                  if (role === 'ROLE_STUDENT') {
                    navigate('/student/home');
                  } else if (role === 'ROLE_INSTRUCTOR') {
                    navigate('/instructor/user');
                  } else if (role === 'ROLE_ADMIN') {
                    navigate('/admin');
                  }
                } else {
                  toast.error("Không tìm thấy thông tin đăng nhập!");
                }
              }}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg"
            >
              Kiểm tra và thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallbackPage;