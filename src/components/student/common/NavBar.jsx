import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfileMenu from '../../../components/student/profile/ProfileMenu';

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]); // State lưu danh mục
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://educoresystem-1.onrender.com/api/student/categories'); // API endpoint
        console.log('Danh mục:', response.data); // Debug xem API trả về gì
        setCategories(response.data); // Cập nhật danh sách danh mục
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
      }
    };
    fetchCategories();
  }, []);

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
          onMouseLeave={handleMouseOut}    // Bắt đầu thời gian chờ đóng menu khi rời khỏi nút "Thể loại"
        >
          <Link to="/student/home"> {/* Bọc logo bằng Link để trở về trang chủ */}
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
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
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <a 
                      key={index} 
                      href={`/category/${category.categoryId}`} 
                      className="text-gray-700 hover:text-black py-1 px-2 block"
                    >
                      {category}
                    </a>
                  ))
                ) : (
                  <div className="text-gray-500 px-4">Không có danh mục</div>
                )}
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
    
          <a href="/student/list-my-course" className="text-gray-600 hover:text-black">Học tập</a>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <Link to="/student/cart" className="text-gray-600 hover:text-black">
              <i className="fas fa-shopping-cart text-xl"></i>
            </Link>
            <a href="/" className="text-gray-600 hover:text-black">
              <i className="fas fa-bell text-xl"></i>
            </a>
            <a href="/student/course-view" className="text-gray-600 hover:text-black">
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
          {categories.slice(0, 6).map((category, index) => (
            <a 
              key={index} 
              href={`/category/${index}`} 
              className="text-gray-700 hover:text-black"
            >
              {category}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
