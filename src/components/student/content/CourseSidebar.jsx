import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaBars,
  FaAngleDown,
  FaAngleUp,
  FaPlay,
  FaFile,
  FaCheckCircle,
  FaCircle,
  FaTimes,
  FaLock,
} from "react-icons/fa";

const CourseSidebar = ({
  course,
  calculateCompletedLectures,
  handleLectureClick,
  selectedLecture,
  progressCourses,
  isOpen,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Initialize expanded sections on mount - expand section with selected lecture
  useEffect(() => {
    if (course && course.sections && selectedLecture) {
      const sectionWithSelectedLecture = course.sections.find(section =>
        section.lectures.some(lecture => lecture.lecture_id === selectedLecture.lecture_id)
      );
      
      if (sectionWithSelectedLecture) {
        setExpandedSections(prev => ({
          ...prev,
          [sectionWithSelectedLecture.section_id]: true
        }));
      }
    }
  }, [course, selectedLecture]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const formatDuration = (duration) => {
    if (!duration) return "00:00";
    const parts = duration.split(":");
    if (parts.length === 2) return duration;
    if (parts.length === 3) return `${parts[1]}:${parts[2]}`;
    return duration;
  };

  // Check if lecture is locked
  const isLectureLocked = (lecture, section) => {
    const lectureIndex = section.lectures.findIndex(
      l => l.lecture_id === lecture.lecture_id
    );
    
    // First lecture in section is always unlocked
    if (lectureIndex === 0) return false;
    
    // Check if previous lecture is completed
    const previousLecture = section.lectures[lectureIndex - 1];
    return !previousLecture.watched;
  };

  if (!course || !course.sections) {
    return <div className="p-4">Loading course content...</div>;
  }

  // Calculate total progress
  const totalLectures = course.sections.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  );
  const completedLectures = course.sections.reduce(
    (acc, section) => acc + section.lectures.filter(lecture => lecture.watched).length,
    0
  );
  const progressPercentage = totalLectures > 0 
    ? Math.round((completedLectures / totalLectures) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with close button */}
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Nội dung khóa học</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng sidebar"
            >
              <FaTimes className="text-gray-600 text-lg" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Tiến độ học tập</span>
              <span className="text-sm font-semibold text-gray-800">
                {completedLectures}/{totalLectures} bài ({progressPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {course.sections.map((section, sectionIndex) => {
          const sectionCompleted = calculateCompletedLectures(section.lectures);
          const sectionTotal = section.lectures.length;
          const sectionProgress = sectionTotal > 0 
            ? Math.round((sectionCompleted / sectionTotal) * 100)
            : 0;

          return (
            <div
              key={`${section.section_id}-${sectionCompleted}`} // Add sectionCompleted to key for reactivity
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.section_id)}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Chương {sectionIndex + 1}: {section.title}
                    </h3>
                    <div className="flex items-center mt-1 text-xs text-gray-600">
                      <span>
                        {sectionCompleted}/{sectionTotal} bài
                      </span>
                      {sectionProgress > 0 && (
                        <span className="ml-2 text-green-600">
                          ({sectionProgress}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-2">
                    {expandedSections[section.section_id] ? (
                      <FaAngleUp className="text-gray-600" />
                    ) : (
                      <FaAngleDown className="text-gray-600" />
                    )}
                  </div>
                </div>
                
                {/* Section progress bar */}
                {sectionProgress > 0 && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${sectionProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Lectures List */}
              {expandedSections[section.section_id] && (
                <div className="bg-gray-50">
                  {section.lectures.map((lecture, lectureIndex) => {
                    const isSelected = selectedLecture?.lecture_id === lecture.lecture_id;
                    const isWatched = lecture.watched;
                    const isLocked = isLectureLocked(lecture, section);

                    return (
                      <div
                        key={`${lecture.lecture_id}-${isWatched}-${isLocked}`} // Dynamic key for reactivity
                        className={`
                          px-4 py-3 cursor-pointer border-l-4 transition-all duration-200
                          ${isSelected 
                            ? "bg-blue-50 border-blue-500" 
                            : "border-transparent hover:bg-gray-100"
                          }
                          ${isLocked ? "opacity-60 cursor-not-allowed" : ""}
                        `}
                        onClick={() => {
                          if (!isLocked) {
                            handleLectureClick(lecture);
                          } else {
                            // Show message when clicking locked lecture
                            const swalFire = async () => {
                              const Swal = (await import('sweetalert2')).default;
                              Swal.fire({
                                title: "Bài học bị khóa",
                                text: "Bạn cần hoàn thành bài học trước để mở khóa bài này.",
                                icon: "info",
                                timer: 2000,
                                showConfirmButton: false
                              });
                            };
                            swalFire();
                          }
                        }}
                      >
                        <div className="flex items-start">
                          {/* Icon and checkbox */}
                          <div className="mr-3 mt-0.5">
                            {isLocked ? (
                              <FaLock className="text-gray-400 text-lg" />
                            ) : isWatched ? (
                              <FaCheckCircle className="text-green-500 text-lg" />
                            ) : (
                              <FaCircle className="text-gray-400 text-lg" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              {lecture.content_type === "video" ? (
                                <FaPlay className="text-blue-500 text-xs mr-2 flex-shrink-0" />
                              ) : (
                                <FaFile className="text-orange-500 text-xs mr-2 flex-shrink-0" />
                              )}
                              <h4 className={`
                                text-sm pr-2 flex-1
                                ${isSelected ? "font-semibold text-blue-700" : "text-gray-800"}
                                ${isWatched && !isLocked ? "line-through opacity-70" : ""}
                              `}>
                                Bài {lectureIndex + 1}: {lecture.title}
                              </h4>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-600">
                              <span>{formatDuration(lecture.duration)}</span>
                              {isSelected && !isLocked && (
                                <span className="ml-2 text-blue-600 font-medium">
                                  Đang xem
                                </span>
                              )}
                              {isLocked && (
                                <span className="ml-2 text-gray-500">
                                  <FaLock className="inline mr-1" size={10} />
                                  Cần hoàn thành bài trước
                                </span>
                              )}
                              {!isLocked && !isWatched && !isSelected && (
                                <span className="ml-2 text-gray-500">
                                  Chưa xem
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <div className="text-xs text-gray-600 mb-1">
            Hoàn thành {completedLectures} / {totalLectures} bài học
          </div>
          {progressPercentage === 100 && (
            <div className="text-sm font-semibold text-green-600">
              🎉 Chúc mừng bạn đã hoàn thành khóa học!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CourseSidebar.propTypes = {
  course: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        section_id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        lectures: PropTypes.arrayOf(
          PropTypes.shape({
            lecture_id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            content_type: PropTypes.string.isRequired,
            duration: PropTypes.string,
            watched: PropTypes.bool,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  calculateCompletedLectures: PropTypes.func.isRequired,
  handleLectureClick: PropTypes.func.isRequired,
  selectedLecture: PropTypes.object,
  progressCourses: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CourseSidebar;