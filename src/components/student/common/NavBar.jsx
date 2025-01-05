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
  const [notificationCount, setNotificationCount] = useState(5); // Giả định số thông báo
  const navigate = useNavigate();

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

  const handleMouseOver = () => {
    clearTimeout(timeoutRef.current);
    setMenuOpen(true);
  };

  const handleMouseOut = () => {
    timeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 1000);
  };

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
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    navigate(`/search?query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-lg backdrop-blur-sm z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo and Categories */}
        <div
          className="flex items-center space-x-6 relative"
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <Link to="/student/home" className="transform hover:scale-105 transition-all duration-300">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
              alt="Logo"
              className="w-16"
            />
          </Link>
          <button className="text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors duration-300 flex items-center gap-2">
            <span>Thể loại</span>
            <i className="fas fa-chevron-down text-sm transition-transform duration-300"></i>
          </button>

          {isMenuOpen && (
            <div
              className="absolute top-full left-0 w-72 bg-white shadow-xl rounded-xl py-4 mt-4 transform transition-all duration-300 border border-gray-100"
              onMouseEnter={handleMouseOver}
              onMouseLeave={handleMouseOut}
            >
              <div className="grid grid-cols-1 gap-1">
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Link
                      key={index}
                      to={`/category/${category.categoryId}`}
                      className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-6 transition-all duration-200 flex items-center gap-2 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{category.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-500 px-6 py-2">Không có danh mục</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="w-full px-6 py-3 text-gray-700 bg-white/90 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:shadow-lg transition-all duration-300 group"
              >
                <i className="fas fa-search text-lg group-hover:scale-110 transition-transform duration-300"></i>
              </button>

              {loadingSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 p-4 border border-gray-100">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-500">Đang tải...</span>
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto border border-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-6 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 text-gray-700 hover:text-blue-600"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center gap-2">
                        <i className="fas fa-search text-gray-400"></i>
                        <span>{suggestion}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {suggestionsError && !loadingSuggestions && (
                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 p-4 text-gray-500 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-500"></i>
                    <span>Không có gợi ý nào phù hợp</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Cart, Notifications, Chat, and Profile */}
        <div className="flex items-center space-x-8">
          {/* Learning Section */}
          <a
            href="/student/list-my-course"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <i className="fas fa-book text-xl group-hover:scale-110 transition-transform duration-300"></i>
            <span className="hidden sm:inline font-medium">Học tập</span>
          </a>

          {/* Cart Section */}
          <Link
            to="/student/cart"
            className="relative text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <i className="fas fa-shopping-cart text-xl group-hover:scale-110 transition-transform duration-300"></i>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Wishlist Section */}
          <a
            href="/student/wishlist"
            className="text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <i className="fas fa-heart text-xl group-hover:scale-110 transition-transform duration-300"></i>
          </a>

          {/* Notifications Section */}
          <Link
            to="/student/notifications"
            className="relative text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <i className="fas fa-bell text-xl group-hover:scale-110 transition-transform duration-300"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {notificationCount}
              </span>
            )}
          </Link>

          {/* Chat Section */}
          <Link
            to="/student/chat"
            className="text-gray-600 hover:text-blue-600 transition-all duration-300 group"
          >
            <i className="fas fa-comments text-xl group-hover:scale-110 transition-transform duration-300"></i>
          </Link>

          {/* Profile Menu */}
          <div className="ml-2">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
