import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150'; // Default profile image if none is provided

const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Lấy userId từ localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No userId found');
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/student/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token vào header Authorization
          },
        });

        // Cập nhật dữ liệu người dùng
        const { profileImageUrl, firstName, lastName, email } = response.data;
        setProfileImage(profileImageUrl || DEFAULT_PROFILE_IMAGE);
        setUserName(`${firstName} ${lastName}`);
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserProfile();
  }, []); // Run only once when the component is rendered

  // Helper to delay menu closing
  let closeMenuTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeMenuTimeout); // Clear any existing close menu timeout
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeMenuTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // Adding a slight delay before closing the menu
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar and User Info */}
      <img
        src={profileImage}
        alt="User Avatar"
        className="w-12 h-12 rounded-full cursor-pointer"
        onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)} // Fallback if image fails to load
      />

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg py-4 rounded-md z-10">
          {/* Profile Header */}
          <div className="px-4 py-2 flex items-center">
            <Link to="/student/profile">
              <img
                src={profileImage}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
                onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)} // Fallback if image fails to load
              />
              <div>
                <p className="font-bold text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </Link>
          </div>
          <hr className="my-2" />

          {/* Menu Items */}
          <Link to="/study" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Học tập</Link>
          <div className="relative block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
            <span>Giỏ hàng của tôi</span>
            <span className="ml-auto bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">1</span>
          </div>
          <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mong muốn</Link>
          <Link to="/instructor-dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Bảng điều khiển của giảng viên</Link>
          <Link to="/notifications" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Thông báo</Link>
          <Link to="/messages" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tin nhắn</Link>

          <hr className="my-2" />

          {/* Account Settings */}
          <Link to="/account-settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cài đặt tài khoản</Link>
          <Link to="/payment-methods" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Phương thức thanh toán</Link>
          <Link to="/subscriptions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Thuê bao</Link>
          <Link to="/udemy-discounts" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Ưu đãi Udemy</Link>
          <Link to="/purchase-history" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Lịch sử mua</Link>

          <hr className="my-2" />

          {/* Language and Public Profile */}
          <div className="flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
            <span>Ngôn ngữ</span>
            <span className="font-semibold">Tiếng Việt <i className="fas fa-globe"></i></span>
          </div>
          <Link to="/public-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hồ sơ công khai</Link>
          <Link to="/edit-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Chỉnh sửa hồ sơ</Link>
          <Link to="/help" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Trợ giúp và Hỗ trợ</Link>

          <hr className="my-2" />

          {/* Sign Out */}
          <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng xuất</Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
