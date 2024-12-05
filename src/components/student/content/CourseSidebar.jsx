import React from "react";

const CourseSidebar = ({
  course,
  selectedSection,
  setSelectedSection,
  handleLectureClick,
  handleCheckboxChange,
  calculateCompletedLectures,
}) => {
  // Check if course is available before rendering
  if (!course) {
    return <div>Loading...</div>; // Show loading indicator if course is not available
  }

  // Destructure properties from course object
  const { images, title, description, sections } = course;

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r h-screen flex flex-col">
      <div className="mb-6">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-300 rounded-lg mb-4" /> // Placeholder image when no images available
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Scrollable Section List */}
      <div className="flex-grow overflow-y-auto">
        {sections &&
          sections.map((section) => (
            <div key={section.section_id} className="mb-6">
              <h2
                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 flex justify-between items-center"
                onClick={() => {
                  // Toggle the section: Close the section if it's already selected, open if not
                  setSelectedSection(selectedSection === section ? null : section);
                }}
              >
                {section.title}
                <span className="text-sm text-gray-500">
                  {calculateCompletedLectures(section.lectures)}/{section.lectures.length}
                </span>
              </h2>
              {selectedSection === section && (
                <ul className="mt-2 space-y-2 pl-4">
                  {section.lectures.map((lecture) => (
                    <li
                      key={lecture.lecture_id}
                      className={`p-2 rounded-lg ${
                        lecture.completed ? "bg-green-100" : "bg-gray-50"
                      } hover:bg-gray-200 cursor-pointer flex justify-between items-center`}
                      onClick={() => handleLectureClick(lecture)}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={lecture.completed}
                          className="mr-2"
                          disabled={lecture.completed}
                          onChange={() => handleCheckboxChange(lecture)}
                        />
                        {lecture.title}
                      </div>
                      <span className="text-sm text-gray-500">{lecture.duration}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
