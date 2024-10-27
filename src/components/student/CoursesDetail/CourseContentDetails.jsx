// src/components/student/CoursesDetail/CourseContentDetails.jsx
import React from 'react';

const CourseContentDetails = ({ contentDetails }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      {/* Darker and more prominent heading */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Nội dung bài học</h2>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        {contentDetails.map((detail, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2 text-green-600 font-bold">✔</span>
            <p className="text-gray-900">{detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseContentDetails;
