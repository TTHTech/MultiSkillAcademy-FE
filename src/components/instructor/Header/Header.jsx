import { Link } from 'react-router-dom';
import LogoIcon from '../../../images/logo/logo-icon.svg';
import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full bg-gray-300 shadow-md dark:bg-gray-800 dark:shadow-none">
      <div className="flex items-center flex-grow px-4 py-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={LogoIcon} alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Search Form */}
        <div className="hidden sm:block flex-grow mx-4">
          <form
            action="https://formbold.com/s/unique_form_id"
            method="POST"
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Type to search..."
              className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute left-0 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Additional Items */}
        <div className="flex items-center gap-4">
          {/* Notifications Icon */}
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3C10.3431 3 9 4.34315 9 6V7.00432C5.89318 7.52151 3.66667 10.2125 3.66667 13.5V17C3.66667 18.1046 4.56117 19 5.66667 19H6.97367C7.40033 20.3133 8.54489 21 9.83333 21H14.1667C15.4551 21 16.5997 20.3133 17.0263 19H18.3333C19.4388 19 20.3333 18.1046 20.3333 17V13.5C20.3333 10.2125 18.1068 7.52151 15 7.00432V6C15 4.34315 13.6569 3 12 3Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* User Profile Icon */}
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M12 14C9.23829 14 7 16.2383 7 19V21H17V19C17 16.2383 14.7617 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Additional Navigation Items */}
          <ul className="flex items-center gap-4">
            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">About</Link></li>
            <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;