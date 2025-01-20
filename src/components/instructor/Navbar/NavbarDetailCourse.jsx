import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Tham chiếu tới menu
  const nav = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Đóng menu khi chọn mục
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Chuyển đổi khi cuộn hơn 100px
    };

    const handleClickOutside = (event) => {
      // Đóng menu nếu click ngoài vùng menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!isScrolled ? (
        <nav className="bg-gray-800 p-4 z-10 top-0 left-0 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div
              className="text-white font-bold text-lg cursor-pointer hover:underline"
              onClick={() => nav(-1)}
            >
              Go Back
            </div>
            <ul className="flex space-x-6">
              <li
                className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => scrollTo("course-details")}
              >
                Course Details
              </li>
              <li
                className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => scrollTo("description")}
              >
                Description
              </li>
              <li
                className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => scrollTo("free-lectures")}
              >
                Free Lectures
              </li>
              <li
                className="text-white hover:text-gray-400 cursor-pointer"
                onClick={() => scrollTo("sections-lectures")}
              >
                Sections
              </li>
            </ul>
          </div>
        </nav>
      ) : (
        <div className="fixed bottom-4 right-4 z-20">
          <div
            className="w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </div>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 bottom-16 bg-white shadow-lg rounded-lg p-4 space-y-4"
            >
              <button
                className="block w-full text-left text-gray-800 hover:text-gray-600"
                onClick={() => scrollTo("course-details")}
              >
                Course Details
              </button>
              <button
                className="block w-full text-left text-gray-800 hover:text-gray-600"
                onClick={() => scrollTo("description")}
              >
                Description
              </button>
              <button
                className="block w-full text-left text-gray-800 hover:text-gray-600"
                onClick={() => scrollTo("free-lectures")}
              >
                Free Lectures
              </button>
              <button
                className="block w-full text-left text-gray-800 hover:text-gray-600"
                onClick={() => scrollTo("sections-lectures")}
              >
                Sections
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavBar;