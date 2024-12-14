import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfileMenu from "../../../components/student/profile/ProfileMenu";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]); // State lưu danh mục
  const [searchQuery, setSearchQuery] = useState(""); // State lưu giá trị tìm kiếm
  const [searchResults, setSearchResults] = useState([]); // State lưu kết quả tìm kiếm
  const timeoutRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/student/categories"
        ); // API endpoint
        console.log("Danh mục:", response.data); // Debug xem API trả về gì
        setCategories(response.data); // Cập nhật danh sách danh mục
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) return;

        const response = await axios.get(
          "http://localhost:8080/api/student/cart/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCartItemCount(response.data); // Cập nhật số lượng sản phẩm
      } catch (error) {
        console.error("Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:", error);
      }
    };

    fetchCartItemCount();
  }, []); // Chạy khi component được render lần đầu

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query as user types
  };

  // Handle search form submission
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập tên khóa học");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/student/courses/search`,
        {
          params: {
            query: searchQuery,
          },
        }
      );

      setSearchResults(response.data); // Cập nhật kết quả tìm kiếm
    } catch (error) {
      console.error("Lỗi khi tìm kiếm khóa học:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo và Thể loại */}
        <div
          className="flex items-center space-x-4 relative"
          onMouseEnter={handleMouseOver} // Hiển thị menu khi di chuột vào nút "Thể loại"
          onMouseLeave={handleMouseOut} // Bắt đầu thời gian chờ đóng menu khi rời khỏi nút "Thể loại"
        >
          <Link to="/student/home">
            {" "}
            {/* Bọc logo bằng Link để trở về trang chủ */}
            <img
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
              alt="Logo"
              className="w-16"
            />
          </Link>
          <button className="text-gray-600 text-lg font-semibold focus:outline-none">
            Thể loại
          </button>

          {/* Dropdown menu khi di chuột */}
          {isMenuOpen && (
            <div
              className="absolute top-full left-0 w-64 bg-white shadow-lg py-4 mt-2 rounded-md z-10"
              onMouseEnter={handleMouseOver} // Giữ menu mở khi di chuột vào menu
              onMouseLeave={handleMouseOut} // Bắt đầu thời gian chờ đóng menu khi rời khỏi menu
            >
              <div className="grid grid-cols-1 gap-2 px-4">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.categoryId}`} // Pass categoryId to URL
                      className="text-gray-700 hover:text-black py-1 px-2 block"
                    >
                      {category.name} {/* Ensure you display the name */}
                    </Link>
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
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học"
                className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring focus:ring-gray-300"
                value={searchQuery}
                onChange={handleSearchChange} // Lắng nghe thay đổi input
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <i className="fas fa-search text-gray-400"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-6">
          <a
            href="/student/list-my-course"
            className="text-gray-600 hover:text-black"
          >
            Học tập
          </a>

          {/* Icons */}
          <div className="flex items-center space-x-6">
          <Link to="/student/cart" className="relative text-gray-600 hover:text-black">
          <i className="fas fa-shopping-cart text-xl"></i>
          {cartItemCount > 0 && (
            <span
              className="absolute top-[-10px] right-[-10px] bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {cartItemCount}
            </span>
          )}
        </Link>
        
            <a
              href="/student/wishlist"
              className="text-gray-600 hover:text-black"
            >
              <i className="fas fa-heart text-xl"></i>
            </a>
            {/* Profile Menu Component */}
            <ProfileMenu /> {/* Use ProfileMenu component here */}
          </div>
        </div>
      </div>

      {/* Dàn đều các categories phía dưới (1 hàng) */}
      <div className="bg-white py-2 border-t border-b border-gray-300 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 flex justify-between space-x-4">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.categoryId}`} // Pass categoryId to the Category page
              className="text-gray-700 hover:text-black"
            >
              {category.name} {/* Ensure you display the name */}
            </Link>
          ))}
        </div>
      </div>

      {/* Kết quả tìm kiếm */}
      {searchResults.length > 0 && (
        <div className="bg-white py-4">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Kết quả tìm kiếm:
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.map((course, index) => (
                <Link
                  key={index}
                  to={`/course/${course.courseId}`} // Thêm đường dẫn tới khóa học
                  className="text-gray-700 hover:text-black py-1 px-2 block"
                >
                  {course.name} {/* Hiển thị tên khóa học */}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
