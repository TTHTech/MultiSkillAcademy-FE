import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa'; // Import FaPlay for lecture icon

const CourseContent = ({ content }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle function to expand or collapse a section
  const toggleSection = (index) => {
    setExpandedSections((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Nội dung khóa học</h2>
      <ul className="space-y-4">
        {content.map((section, index) => (
          <li key={index} className="border-b pb-4">
            {/* Section title with toggle arrow */}
            <div className="flex justify-between items-center">
              <strong className="text-gray-800">{section.title}</strong>
              <button
                onClick={() => toggleSection(index)}
                className="flex items-center"
              >
                {expandedSections[index] ? (
                  <FaChevronUp className="text-black" />
                ) : (
                  <FaChevronDown className="text-black" />
                )}
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              {section.lectures.length} bài giảng • {section.duration}
            </p>

            {/* Show lectures if section is expanded */}
            {expandedSections[index] && (
              <ul className="mt-2 space-y-1 text-gray-700">
                {section.lectures.map((lecture, lectureIndex) => (
                  <li key={lectureIndex} className="flex items-center justify-between">
                    {/* Play Icon and Lecture Title */}
                    <div className="flex items-center">
                      <FaPlay className="text-gray-500 mr-2" size={12} /> {/* Play icon */}
                      <span>{lecture.title}</span>
                    </div>
                    {/* Duration */}
                    <span className="text-gray-500 text-xs">{lecture.duration}</span>
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
