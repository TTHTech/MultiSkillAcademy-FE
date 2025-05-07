import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy code từ query parameters
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (!code) {
      setError('Không nhận được mã xác thực từ Google');
      setLoading(false);
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // Gửi code đến backend để đổi lấy token JWT
        const response = await axios.post(`${baseUrl}/api/auth/google/callback`, { code });
        
        if (response.data && response.data.token) {
          // Lưu thông tin đăng nhập
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('role', response.data.role);
          
          toast.success('Đăng nhập bằng Google thành công!');
          
          // Chuyển hướng người dùng dựa trên vai trò
          if (response.data.role === 'ROLE_STUDENT') {
            navigate('/student/home');
          } else if (response.data.role === 'ROLE_INSTRUCTOR') {
            navigate('/instructor/user');
          } else if (response.data.role === 'ROLE_ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          setError('Không nhận được token từ server');
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError(error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập bằng Google');
        toast.error('Đăng nhập bằng Google thất bại');
      } finally {
        setLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [location, navigate]);

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
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;