import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Gọi API logout (nếu đã triển khai)
        if (token) {
          try {
            await axios.post('http://localhost:8080/api/auth/logout', {}, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          } catch (error) {
            console.error('Error during API logout:', error);
            // Tiếp tục quy trình logout ngay cả khi API gặp lỗi
          }
        }
        
        // 2. Xóa tất cả dữ liệu từ localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        
        // 3. Xóa các cookie phiên làm việc (nếu có)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });
        
        // 4. Hiển thị thông báo thành công
        toast.success('Đăng xuất thành công');
        
        // 5. Chuyển hướng đến trang đăng nhập sau khi logout
        setTimeout(() => {
          navigate('/login');
        }, 1000);
        
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Đã xảy ra lỗi khi đăng xuất');
        navigate('/login');
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Đang đăng xuất...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
};

export default Logout;