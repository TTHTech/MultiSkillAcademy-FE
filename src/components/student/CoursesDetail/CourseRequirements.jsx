// src/components/CourseRequirements.jsx
import React from 'react';

const CourseRequirements = ({ requirements, description, targetAudience }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      {/* Yêu cầu (Requirements) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Yêu cầu</h2>
      <ul className="list-disc list-inside text-gray-800 mb-6">
        {requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>

      {/* Mô tả (Description) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Mô tả</h2>
      <p className="text-gray-800 mb-6">
        {description}
      </p>

      {/* Đối tượng của khóa học (Target Audience) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Đối tượng của khóa học này</h2>
      <ul className="list-disc list-inside text-gray-800">
        {targetAudience.map((audience, index) => (
          <li key={index}>{audience}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseRequirements;
