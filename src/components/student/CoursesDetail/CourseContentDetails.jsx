import React, { useState } from "react";
import { 
  FaBook, 
  FaExclamationTriangle, 
  FaChevronDown,
  FaChevronUp 
} from "react-icons/fa";

const CourseContentDetails = ({ contentDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = 3; // Số lượng mục hiển thị khi thu gọn

  const visibleContent = isExpanded 
    ? contentDetails 
    : contentDetails?.slice(0, displayCount);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-colors duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transform transition-transform group-hover:scale-105">
              <FaBook className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tổng quan nội dung</h2>
              {contentDetails && (
                <p className="text-sm text-gray-500 mt-1">
                  {contentDetails.length} mục nội dung
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {contentDetails && contentDetails.length > 0 ? (
          <>
            <div className="grid gap-3">
              {visibleContent.map((content, index) => (
                <div 
                  key={index}
                  className="group flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-medium flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {contentDetails.length > displayCount && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 font-medium transition-all duration-300"
                >
                  {isExpanded ? (
                    <>
                      Thu gọn
                      <FaChevronUp className="text-sm" />
                    </>
                  ) : (
                    <>
                      Xem thêm {contentDetails.length - displayCount} mục
                      <FaChevronDown className="text-sm" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-3">
              <FaExclamationTriangle className="text-yellow-500" />
            </div>
            <p className="text-gray-500">Chưa có nội dung tổng quan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseContentDetails;