import React, { useState } from 'react';
import { 
  FaListUl, 
  FaClipboard, 
  FaUsers, 
  FaCheckCircle, 
  FaUserAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Component con để hiển thị từng section
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
  </div>
);

const RequirementItem = ({ requirement }) => (
  <li className="flex items-start space-x-3 mb-3 group">
    <FaCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
    <span className="text-gray-700 leading-relaxed">{requirement}</span>
  </li>
);

const AudienceItem = ({ audience }) => (
  <li className="flex items-start space-x-3 mb-3 group">
    <div className="p-1 rounded-full bg-orange-100 flex-shrink-0 group-hover:bg-orange-200 transition-colors">
      <FaUserAlt className="w-3 h-3 text-orange-600" />
    </div>
    <span className="text-gray-700 leading-relaxed">{audience}</span>
  </li>
);

const DescriptionSection = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 300;
  const needsExpansion = description.length > MAX_LENGTH;
  
  const displayText = isExpanded 
    ? description 
    : `${description.slice(0, MAX_LENGTH)}${needsExpansion ? '...' : ''}`;

  return (
    <div className="relative">
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {needsExpansion && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {isExpanded ? (
            <>Thu gọn <FaChevronUp className="w-3 h-3" /></>
          ) : (
            <>Xem thêm <FaChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  );
};

const CourseRequirements = ({ requirements = [], description = "", targetAudience = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Yêu cầu Section */}
      <div className="p-6 border-b border-gray-100">
        <SectionHeader
          icon={FaListUl}
          title="Yêu cầu đầu vào"
          color="bg-blue-500"
        />
        <ul className="space-y-2 pl-1">
          {requirements.map((req, index) => (
            <RequirementItem key={index} requirement={req} />
          ))}
        </ul>
      </div>

      {/* Mô tả Section */}
      <div className="p-6 border-b border-gray-100">
        <SectionHeader
          icon={FaClipboard}
          title="Mô tả chi tiết"
          color="bg-green-500"
        />
        <DescriptionSection description={description} />
      </div>

      {/* Đối tượng học Section */}
      <div className="p-6">
        <SectionHeader
          icon={FaUsers}
          title="Đối tượng của khóa học"
          color="bg-orange-500"
        />
        <ul className="space-y-2 pl-1">
          {targetAudience.map((audience, index) => (
            <AudienceItem key={index} audience={audience} />
          ))}
        </ul>
      </div>

      {/* Quick Navigation */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => document.querySelector('[data-section="requirements"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaListUl className="w-4 h-4" />
            Yêu cầu
          </button>
          <button 
            onClick={() => document.querySelector('[data-section="description"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaClipboard className="w-4 h-4" />
            Mô tả
          </button>
          <button 
            onClick={() => document.querySelector('[data-section="audience"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            <FaUsers className="w-4 h-4" />
            Đối tượng học
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseRequirements;