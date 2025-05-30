import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  FaChevronDown,
  FaCheckCircle,
  FaRegCircle,
  FaFileAlt,
  FaTrophy,
  FaGraduationCap,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { Flag } from "lucide-react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import { decodeId } from "../../../utils/hash";

const CourseSidebar = ({
  course,
  handleLectureClick,
  selectedLecture,
  calculateCompletedLectures,
  progressCourses,
  isOpen,
  onClose,
}) => {
  const [openSections, setOpenSections] = useState({});
  const { courseHash } = useParams();
  const id = decodeId(courseHash);
  useEffect(() => {
    if (selectedLecture) {
      const sectionIndex = course.sections.findIndex((section) =>
        section.lectures.some(
          (lecture) => lecture.lecture_id === selectedLecture.lecture_id
        )
      );
      if (sectionIndex !== -1) {
        setOpenSections((prev) => ({
          ...prev,
          [sectionIndex]: true,
        }));
      }
    }
  }, [selectedLecture, course.sections]);

  const handleLectureSelection = (lecture, isAvailable) => {
    if (!isAvailable) {
      Swal.fire({
        title: "Chưa thể truy cập",
        text: "Vui lòng hoàn thành bài học trước để mở khóa bài này.",
        icon: "warning",
        confirmButtonText: "Đã hiểu",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    // Lưu thông tin bài giảng đã chọn vào localStorage
    localStorage.setItem("current_lecture_id", lecture.lecture_id);

    // Gọi handleLectureClick để thông báo component cha
    handleLectureClick(lecture);
  };

  if (!course) {
    return null;
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

    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m ` : ""
    }${seconds > 0 ? `${seconds}s` : ""}`.trim();
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
  const handleReportSection = async (section) => {
    const userId = localStorage.getItem("userId");
    const { value: reason } = await Swal.fire({
      title: "Báo cáo chương học",
      input: "textarea",
      inputLabel: "Lý do báo cáo chương học",
      inputPlaceholder: "Nhập lý do tại đây...",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
      preConfirm: (val) => {
        if (!val) Swal.showValidationMessage("Bạn phải nhập lý do!");
        return val;
      },
    });
    if (!reason) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${baseUrl}/api/student/section/report`,
        {
          idUserReport: userId,
          targetId: section.section_id,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire("Thành công", "Báo cáo đã được gửi!", "success");
    } catch (err) {
      console.error(err);
      await Swal.fire("Lỗi", "Không gửi được báo cáo, thử lại sau.", "error");
    }
  };
  const handleReportLecture = async (lecture) => {
    const userId = localStorage.getItem("userId");
    const { value: reason } = await Swal.fire({
      title: "Báo cáo bài học",
      input: "textarea",
      inputLabel: "Lý do báo cáo bài học",
      inputPlaceholder: "Nhập lý do tại đây...",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
      preConfirm: (val) => {
        if (!val) Swal.showValidationMessage("Bạn phải nhập lý do!");
        return val;
      },
    });
    if (!reason) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${baseUrl}/api/student/lecture/report`,
        {
          idUserReport: userId,
          targetId: lecture.lecture_id,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire("Thành công", "Báo cáo đã được gửi!", "success");
    } catch (err) {
      console.error(err);
      await Swal.fire("Lỗi", "Không gửi được báo cáo, thử lại sau.", "error");
    }
  };
  return (
    <div className="h-full w-full">
      {/* Header - sticky để luôn hiển thị khi cuộn */}
      <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Nội dung khóa học
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1"
          aria-label="Đóng"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Sections List - chỉ là phần có thể cuộn */}
      <div>
        {sections.map((section, sectionIndex) => {
          const isOpen = openSections[sectionIndex];
          const completedInSection = calculateCompletedLectures(
            section.lectures
          );
          const totalTime = calculateSectionTime(section.lectures);

          return (
            <div key={sectionIndex} className="border-b border-gray-200">
              <button
                onClick={() => toggleSection(sectionIndex)}
                className="w-full px-6 py-5 flex items-start hover:bg-gray-50 transition-colors"
              >
                <FaChevronDown
                  className={`w-4 h-4 text-gray-500 mt-1 mr-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center mb-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      Phần {sectionIndex + 1}: {section.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportSection(section);
                      }}
                      className="ml-2 p-2 text-red-500 hover:text-red-600 transition"
                      title="Báo cáo"
                    >
                      <Flag size={22} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedInSection}/{section.lectures.length} | {totalTime}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.lectures.map((lecture, index) => {
                      const watched = lecture.watched || false;
                      const isSelected =
                        selectedLecture?.lecture_id === lecture.lecture_id;
                      const isAvailable =
                        index === 0 ||
                        watched ||
                        (index > 0 && section.lectures[index - 1]?.watched);

                      return (
                        <button
                          key={lecture.lecture_id}
                          onClick={() =>
                            handleLectureSelection(lecture, isAvailable)
                          }
                          className={`w-full pl-14 pr-6 py-4 flex items-start text-left
                            ${isSelected ? "bg-purple-50" : "hover:bg-gray-50"} 
                            ${
                              !isAvailable
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          disabled={!isAvailable}
                        >
                          <div className="w-5 h-5 flex items-center justify-center mr-4 mt-0.5">
                            {watched ? (
                              <FaCheckCircle className="w-[18px] h-[18px] text-purple-600" />
                            ) : !isAvailable ? (
                              <FaLock className="w-[16px] h-[16px] text-gray-400" />
                            ) : (
                              <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              <p
                                className={`text-base ${
                                  isSelected
                                    ? "text-purple-600 font-medium"
                                    : "text-gray-700"
                                } truncate`}
                              >
                                {lecture.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReportLecture(lecture);
                                }}
                                className="ml-2 p-2 text-red-500 hover:text-red-600 transition"
                                title="Báo cáo"
                              >
                                <Flag size={16} />
                              </button>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <FaFileAlt className="w-3 h-3 mr-2" />
                              <span>{calculateSectionTime([lecture])}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
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
              boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <FaTrophy className="text-yellow-300 animate-pulse" size={22} />
            <span className="font-semibold tracking-wide">Nhận chứng chỉ</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default CourseSidebar;
