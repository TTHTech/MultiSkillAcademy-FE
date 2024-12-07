import React from "react";
import { FaBook, FaExclamationTriangle } from "react-icons/fa";

const CourseContentDetails = ({ contentDetails }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Nội dung Bài Học</h2>

      {/* Kiểm tra và hiển thị nội dung khóa học */}
      {contentDetails && contentDetails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contentDetails.map((content, index) => (
            <div
              key={index}
              className="text-gray-800 border border-gray-300 p-4 rounded-lg hover:shadow-lg hover:border-gray-500 flex items-center space-x-3"
            >
              <FaBook className="text-blue-600" />
              <p>{content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center text-gray-600">
          <FaExclamationTriangle className="text-yellow-500 mr-2" />
          <p>Không có nội dung khóa học để hiển thị.</p>
        </div>
      )}
    </div>
  );
};

export default CourseContentDetails;
