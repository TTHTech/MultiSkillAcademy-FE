import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';

const CourseContent = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Hàm toggle để mở/đóng từng section
  const toggleSection = (index) => {
    setExpandedSections((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nội dung khóa học</h2>
      <ul className="space-y-6">
        {content.map((section, index) => (
          <li key={index} className="border-b pb-6 hover:bg-gray-50 transition-all rounded-lg">
            {/* Tiêu đề section với nút toggle */}
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-gray-800"></div>
                <strong className="text-xl font-semibold text-gray-800">{section.title}</strong>
              </div>
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                {expandedSections[index] ? (
                  <FaChevronUp className="text-2xl" />
                ) : (
                  <FaChevronDown className="text-2xl" />
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {section.lectures?.length || 0} bài giảng
            </p>

            {/* Hiển thị các bài giảng khi section được mở */}
            {expandedSections[index] && (
              <ul className="mt-4 space-y-2 pl-6 text-gray-700">
                {section.lectures?.map((lecture, lectureIndex) => (
                  <li key={lectureIndex} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg">
                    {/* Icon Play và Tên bài giảng */}
                    <FaPlay className="text-gray-500" size={16} />
                    <span>{lecture}</span> {/* Chỉ hiển thị tên bài giảng */}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseContent;
