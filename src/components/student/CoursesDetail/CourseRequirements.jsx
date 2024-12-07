import React from 'react';
import { FaListUl, FaClipboard, FaUsers, FaCheckCircle, FaUserAlt } from 'react-icons/fa';

const CourseRequirements = ({ requirements, description, targetAudience }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      {/* Yêu cầu (Requirements) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
        <FaListUl className="mr-2 text-blue-600" /> Yêu cầu
      </h2>
      <ul className="list-disc list-inside text-gray-800 mb-6">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center space-x-2">
            <FaCheckCircle className="text-green-600" />
            <span>{req}</span>
          </li>
        ))}
      </ul>

      {/* Mô tả (Description) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
        <FaClipboard className="mr-2 text-green-600" /> Mô tả
      </h2>
      <p className="text-gray-800 mb-6">
        {description}
      </p>

      {/* Đối tượng của khóa học (Target Audience) Section */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
        <FaUsers className="mr-2 text-orange-600" /> Đối tượng của khóa học này
      </h2>
      <ul className="list-disc list-inside text-gray-800">
        {targetAudience.map((audience, index) => (
          <li key={index} className="flex items-center space-x-2">
            <FaUserAlt className="text-orange-600" />
            <span>{audience}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseRequirements;
