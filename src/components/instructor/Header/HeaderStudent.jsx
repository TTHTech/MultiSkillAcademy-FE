import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-100 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        {/* Logo and Categories */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <img
              src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
              alt="Udemy Logo"
              className="h-8"
            />
          </div>
          <span className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 transition duration-200">
            Thể loại
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-full shadow-inner px-4 py-2 w-96">
          <input
            type="text"
            placeholder="Tìm kiếm nội dung bất kỳ"
            className="bg-transparent outline-none w-full text-gray-600 placeholder-gray-500"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.414l-4.387-4.386zm-1.4-6.32a6 6 0 100 12 6 6 0 000-12z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Right section: Buttons and Options */}
        <div className="flex items-center space-x-6">
          <span className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 transition duration-200">
            Udemy Business
          </span>
          <span className="text-gray-700 font-medium cursor-pointer hover:text-gray-900 transition duration-200">
            Giảng dạy trên Udemy
          </span>

          <button className="px-4 py-2 border border-gray-700 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200">
            Đăng nhập
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-900 transition duration-200">
            Đăng ký
          </button>

          <button className="text-gray-700 hover:text-gray-900 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
