import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';

const DEFAULT_PROFILE_IMAGE = "https://lh3.googleusercontent.com/IUCQIQksFr7qJDlXK43uhIUwvDt_tpLSNiumv8bFESGLs6wekNyBDdNMyzeFwqgTe-l5vG6RSMvnUek=w544-h544-l90-rj";

const WelcomeSection = () => {
  const [profileData, setProfileData] = useState({
    profileImage: DEFAULT_PROFILE_IMAGE,
    lastName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('Vui lòng đăng nhập để tiếp tục');
        }

        const response = await fetch(
          `http://localhost:8080/api/student/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Không thể tải thông tin người dùng');
        }

        const data = await response.json();
        setProfileData({
          profileImage: data.profileImage || DEFAULT_PROFILE_IMAGE,
          lastName: data.lastName || 'Người dùng'
        });
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-[50px]">
        <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-yellow-50 to-purple-100 shadow-lg rounded-lg my-6 max-w-[1500px] w-full">
          <div className="animate-pulse flex space-x-6">
            <div className="rounded-full bg-slate-200 h-20 w-20"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-6 bg-slate-200 rounded w-[200px]"></div>
              <div className="h-4 bg-slate-200 rounded w-[150px]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-[50px]">
        <div className="flex items-center space-x-6 p-6 bg-red-50 shadow-lg rounded-lg my-6 max-w-[1500px] w-full">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-[50px]">
      <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-yellow-50 to-purple-100 shadow-lg rounded-lg my-6 max-w-[1500px] w-full">
        {/* Avatar with Link */}
        <a 
          href="/student/profile"
          className="block relative group"
        >
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt="User Avatar"
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md transition-all duration-300 group-hover:border-blue-300 group-hover:shadow-lg"
              onError={(e) => {
                e.target.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
              <UserCircle className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </a>

        {/* Welcome Text */}
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            Chào mừng {profileData.lastName} trở lại!
          </h3>
          <a
            href="/student/profile"
            className="text-blue-600 text-sm hover:text-blue-800 transition-colors duration-300 mt-1 inline-flex items-center group"
          >
            <span>Thêm nghề nghiệp và sở thích</span>
            <svg 
              className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;