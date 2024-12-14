import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link

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

        // Assuming response.data contains profileImageUrl and lastName
        const { profileImage, lastName } = response.data;

        setProfileImage(profileImage || DEFAULT_PROFILE_IMAGE);
        setLastName(lastName || "Người dùng"); // Default to 'User' if lastName is missing
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Fetch data when the component mounts

  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-4 p-6 bg-gray-50 shadow-md rounded-md my-6 max-w-[1500px] w-full">
        {/* Avatar */}
        <img
          src={profileImage}
          alt="User Avatar"
          className="h-16 w-16 rounded-full object-cover"
          onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)} // Fallback if image fails to load
        />

        {/* Welcome Text */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Chào mừng {lastName ? lastName : "Người dùng"} trở lại!
          </h3>
          <Link
            to="/student/profile"
            className="text-purple-600 underline text-sm"
          >
            Thêm nghề nghiệp và sở thích
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
