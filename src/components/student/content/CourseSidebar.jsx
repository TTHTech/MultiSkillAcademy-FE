import React, { useState } from "react";
import {
  FaChevronDown,
  FaCheckCircle,
  FaRegCircle,
  FaFileAlt,
  FaTrophy,
  FaGraduationCap,
  FaLock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const CourseSidebar = ({
  course,
  handleLectureClick,
  selectedLecture,
  calculateCompletedLectures,
  progressCourses,
}) => {
  const [openSections, setOpenSections] = useState({});

  if (!course) {
    return (
      <div className="w-full h-[800px] flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
    <div className="w-full max-w-xs bg-white shadow-xl rounded-xl p-6 overflow-hidden h-[800px] mt-[90px] border border-gray-100">
      <div className="overflow-y-auto h-full pr-2 hide-scrollbar">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaGraduationCap className="text-blue-600 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nội dung khóa học</h2>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
              <span className="text-sm font-semibold text-blue-600 bg-white px-3 py-1 rounded-full shadow-sm">
                {completedLectures}/{totalLectures}
              </span>
            </div>
            <div className="relative h-3 bg-white rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              />
            </div>
            <p className="text-xs font-medium text-gray-600 mt-2 text-center">
              {progressPercentage.toFixed(0)}% hoàn thành
            </p>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const isOpen = openSections[sectionIndex];
            const totalDuration = calculateSectionTime(section.lectures);
            const completedInSection = section.lectures.filter(l => l.watched).length;

            return (
              <div
                key={sectionIndex}
                className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
              >
                <motion.button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ 
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-left mb-1">
                      {section.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                        {completedInSection}/{section.lectures.length} bài
                      </span>
                      <span className="text-sm text-gray-500">{totalDuration}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
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
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-4 py-2 space-y-2">
                        {section.lectures.map((lecture, index) => {
                          const watched = lecture.watched || false;
                          const isSelected = selectedLecture?.lecture_id === lecture.lecture_id;
                          const isAvailable = index === 0 || watched || (index > 0 && section.lectures[index - 1]?.watched);

                          return (
                            <motion.div
                              key={lecture.lecture_id}
                              className={`relative rounded-xl transition-all duration-200 ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500"
                                  : "hover:bg-gray-50"
                              } ${!isAvailable ? "opacity-70" : ""}`}
                              whileHover={{ 
                                scale: isAvailable ? 1.01 : 1, 
                                x: isAvailable ? 4 : 0,
                                transition: { duration: 0.2 }
                              }}
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
                                className="w-full p-3 flex items-center justify-between text-left group"
                                disabled={!isAvailable}
                              >
                                <div className="flex items-center space-x-3">
                                  {watched ? (
                                    <FaCheckCircle className="text-green-500 text-lg" />
                                  ) : !isAvailable ? (
                                    <FaLock className="text-gray-400 text-lg" />
                                  ) : (
                                    <FaRegCircle className="text-gray-400 text-lg group-hover:text-blue-500 transition-colors" />
                                  )}
                                  <span className={`text-sm ${isSelected ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                                    {lecture.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                  <FaFileAlt className="text-blue-500" />
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
            className="mt-8 px-4"
          >
            <motion.button
              onClick={handleCertificateClick}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTrophy className="text-yellow-300 animate-pulse" size={22} />
              <span className="font-semibold tracking-wide">Nhận chứng chỉ</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;