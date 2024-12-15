import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfileMenu from "../../../components/student/profile/ProfileMenu";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/student/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch cart item count
  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:8080/api/student/cart/count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCartItemCount(response.data);
      } catch (error) {
        console.error("Error fetching cart item count:", error);
      }
    };

    fetchCartItemCount();
  }, []);

  // Handle category menu open/close
  const handleMouseOver = () => {
    clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseOut = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 1000);
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = debounce(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setSuggestionsError(false);
      return;
    }
    try {
      setLoadingSuggestions(true);
      const response = await axios.get(
        "http://localhost:8080/api/student/courses/suggestions",
        {
          params: { query },
        }
      );
      setSuggestions(response.data);
      setSuggestionsError(response.data.length === 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestionsError(true);
    } finally {
      setLoadingSuggestions(false);
    }
  }, 300);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    setSuggestions([]); // Ẩn danh sách gợi ý khi bấm Enter
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query); // Gọi hàm gợi ý
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Ẩn danh sách gợi ý khi chọn một mục
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-50 to-purple-100 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between ">
        {/* Logo and Categories */}
        <div
          className="flex items-center space-x-4 relative"
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <Link to="/student/home">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
              alt="Logo"
              className="w-16 hover:scale-110 transition-transform duration-300"
            />
          </Link>
          <button className="text-gray-600 text-lg font-semibold focus:outline-none hover:text-blue-500">
            Thể loại
          </button>

          {isMenuOpen && (
            <div
              className="absolute top-full left-0 w-64 bg-white shadow-lg py-4 mt-2 rounded-md z-10"
              onMouseEnter={handleMouseOver}
              onMouseLeave={handleMouseOut}
            >
              <div className="grid grid-cols-1 gap-2 px-4">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.categoryId}`}
                      className="text-gray-700 hover:text-blue-500 py-1 px-2 block transition duration-200"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-500 px-4">Không có danh mục</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-8">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học"
                className="w-full px-5 py-3 text-sm border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600 shadow-md transition"
              >
                <i className="fas fa-search text-lg"></i>
              </button>
              {loadingSuggestions && (
                <div className="absolute bg-white text-gray-500 px-4 py-2 rounded-md shadow-md left-0 w-full">
                  Đang tải...
                </div>
              )}
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border mt-2 rounded-lg shadow-md z-10 max-h-48 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-500 cursor-pointer transition duration-200"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              {suggestionsError && !loadingSuggestions && (
                <div className="px-4 py-2 text-gray-500">
                  Không có gợi ý nào phù hợp
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Cart and Profile */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6">
            {/* Learning Section */}
            <a
              href="/student/list-my-course"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition duration-200"
            >
              <i className="fas fa-book text-xl"></i>
              <span className="hidden sm:inline">Học tập</span>
            </a>

            {/* Cart Section */}
            <Link
              to="/student/cart"
              className="relative text-gray-600 hover:text-blue-500 transition duration-200 flex items-center"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Wishlist Section */}
            <a
              href="/student/wishlist"
              className="text-gray-600 hover:text-blue-500 transition duration-200 flex items-center"
            >
              <i className="fas fa-heart text-xl"></i>
            </a>
          </div>

          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
