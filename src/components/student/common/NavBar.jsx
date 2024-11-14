import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfileMenu from '../../../components/student/profile/ProfileMenu';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseOver = () => {
    clearTimeout(timeoutRef.current); // Hủy bỏ thời gian chờ đóng menu nếu có
    setMenuOpen(true); // Hiển thị menu
  };

  const handleMouseOut = () => {
    // Đặt thời gian chờ 1 giây để đóng menu
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false); // Đóng menu nếu không di chuột lại vào menu hoặc nút "Thể loại"
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo và Thể loại */}
        <div 
          className="flex items-center space-x-4 relative"
          onMouseEnter={handleMouseOver}   // Hiển thị menu khi di chuột vào nút "Thể loại"
          onMouseLeave={handleMouseOut}     // Bắt đầu thời gian chờ đóng menu khi rời khỏi nút "Thể loại"
        >
          <Link to="/student/home"> {/* Bọc logo bằng Link để trở về trang chủ */}
            <img 
              src="https://www.businessoutreach.in/wp-content/uploads/2023/11/Business-and-Revenue-Model-of-Canva.webp" 
              alt="Logo" 
              className="w-16"
            />
          </Link>
          <button 
            className="text-gray-600 text-lg font-semibold focus:outline-none"
          >
            Thể loại
          </button>

          {/* Dropdown menu khi di chuột */}
          {isMenuOpen && (
            <div 
              className="absolute top-full left-0 w-64 bg-white shadow-lg py-4 mt-2 rounded-md z-10"
              onMouseEnter={handleMouseOver}   // Giữ menu mở khi di chuột vào menu
              onMouseLeave={handleMouseOut}    // Bắt đầu thời gian chờ đóng menu khi rời khỏi menu
            >
              <div className="grid grid-cols-1 gap-2 px-4">
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Phát triển</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Kinh doanh</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Tài chính & Kế toán</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">CNTT & Phần mềm</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Năng suất văn phòng</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Phát triển cá nhân</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Thiết kế</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Marketing</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Phong cách sống</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Nhiếp ảnh & Video</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Sức khỏe & Thể dục</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Âm nhạc</a>
                <a href="/" className="text-gray-700 hover:text-black py-1 px-2 block">Giảng dạy & Học thuật</a>
              </div>
            </div>
          )}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-grow mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nội dung bất kỳ"
              className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring focus:ring-gray-300"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <i className="fas fa-search text-gray-400"></i>
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-6">
    
          <a href="/student/my-courses" className="text-gray-600 hover:text-black">Học tập</a>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/student/cart" className="text-gray-600 hover:text-black">
              <i className="fas fa-shopping-cart text-xl"></i>
            </Link>
            <a href="/" className="text-gray-600 hover:text-black">
              <i className="fas fa-bell text-xl"></i>
            </a>
            <a href="/" className="text-gray-600 hover:text-black">
              <i className="fas fa-heart text-xl"></i>
            </a>

            {/* Profile Menu Component */}
            <ProfileMenu />  {/* Use ProfileMenu component here */}
          </div>
        </div>
      </div>

      {/* Dàn đều các categories phía dưới (1 hàng) */}
      <div className="bg-white py-2 border-t border-b border-gray-300 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 flex justify-between space-x-4">
          <a href="/" className="text-gray-700 hover:text-black">Phát triển</a>
          <a href="/" className="text-gray-700 hover:text-black">Phát triển ứng dụng di động</a>
          <a href="/" className="text-gray-700 hover:text-black">Ngôn ngữ lập trình</a>
          <a href="/" className="text-gray-700 hover:text-black">Phát triển trò chơi</a>
          <a href="/" className="text-gray-700 hover:text-black">Thiết kế & Phát triển cơ sở dữ liệu</a>
          <a href="/" className="text-gray-700 hover:text-black">Kiểm tra phần mềm</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;