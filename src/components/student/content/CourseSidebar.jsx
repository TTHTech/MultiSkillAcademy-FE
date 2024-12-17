import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaCheckCircle,
  FaRegCircle,
  FaFileAlt,
  FaTrophy,
} from "react-icons/fa";
import { MdDownload } from "react-icons/md";
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
  const [openSections, setOpenSections] = useState({}); // Trạng thái mở rộng các section

  if (!course) return <div>Loading...</div>;

  const { sections } = course;

  // Toggle mở rộng/thu gọn section
  const toggleSection = (sectionIndex) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
  };

  // Tính tổng thời gian từ chuỗi "min" và "sec"
  const parseDuration = (duration) => {
    if (typeof duration === "string") {
      const minuteMatch = duration.match(/(\d+)\s*min/);
      const secondMatch = duration.match(/(\d+)\s*sec/);
      const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
      const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;
      return minutes * 60 + seconds; // Tổng thời gian tính bằng giây
    }
    return 0;
  };

  // Tính tổng thời gian cho section
  const calculateSectionTime = (lectures) => {
    const totalSeconds = lectures.reduce((sum, lecture) => {
      return sum + parseDuration(lecture.duration);
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? `${hours} giờ ` : ""}${
      minutes > 0 ? `${minutes} phút ` : ""
    }${seconds > 0 ? `${seconds} giây` : ""}`.trim();
  };

  // Tính tổng tiến độ
  const totalLectures = sections.reduce(
    (total, section) => total + section.lectures.length,
    0
  );

  const completedLectures = sections.reduce(
    (total, section) => total + calculateCompletedLectures(section.lectures),
    0
  );

  const progressPercentage = (completedLectures / totalLectures) * 100;

  // Xử lý khi nhấn nhận chứng chỉ
  const handleCertificateClick = () => {
    const queryParams = new URLSearchParams({
      courseName: course.title,
    }).toString();
    window.open(`/certificate?${queryParams}`, "_blank");
  };

  return (
    <div className="w-full max-w-xs bg-gray-50 shadow-md rounded-lg mt-4 p-4 overflow-y-auto h-[800px] mt-[90px]"
    style={{
      scrollbarWidth: "none" /* Firefox */,
      msOverflowStyle: "none" /* IE và Edge */,
    }}
    >
      {/* Tiêu đề Sidebar */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Nội dung khóa học</h2>

      {/* Tiến độ học tập */}
      <div className="mb-4">
        <div className="text-gray-500 text-sm flex justify-between mb-2">
          <span>Tiến độ:</span>
          <span>
            {completedLectures} / {totalLectures} bài học
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-2.5"
            style={{
              width: `${progressPercentage}%`,
              maxWidth: "100%",
            }}
          ></div>
        </div>
      </div>

      {/* Danh sách Section và Lectures */}
      {sections.map((section, sectionIndex) => {
        const isOpen = openSections[sectionIndex];
        const totalDuration = calculateSectionTime(section.lectures);

        return (
          <div key={sectionIndex} className="mb-4">
            {/* Tiêu đề Section */}
            <div
              className="flex justify-between items-center cursor-pointer bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition"
              onClick={() => toggleSection(sectionIndex)}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                <p className="text-sm text-gray-500">
                  {section.lectures.filter((l) => l.watched).length} /{" "}
                  {section.lectures.length} | {totalDuration}
                </p>
              </div>
              <span className="text-gray-500">
                {isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </div>

            {/* Danh sách Bài học */}
            {isOpen && (
              <div className="mt-2 space-y-2 pl-4">
                {section.lectures.map((lecture, index) => {
                  const watched = lecture.watched || false;

                  return (
                    <div
                      key={lecture.lecture_id}
                      className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 transition ${
                        selectedLecture?.lecture_id === lecture.lecture_id
                          ? "bg-green-100 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          index === 0 ||
                          watched ||
                          (index > 0 && section.lectures[index - 1]?.watched)
                        ) {
                          handleLectureClick(lecture);
                        } else {
                          Swal.fire({
                            title: "Thông báo",
                            text: "Bạn cần hoàn thành bài học trước để mở khóa bài học này.",
                            icon: "warning",
                          });
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="text-green-500">
                          {watched ? <FaCheckCircle /> : <FaRegCircle />}
                        </div>
                        <span className={`text-sm text-gray-800`}>
                          {lecture.title}
                        </span>
                      </div>
                      {/* Thời lượng */}
                      <div className="text-gray-500 text-xs flex items-center space-x-1">
                        <FaFileAlt />
                        <span>{calculateSectionTime([lecture])}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Nút nhận chứng chỉ */}
      {progressCourses >= 100 && (
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleCertificateClick}
            className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-800 transition"
          >
            <FaTrophy className="text-purple-400 mr-2" size={20} />
            Nhận giấy chứng nhận
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseSidebar;
