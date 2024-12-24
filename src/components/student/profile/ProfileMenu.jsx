import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://cdn3.vectorstock.com/i/1000x1000/51/87/student-avatar-user-profile-icon-vector-47025187.jpg"; // Default profile image if none is provided

const ProfileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        // Lấy userId từ localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/student/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token vào header Authorization
            },
          }
        );

        // Cập nhật dữ liệu người dùng
        const { profileImage, firstName, lastName, email } = response.data;
        setProfileImage(profileImage || DEFAULT_PROFILE_IMAGE);
        setUserName(`${firstName} ${lastName}`);
        setUserEmail(email);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserProfile();
  }, []); // Run only once when the component is rendered

  // Helper to delay menu closing
  let closeMenuTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeMenuTimeout); // Clear any existing close menu timeout
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeMenuTimeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // Adding a slight delay before closing the menu
  };
  const clickCart = () => {
    navigate("/student/cart");
  };
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Avatar and User Info */}
      <div className="p-1 rounded-full border-4 border-blue-500">
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-12 h-12 rounded-full cursor-pointer"
          onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)}
        />
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg py-4 rounded-md z-10 ">
          {/* Profile Header */}
          <div className="px-4 py-2 flex items-center space-x-4 bg-white  rounded-lg">
            <Link
              to="/student/profile"
              className="flex items-center space-x-4  transition duration-200"
            >
              {/* Hình ảnh Avatar */}
              <img
                src={profileImage}
                alt="User Avatar"
                className="w-12 h-12 rounded-full border-2 border-blue-500 shadow-sm"
                onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)} // Fallback nếu ảnh không tải được
              />

              {/* Thông tin người dùng */}
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900 text-lg">
                  {userName}
                </p>
                <p className="text-sm text-gray-500">{userEmail}</p>
              </div>
            </Link>
          </div>

          <hr className="my-2" />

          {/* Menu Items */}
          <Link
            to="/student/list-my-course"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Học tập
          </Link>
          <div
            className="relative block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={clickCart}
          >
            <span>Giỏ hàng của tôi</span>
            <span className="ml-auto bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
              1
            </span>
          </div>
          <Link
            to="/student/wishlist"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Mong muốn
          </Link>

          {/* <Link
            to="/notifications"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Thông báo
          </Link> */}
          {/* <Link
            to="/messages"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Tin nhắn
          </Link> */}

          <hr className="my-2" />

          {/* Account Settings */}

          {/* Language and Public Profile */}
          <div className="flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
            <span>Ngôn ngữ</span>
            <span className="font-semibold">
              Tiếng Việt <i className="fas fa-globe"></i>
            </span>
          </div>
          <Link
            to="/student/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Hồ sơ công khai
          </Link>
          <Link
            to="/student/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Chỉnh sửa hồ sơ
          </Link>
          {/* <Link
            to="/help"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Trợ giúp và Hỗ trợ
          </Link> */}

          <hr className="my-2" />

          {/* Sign Out */}

          <Link
            to="/logout"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Đăng xuất
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
