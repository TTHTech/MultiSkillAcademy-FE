import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Thêm import toast
import { 
  User, 
  BookOpen, 
  ShoppingCart, 
  Heart,
  AlarmClock, 
  Globe, 
  UserCircle, 
  Settings, 
  LogOut 
} from 'lucide-react';

const DEFAULT_PROFILE_IMAGE = "https://lh3.googleusercontent.com/IUCQIQksFr7qJDlXK43uhIUwvDt_tpLSNiumv8bFESGLs6wekNyBDdNMyzeFwqgTe-l5vG6RSMvnUek=w544-h544-l90-rj";

const MenuItem = ({ to, icon: Icon, label, badge, onClick, className = "" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      group flex items-center px-4 py-2.5 text-gray-700 
      hover:bg-gray-50 transition-all duration-200
      ${className}
    `}
  >
    <Icon className="w-4 h-4 mr-3 text-gray-500 group-hover:text-purple-600" />
    <span className="group-hover:text-gray-900">{label}</span>
    {badge && (
      <span className="ml-auto bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
        {badge}
      </span>
    )}
  </Link>
);

const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Thêm hàm handleLogout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Hiển thị thông báo đang đăng xuất
      toast.info('Đang đăng xuất...');
      
      // Gọi API logout (tùy chọn)
      if (token) {
        try {
          await axios.post('http://localhost:8080/api/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Lỗi khi gọi API logout:', error);
          // Tiếp tục quá trình logout ngay cả khi API gặp lỗi
        }
      }
      
      // Xóa tất cả dữ liệu từ localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      
      // Xóa cookies nếu có
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      
      // Thông báo thành công
      toast.success('Đăng xuất thành công');
      
      // Chuyển hướng đến trang đăng nhập
      setTimeout(() => {
        navigate('/login');
      }, 500);
      
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      toast.error('Đã xảy ra lỗi khi đăng xuất');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("Authentication credentials missing");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/student/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { profileImage, firstName, lastName, email } = response.data;
        setProfileImage(profileImage || DEFAULT_PROFILE_IMAGE);
        setUserName(`${firstName} ${lastName}`);
        setUserEmail(email);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  let closeMenuTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeMenuTimeout);
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeMenuTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar Button */}
      <div className="relative">
        <div className={`
          p-1 rounded-full border-2 border-purple-500 
          cursor-pointer transition-transform duration-200 
          hover:scale-105 hover:border-purple-600
          ${isMenuOpen ? 'ring-2 ring-purple-200' : ''}
        `}>
          <img
            src={profileImage}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
            onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className={`
          absolute right-0 top-full mt-2 w-72 bg-white rounded-xl
          shadow-lg transform transition-all duration-200 
          border border-gray-100 overflow-hidden z-50
        `}>
          {/* Profile Header */}
          <Link to="/student/profile" className="block">
            <div className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <img
                  src={profileImage}
                  alt={userName}
                  className="w-14 h-14 rounded-full border-2 border-purple-500 p-0.5"
                  onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <div className="py-2">
            {/* Learning Section */}
            <MenuItem 
              to="/student/list-my-course" 
              icon={BookOpen} 
              label="Học tập" 
            />
            
            {/* Cart Section */}
            <MenuItem 
              to="/student/cart" 
              icon={ShoppingCart} 
              label="Giỏ hàng của tôi" 
              badge="1"
              onClick={() => navigate("/student/cart")}
            />
            
            {/* Wishlist Section */}
            <MenuItem 
              to="/student/wishlist" 
              icon={Heart} 
              label="Mong muốn" 
            />

            {/* Reminder Section */}
            <MenuItem 
              to="/student/reminder" 
              icon={AlarmClock} 
              label="Nhắc nhở" 
            />

            <div className="border-t border-gray-100 my-2" />

            {/* Settings Section */}
            <div className="px-4 py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <Globe className="w-4 h-4 mr-3 text-gray-500" />
                <span>Ngôn ngữ</span>
              </div>
              <span className="text-gray-900 font-medium">Tiếng Việt</span>
            </div>

            <MenuItem 
              to="/student/profile" 
              icon={UserCircle} 
              label="Hồ sơ công khai" 
            />
            
            <MenuItem 
              to="/student/profile" 
              icon={Settings} 
              label="Chỉnh sửa hồ sơ" 
            />

            <div className="border-t border-gray-100 my-2" />

            {/* Logout */}
            <MenuItem 
              to="#" 
              icon={LogOut} 
              label="Đăng xuất" 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;