import React, { useState, useCallback } from 'react';
import { 
  FaAngleDown, 
  FaAngleUp, 
  FaRegPlayCircle,
  FaRegClock,
  FaLock,
  FaChevronDown,
  FaChevronUp,
  FaBook
} from 'react-icons/fa';

// Components con để tái sử dụng
const SectionHeader = ({ title, lectureCount, duration, isExpanded, onToggle }) => (
  <div 
    onClick={onToggle}
    className="flex justify-between items-center cursor-pointer group px-4 py-3 hover:bg-gray-50 rounded-lg transition-all"
  >
    <div className="flex items-center space-x-4 flex-1">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
          <FaBook className="text-white text-sm" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <FaRegPlayCircle className="text-gray-400" />
            <span>{lectureCount} bài giảng</span>
          </span>
          {duration && (
            <span className="flex items-center space-x-1">
              <FaRegClock className="text-gray-400" />
              <span>{duration}</span>
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 transition-colors">
        {isExpanded ? (
          <FaAngleUp className="text-blue-600 text-xl" />
        ) : (
          <FaAngleDown className="text-blue-600 text-xl" />
        )}
      </div>
    </div>
  </div>
);

const LectureItem = ({ title, duration, isLocked, onClick }) => (
  <li 
    onClick={onClick}
    className="group cursor-pointer"
  >
    <div className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
        {isLocked ? (
          <FaLock className="text-gray-400 text-sm group-hover:text-blue-500" />
        ) : (
          <FaRegPlayCircle className="text-gray-400 text-sm group-hover:text-blue-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </span>
          {duration && (
            <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
              {duration}
            </span>
          )}
        </div>
      </div>
    </div>
  </li>
);

const CourseContent = ({ content = [] }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showAll, setShowAll] = useState(false);

  const toggleSection = useCallback((index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  // Tính tổng số bài giảng và thời lượng
  const totalStats = content.reduce((acc, section) => ({
    lectures: acc.lectures + (section.lectures?.length || 0),
    duration: acc.duration + (section.totalDuration || 0)
  }), { lectures: 0, duration: 0 });

  const sectionsToDisplay = showAll ? content : content.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nội dung khóa học</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <FaRegPlayCircle />
              <span>{totalStats.lectures} bài giảng</span>
            </span>
            <span className="flex items-center space-x-1">
              <FaRegClock />
              <span>{Math.floor(totalStats.duration / 60)}h {totalStats.duration % 60}m</span>
            </span>
          </div>
        </div>

       
      </div>

      {/* Course sections */}
      <div className="p-6">
        <ul className="space-y-4">
          {sectionsToDisplay.map((section, index) => (
            <li key={index} className="border border-gray-100 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <SectionHeader
                title={section.title}
                lectureCount={section.lectures?.length || 0}
                duration={section.duration}
                isExpanded={expandedSections[index]}
                onToggle={() => toggleSection(index)}
              />
              
              {expandedSections[index] && (
                <div className="border-t border-gray-100">
                  <ul className="py-2">
                    {section.lectures?.map((lecture, lectureIndex) => (
                      <LectureItem
                        key={lectureIndex}
                        title={lecture.title || lecture}
                        duration={lecture.duration}
                        isLocked={lecture.isLocked}
                        onClick={() => {/* Xử lý khi click vào bài giảng */}}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {content.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={toggleShowAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
            >
              {showAll ? (
                <>
                  Thu gọn
                  <FaChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Xem tất cả {content.length} chương
                  <FaChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContent;