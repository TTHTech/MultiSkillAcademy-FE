import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://th.bing.com/th/id/OIP.t9Wb7K5Kp5iVn5IHLZS5HwHaH_?rs=1&pid=ImgDetMain"; // Default image if not found

const WelcomeSection = () => {
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.error("No token or userId found");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/student/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { profileImage, lastName } = response.data;

        setProfileImage(profileImage || DEFAULT_PROFILE_IMAGE);
        setLastName(lastName || "Người dùng");
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex justify-center mt-[50px]">
      <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-yellow-50 to-purple-100 shadow-lg rounded-lg my-6 max-w-[1500px] w-full">
        {/* Avatar with Link */}
        <Link to="/student/profile">
          <img
            src={profileImage}
            alt="User Avatar"
            className="h-20 w-20 rounded-full object-cover border-4 border-blue-300 shadow-lg hover:scale-105 transition-transform"
            onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)}
          />
        </Link>

        {/* Welcome Text */}
        <div>
          <h3 className="text-3xl font-bold text-blue-900">
            Chào mừng {lastName ? lastName : "Người dùng"} trở lại!
          </h3>
          <Link
            to="/student/profile"
            className="text-blue-600 underline text-sm hover:text-blue-800"
          >
            Thêm nghề nghiệp và sở thích
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
