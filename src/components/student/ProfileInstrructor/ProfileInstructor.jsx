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

  // Nếu bio không có, hiển thị thông báo mặc định
  const bioText = profile.bio && profile.bio.trim() !== "" 
    ? profile.bio 
    : "Giảng viên chưa cập nhật thông tin giới thiệu bản thân";

  return (
    <div className="bg-white-100 py-10">
      <div className="flex flex-col md:flex-row items-start justify-between p-10 space-y-8 md:space-y-0">
        <div className="flex-shrink-0 text-center w-full md:w-1/3">
          <img
            src={profile.profileImage}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-48 h-48 rounded-full border border-gray-300 mx-auto"
          />
          <h1 className="text-3xl font-bold mt-4">{`${profile.firstName} ${profile.lastName}`}</h1>
          <p className="text-lg text-gray-600 mt-1">{profile.title}</p>
        </div>

        <div className="flex-1 md:pl-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Giới thiệu về giảng viên
          </h2>
          <div className="text-gray-600 mt-4 text-lg">
            {truncateTextToLines(bioText, 15).map((line, index) => (
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>

          {/* Statistics */}
          <div className="flex justify-between mt-8 space-x-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {profile.totalCourses.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Khóa học</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {profile.totalStudent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Học viên</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {profile.totalReview.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Đánh giá</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {profile.reviewRatings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-10 px-4 md:px-10 mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Khóa học của giảng viên
        </h2>
        <CoursesInstructor id={id} />
      </div>
    </div>
  );
};

export default InstructorProfile;
