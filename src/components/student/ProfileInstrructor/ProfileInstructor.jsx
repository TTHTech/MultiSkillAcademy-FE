import { useEffect, useState } from "react";
import axios from "axios";
import CoursesInstructor from "./CoursesInstructor";

const InstructorProfile = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8080/api/student/profile-instructor/${id}`)
      .then((response) => {
        setProfile(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching instructor profile:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading || !profile) {
    return (
      <div className="py-12 max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto mt-3"></div>
              <div className="flex justify-center space-x-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:ml-6 flex-1">
              <div className="h-7 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const truncateTextToLines = (text, maxWordsPerLine) => {
    const words = text.split(" ");
    const lines = [];
    for (let i = 0; i < words.length; i += maxWordsPerLine) {
      lines.push(words.slice(i, i + maxWordsPerLine).join(" "));
    }
    return lines;
  };
  
  const bioText =
    profile.bio && profile.bio.trim() !== ""
      ? profile.bio
      : "Giảng viên chưa cập nhật thông tin giới thiệu bản thân";

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
          {/* Left column - Profile photo and info */}
          <div className="w-full md:w-1/3 text-center">
            <div className="relative w-48 h-48 mx-auto group overflow-hidden">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-lg object-cover transition-all duration-500 transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center bg-blue-50">
                  <i className="fas fa-user-tie text-blue-300 text-6xl"></i>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-transparent h-16 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            
            <h1 className="mt-6 text-3xl font-extrabold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
              {`${profile.firstName} ${profile.lastName}`}
            </h1>
            
            <p className="mt-2 text-lg text-gray-600 font-medium">
              {profile.title || "Giảng viên"}
            </p>
            
            {/* Social Media Links with improved styling */}
            <div className="mt-6 flex justify-center space-x-5">
              {[
                { url: profile.websiteUrl, icon: "fas fa-globe", color: "text-blue-500 hover:text-blue-700", hoverBg: "hover:bg-blue-50" },
                { url: profile.facebookUrl, icon: "fab fa-facebook-square", color: "text-blue-600 hover:text-blue-800", hoverBg: "hover:bg-blue-50" },
                { url: profile.tiktokUrl, icon: "fab fa-tiktok", color: "text-black hover:text-gray-700", hoverBg: "hover:bg-gray-50" },
                { url: profile.youtubeUrl, icon: "fab fa-youtube", color: "text-red-600 hover:text-red-800", hoverBg: "hover:bg-red-50" },
              ].map((link, index) => (
                link.url ? (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} ${link.hoverBg} text-2xl p-2 rounded-full transition-all duration-300 transform hover:scale-110`}
                  >
                    <i className={link.icon}></i>
                  </a>
                ) : (
                  <span
                    key={index}
                    className="text-gray-300 text-2xl p-2 cursor-not-allowed"
                  >
                    <i className={link.icon}></i>
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Right column - Bio and stats */}
          <div className="mt-10 md:mt-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">
              <i className="fas fa-user-circle mr-2 text-blue-500"></i>Giới thiệu về giảng viên
            </h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg shadow border border-blue-100 transition-all duration-300 hover:shadow-md">
              <div className="text-gray-700 leading-relaxed text-lg">
                {truncateTextToLines(bioText, 15).map((line, index) => (
                  <p key={index} className="mb-3">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Stats cards with improved design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { label: "Khóa học", value: profile.totalCourses, icon: "fas fa-book", color: "from-blue-500 to-indigo-600" },
                { label: "Học viên", value: profile.totalStudent, icon: "fas fa-user-graduate", color: "from-green-500 to-teal-600" },
                { label: "Đánh giá", value: profile.totalReview, icon: "fas fa-comment", color: "from-yellow-500 to-amber-600" },
                { label: "Đánh giá TB", value: profile.reviewRatings, icon: "fas fa-star", color: "from-orange-500 to-red-600" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center transition-all duration-300 hover:shadow-lg hover:border-blue-200 transform hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br ${item.color} text-white mb-2`}>
                    <i className={`${item.icon}`}></i>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Courses section with improved design */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 relative">
            <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 h-1 w-16 absolute -top-1 left-1/2 transform -translate-x-1/2"></span>
            <i className="fas fa-chalkboard-teacher mr-2 text-blue-500"></i>
            Khóa học của giảng viên
          </h2>
          <CoursesInstructor id={id} />
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;