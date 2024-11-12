import React from 'react';

const CourseHeader = ({ title, description, instructor, rating, studentCount, lastUpdated }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-4xl font-bold mb-2 text-white">{title}</h1>
      <p className="text-lg text-gray-300 mb-4">{description}</p>
      <div className="text-gray-400">
        <span className="mr-4 text-lg">
          Được tạo bởi <strong className="text-white">{instructor}</strong>
        </span>
        <span className="text-yellow-400 font-bold text-lg">{rating} ★</span>
        <span className="mx-2">|</span>
        <span className="text-lg">{studentCount} học viên</span>
        <p className="text-sm text-gray-500 mt-2">Cập nhật lần cuối: {lastUpdated}</p>
      </div>
    </div>
  );
};

export default CourseHeader;
