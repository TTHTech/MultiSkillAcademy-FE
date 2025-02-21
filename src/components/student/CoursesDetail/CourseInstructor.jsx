import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FaStar,
  FaUsers,
  FaBookReader,
  FaChalkboardTeacher,
  FaLinkedin,
  FaGlobe,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
      <Icon className="text-gray-600" />
    </div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);
import { Link } from "react-router-dom";

const InstructorHeader = ({ instructor }) => (
  <div className="flex items-center gap-6">
    <div className="relative">
      <Link to={`/student/profile-instructor/${instructor.id}`}>
        <img
          src={
            instructor.image ||
            "https://i1.sndcdn.com/artworks-9IsXLBkEVnMfN6qy-vlBoxg-t500x500.jpg"
          }
          alt={instructor.name}
          className="w-24 h-24 rounded-2xl object-cover shadow-md"
        />
        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
          Top Mentor
        </div>
      </Link>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-1">
        <Link to={`/student/profile-instructor/${instructor.id}`}>
          <h3 className="text-2xl font-bold text-gray-900">
            {instructor.name}
          </h3>
        </Link>

        {instructor.verified && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
            Đã xác thực
          </span>
        )}
      </div>
      <p className="text-gray-600 font-medium mb-2">{instructor.title}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        {instructor.website && (
          <a
            href={instructor.website}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaGlobe />
            Website
          </a>
        )}
        {instructor.linkedin && (
          <a
            href={instructor.linkedin}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <FaLinkedin />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  </div>
);

const InstructorStats = ({ instructor }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard
      icon={FaStar}
      label="Đánh giá"
      value={`${instructor.rating} / 5.0`}
    />
    <StatCard
      icon={FaUsers}
      label="Học viên"
      value={instructor.students.toLocaleString()}
    />
    <StatCard icon={FaBookReader} label="Khóa học" value={instructor.courses} />
    <StatCard
      icon={FaChalkboardTeacher}
      label="Đánh giá"
      value={instructor.reviews.toLocaleString()}
    />
  </div>
);

const CourseInstructor = ({ instructor }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-500">
            <FaChalkboardTeacher className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Thông tin giảng viên
          </h2>
        </div>

        <InstructorHeader instructor={instructor} />
      </div>

      <div className="p-6 border-b border-gray-100">
        <InstructorStats instructor={instructor} />
      </div>

      <div className="p-6">
        <div className="relative">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {isExpanded
              ? instructor.description
              : `${instructor.description.slice(0, 280)}...`}
          </p>

          {instructor.description.length > 280 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isExpanded ? (
                <>
                  Thu gọn <FaChevronUp className="text-sm" />
                </>
              ) : (
                <>
                  Xem thêm <FaChevronDown className="text-sm" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CourseInstructor.propTypes = {
  instructor: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    students: PropTypes.number.isRequired,
    courses: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    verified: PropTypes.bool,
    website: PropTypes.string,
    linkedin: PropTypes.string,
  }).isRequired,
};

export default CourseInstructor;
