import React from "react";

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
              className="text-gray-800 border border-gray-300 p-4 rounded-lg hover:shadow-lg hover:border-gray-500"
            >
              <p>{content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Không có nội dung khóa học để hiển thị.</p>
      )}
    </div>
  );
};

export default CourseContentDetails;
