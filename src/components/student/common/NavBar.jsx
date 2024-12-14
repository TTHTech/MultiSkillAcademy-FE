import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProfileMenu from "../../../components/student/profile/ProfileMenu";

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);
  const [cartItemCount, setCartItemCount] = useState(0);
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

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/student/courses/suggestions",
          {
            params: { query },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions when the input is empty
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };
  
  
  
  
  

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion); // Set the clicked suggestion as the search query
    setSuggestions([]); // Clear suggestions
    navigate(`/search?query=${suggestion}`); // Navigate to the search results page
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center space-x-4 relative"
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <Link to="/student/home">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
              alt="Logo"
              className="w-16"
            />
          </Link>
          <button className="text-gray-600 text-lg font-semibold focus:outline-none">
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
                      className="text-gray-700 hover:text-black py-1 px-2 block"
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

        <div className="flex-grow mx-8">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học"
                className="w-full px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring focus:ring-gray-300"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <i className="fas fa-search text-gray-400"></i>
              </button>
              {suggestions.length > 0 && (
                <ul className="absolute bg-white border mt-2 rounded-md shadow-md z-10 max-h-40 overflow-y-auto w-full">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="/student/list-my-course"
            className="text-gray-600 hover:text-black"
          >
            Học tập
          </a>

          <div className="flex items-center space-x-6">
            <Link
              to="/student/cart"
              className="relative text-gray-600 hover:text-black"
            >
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
            <ProfileMenu />
          </div>
        </div>
      </div>

      <div className="bg-white py-2 border-t border-b border-gray-300 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 flex justify-between space-x-4">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={index}
              to={`/category/${category.categoryId}`}
              className="text-gray-700 hover:text-black"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
