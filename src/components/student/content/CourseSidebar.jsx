import React, { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaCheckCircle,
  FaRegCircle,
  FaFileAlt,
  FaTrophy,
  FaGraduationCap
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const CourseSidebar = ({
  course,
  selectedSection,
  setSelectedSection,
  handleLectureClick,
  selectedLecture,
  calculateCompletedLectures,
  progressCourses,
}) => {
  const [openSections, setOpenSections] = useState({});
  const [isHovered, setIsHovered] = useState(null);

  if (!course) {
    return (
      <div className="w-full h-[800px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { sections } = course;

  const parseDuration = (duration) => {
    if (typeof duration === "string") {
      const minuteMatch = duration.match(/(\d+)\s*min/);
      const secondMatch = duration.match(/(\d+)\s*sec/);
      const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
      const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const calculateSectionTime = (lectures) => {
    const totalSeconds = lectures.reduce((sum, lecture) => {
      return sum + parseDuration(lecture.duration);
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${
      seconds > 0 ? `${seconds}s` : ""
    }`.trim();
  };

  const totalLectures = sections.reduce(
    (total, section) => total + section.lectures.length,
    0
  );

  const completedLectures = sections.reduce(
    (total, section) => total + calculateCompletedLectures(section.lectures),
    0
  );

  const progressPercentage = (completedLectures / totalLectures) * 100;

  const handleCertificateClick = () => {
    const queryParams = new URLSearchParams({
      courseName: course.title,
    }).toString();
    window.open(`/certificate?${queryParams}`, "_blank");
  };

  const toggleSection = (sectionIndex) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  return (
    <div className="w-full max-w-xs bg-white shadow-lg rounded-xl p-6 overflow-hidden h-[800px] mt-[90px]">
      <div className="overflow-y-auto h-full pr-2 hide-scrollbar">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FaGraduationCap className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Nội dung khóa học</h2>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Tiến độ học tập</span>
              <span className="text-sm font-medium text-blue-600">
                {completedLectures}/{totalLectures}
              </span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute h-full bg-blue-500 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {progressPercentage.toFixed(0)}% hoàn thành
            </p>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const isOpen = openSections[sectionIndex];
            const totalDuration = calculateSectionTime(section.lectures);

            return (
              <div
                key={sectionIndex}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                <motion.button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-left">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {section.lectures.filter((l) => l.watched).length}/{section.lectures.length} bài |{" "}
                      {totalDuration}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown className="text-gray-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 space-y-1">
                        {section.lectures.map((lecture, index) => {
                          const watched = lecture.watched || false;
                          const isSelected = selectedLecture?.lecture_id === lecture.lecture_id;
                          const isAvailable = index === 0 || watched || (index > 0 && section.lectures[index - 1]?.watched);

                          return (
                            <motion.div
                              key={lecture.lecture_id}
                              className={`relative rounded-lg ${
                                isSelected
                                  ? "bg-blue-50 border-l-4 border-blue-500"
                                  : "hover:bg-gray-100"
                              } ${!isAvailable ? "opacity-60" : ""}`}
                              whileHover={{ scale: isAvailable ? 1.01 : 1 }}
                              whileTap={{ scale: isAvailable ? 0.99 : 1 }}
                            >
                              <button
                                onClick={() => {
                                  if (isAvailable) {
                                    handleLectureClick(lecture);
                                  } else {
                                    Swal.fire({
                                      title: "Chưa thể truy cập",
                                      text: "Vui lòng hoàn thành bài học trước để mở khóa bài này.",
                                      icon: "warning",
                                      confirmButtonText: "Đã hiểu",
                                      confirmButtonColor: "#3B82F6"
                                    });
                                  }
                                }}
                                className="w-full p-3 flex items-center justify-between text-left"
                              >
                                <div className="flex items-center space-x-3">
                                  {watched ? (
                                    <FaCheckCircle className="text-green-500" />
                                  ) : (
                                    <FaRegCircle className="text-gray-400" />
                                  )}
                                  <span className={`text-sm ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                                    {lecture.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <FaFileAlt />
                                  <span>{calculateSectionTime([lecture])}</span>
                                </div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Certificate Button */}
        {progressCourses >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 px-4"
          >
            <motion.button
              onClick={handleCertificateClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTrophy className="text-yellow-300" size={20} />
              <span className="font-medium">Nhận chứng chỉ</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;