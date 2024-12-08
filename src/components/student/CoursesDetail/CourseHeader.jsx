import React from 'react';
import { FaStar, FaUser } from 'react-icons/fa';

const CourseHeader = ({ title, description, instructor, rating, studentCount, lastUpdated }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-4xl font-extrabold mb-2 text-white hover:text-yellow-300 transition-all">{title}</h1>
      <p className="text-lg text-gray-300 mb-4 italic">{description}</p>
      
      <div className="flex items-center text-gray-400 text-lg space-x-6">
        {/* Giảng viên */}
        <span className="flex items-center hover:text-yellow-400 transition-all">
          <strong className="mr-2 text-white">Giảng viên:</strong>
          <span className="text-white font-semibold">{instructor}</span>
        </span>

        {/* Xếp hạng */}
        <span className="flex items-center text-yellow-400 hover:text-yellow-500 transition-all">
          <FaStar className="mr-1 text-yellow-400" />
          <span className="font-bold">{rating} ★</span>
        </span>

        {/* Số học viên */}
        <span className="flex items-center">
          <FaUser className="mr-2 text-gray-300" />
          <span>{studentCount} học viên</span>
        </span>
      </div>

      {/* Thêm thông tin về ngày cập nhật */}
    </div>
  );
};

export default CourseHeader;
