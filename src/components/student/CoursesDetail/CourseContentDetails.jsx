import React, { useState } from 'react';

const CourseContentDetails = ({ contentDetails }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Nội dung bài học</h2>

      <ul className="space-y-6 text-gray-800">
        {contentDetails.map((section, index) => (
          <li key={index} className="flex flex-col items-start">
            <h3
              onClick={() => toggleSection(index)}
              className="text-xl font-semibold text-gray-800 mb-2 cursor-pointer"
            >
              {section.title} ({section.lectures.length} bài giảng)
              <span className="ml-2">
                {expandedSections[index] ? '▲' : '▼'}
              </span>
            </h3>

            {expandedSections[index] && (
              <ul className="pl-4 list-disc space-y-1">
                {section.lectures.map((lecture, lectureIndex) => (
                  <li key={lectureIndex} className="text-gray-700">
                    {lecture}
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

export default CourseContentDetails;
