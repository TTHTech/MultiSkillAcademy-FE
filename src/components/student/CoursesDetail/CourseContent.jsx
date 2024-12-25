import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp, FaRegPlayCircle } from 'react-icons/fa';

const CourseContent = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showAll, setShowAll] = useState(false); // State để kiểm soát việc hiển thị tất cả các section

  // Hàm toggle để mở/đóng từng section
  const toggleSection = (index) => {
    setExpandedSections((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  // Hàm toggle để chuyển đổi trạng thái "Xem thêm"
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const sectionsToDisplay = showAll ? content : content.slice(0, 3); // Chỉ lấy 3 section đầu nếu chưa bấm "Xem thêm"

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Nội dung khóa học</h2>
      <ul className="space-y-6">
        {sectionsToDisplay.map((section, index) => (
          <li key={index} className="border-b pb-6 hover:bg-gray-50 transition-all rounded-lg">
            {/* Tiêu đề section với nút toggle */}
            <div className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
                <strong className="text-xl font-semibold text-gray-800">{section.title}</strong>
              </div>
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                {expandedSections[index] ? (
                  <FaAngleUp className="text-2xl text-blue-500" />
                ) : (
                  <FaAngleDown className="text-2xl text-blue-500" />
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
                    <FaRegPlayCircle className="text-gray-600" size={18} />
                    <span>{lecture}</span> {/* Chỉ hiển thị tên bài giảng */}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {content.length > 3 && (
        <button
          onClick={toggleShowAll}
          className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          {showAll ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
};

export default CourseContent;
