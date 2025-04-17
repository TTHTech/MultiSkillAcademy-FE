import { useEffect, useState } from "react";
import axios from "axios";
import CoursesInstructor from "./CoursesInstructor";

const InstructorProfile = ({ id }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/student/profile-instructor/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("Error fetching instructor profile:", error);
      });
  }, [id]);

  if (!profile) {
    return <div className="text-center mt-20">Loading...</div>;
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
    <div className="py-12">
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
          <div className="w-full md:w-1/3 text-center">
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-48 h-48 rounded-full border-4 border-blue-500 shadow-md object-cover"
              />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              {`${profile.firstName} ${profile.lastName}`}
            </h1>
            <p className="mt-1 text-lg text-gray-600">{profile.title}</p>
            <div className="mt-4 flex justify-center space-x-4">
              {profile.websiteUrl ? (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-2xl"
                >
                  <i className="fas fa-globe"></i>
                </a>
              ) : (
                <span className="text-gray-300 text-2xl cursor-not-allowed">
                  <i className="fas fa-globe"></i>
                </span>
              )}

              {profile.facebookUrl ? (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-2xl"
                >
                  <i className="fab fa-facebook-square"></i>
                </a>
              ) : (
                <span className="text-gray-300 text-2xl cursor-not-allowed">
                  <i className="fab fa-facebook-square"></i>
                </span>
              )}

              {profile.tiktokUrl ? (
                <a
                  href={profile.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-700 text-2xl"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              ) : (
                <span className="text-gray-300 text-2xl cursor-not-allowed">
                  <i className="fab fa-tiktok"></i>
                </span>
              )}

              {profile.youtubeUrl ? (
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-800 text-2xl"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              ) : (
                <span className="text-gray-300 text-2xl cursor-not-allowed">
                  <i className="fab fa-youtube"></i>
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 md:mt-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              Giới thiệu về giảng viên
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner border border-gray-200">
              <div className="text-gray-700 leading-relaxed text-lg">
                {truncateTextToLines(bioText, 15).map((line, index) => (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { label: "Khóa học", value: profile.totalCourses },
                { label: "Học viên", value: profile.totalStudent },
                { label: "Đánh giá", value: profile.totalReview },
                { label: "Đánh giá trung bình", value: profile.reviewRatings },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center"
                >
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 p-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Khóa học của giảng viên
          </h2>
          <CoursesInstructor id={id} />
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
