import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150'; // Default profile image if none is provided

const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('https://educoresystem-1.onrender.com/api/student/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        // Update user data
        const { profileImageUrl, firstName, lastName, email } = response.data;
        setProfileImage(profileImageUrl || DEFAULT_PROFILE_IMAGE);
        setUserName(`${firstName} ${lastName}`);
        setUserEmail(email);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Helper to delay menu close
  let closeMenuTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeMenuTimeout); // Cancel any pending close operations
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeMenuTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // Add a slight delay (300ms) to close the menu
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* User Avatar */}
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
          </div>
          <hr className="my-2" />

          {/* Menu Items */}
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Học tập</a>
          <div className="relative block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center">
            <span>Giỏ hàng của tôi</span>
            <span className="ml-auto bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">1</span>
          </div>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mong muốn</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Bảng điều khiển của giảng viên</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Thông báo</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tin nhắn</a>

          <hr className="my-2" />

          {/* Account Settings */}
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Cài đặt tài khoản</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Phương thức thanh toán</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Thuê bao</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Ưu đãi Udemy</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Lịch sử mua</a>

          <hr className="my-2" />

          {/* Language and Public Profile */}
          <div className="flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
            <span>Ngôn ngữ</span>
            <span className="font-semibold">Tiếng Việt <i className="fas fa-globe"></i></span>
          </div>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Hồ sơ công khai</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Chỉnh sửa hồ sơ</a>
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Trợ giúp và Hỗ trợ</a>

          <hr className="my-2" />

          {/* Sign Out */}
          <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Đăng xuất</a>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
