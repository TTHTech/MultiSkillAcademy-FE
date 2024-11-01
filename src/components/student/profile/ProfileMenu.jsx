// src/components/student/ProfileMenu.jsx
import React, { useState, useRef } from 'react';

const ProfileMenu = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseOver = () => {
    clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseOut = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 1000);
  };

  return (
    <div 
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      className="relative"
    >
      <img
        src="https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6" // Replace with correct avatar URL
        alt="User Avatar"
        className="w-12 h-12 rounded-full cursor-pointer"
      />
      
      {isMenuOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg py-4 rounded-md z-10"
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <div className="px-4 py-2 flex items-center">
            <img
              src="https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6" // Replace with correct avatar URL
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-bold text-gray-900">Hoài</p>
              <p className="text-sm text-gray-500">tthoai2401.learn@gmail.com</p>
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
