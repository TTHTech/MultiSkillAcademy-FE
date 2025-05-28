import React from "react";
import {
  FaStar,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaPlayCircle,
  FaCertificate,
  FaUserGraduate,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const StatItem = ({ icon: Icon, label, value, color = "text-gray-300" }) => (
  <div
    className={`flex items-center gap-2 ${color} hover:text-yellow-400 transition-colors duration-300 group`}
  >
    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
      <Icon className="text-lg" />
    </div>
    {label && <span className="text-gray-400 mr-1">{label}</span>}
    <span className="font-medium">{value}</span>
  </div>
);

const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return <FaStar key={index} className="text-yellow-400 w-4 h-4" />;
        } else if (index === fullStars && hasHalfStar) {
          return (
            <div key={index} className="relative w-4 h-4">
              <FaStar className="absolute text-gray-600 w-4 h-4" />
              <div className="absolute overflow-hidden w-[50%]">
                <FaStar className="text-yellow-400 w-4 h-4" />
              </div>
            </div>
          );
        } else {
          return <FaStar key={index} className="text-gray-600 w-4 h-4" />;
        }
      })}
      <span className="ml-2 font-medium text-yellow-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

const InstructorAvatar = ({ instructor }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <Link to={`/student/profile-instructor/${instructor.id}`}>
        <img
          src={
            instructor.image ||
            "https://i1.sndcdn.com/artworks-9IsXLBkEVnMfN6qy-vlBoxg-t500x500.jpg"
          }
          alt={instructor.name}
          className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
        />
        {instructor.verified && (
          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-md">
            Top Mentor
          </div>
        )}
      </Link>
    </div>
    <div>
      <Link to={`/student/profile-instructor/${instructor.id}`}>
        <div className="text-gray-400 text-sm">Giảng viên</div>
        <div className="text-white font-medium">{instructor.name}</div>
        {/* {instructor.title && (
        <div className="text-gray-400 text-sm">{instructor.title}</div>
      )} */}
      </Link>
    </div>
  </div>
);

const CourseHeader = ({
  title,
  description,
  instructor,
  rating,
  studentCount,
  lastUpdated,
  duration,
  lectureCount,
  certificateType = "Chứng chỉ hoàn thành",
}) => {
  const isBestseller = studentCount > 350;
  const threeMonthsMs = 1000 * 60 * 60 * 24 * 90;
  const isNew = Date.now() - new Date(lastUpdated).getTime() <= threeMonthsMs;

  return (
    <div className="relative mt-[65px]">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-md opacity-95" />

      <div className="relative px-8 py-12 rounded-md overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 mb-6">
            {isBestseller && (
              <Link to="/courses/hot">
                <span className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition">
                  Bestseller
                </span>
              </Link>
            )}

            {isNew ? (
              <Link to="/courses/newest">
                <span className="px-3 py-1 rounded-md bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 transition">
                  Mới
                </span>
              </Link>
            ) : (
              <span className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-sm font-medium">
                Đã cập nhật
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
            {description}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <InstructorAvatar instructor={instructor} />
            <div className="w-px h-12 bg-gray-700" />
            <div>
              <RatingStars rating={rating} />
              <div className="text-gray-400 text-sm mt-1">
                Đánh giá của học viên
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem
              icon={FaUserGraduate}
              value={`${studentCount.toLocaleString()} Học viên`}
            />
            <StatItem icon={FaPlayCircle} value={lectureCount + " Bài giảng"} />
            <StatItem icon={FaClock} value={duration} />
            <StatItem
              icon={FaCertificate}
              value={certificateType}
              color="text-yellow-400"
            />
          </div>

          <div className="mt-8 flex items-center gap-2 text-gray-400 text-sm">
            <FaCalendarAlt className="text-gray-500" />
            Cập nhật lần cuối:{" "}
            {new Date(lastUpdated)
              .toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, "/")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
