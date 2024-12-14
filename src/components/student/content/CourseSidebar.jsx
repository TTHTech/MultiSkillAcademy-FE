import React from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import Swal from "sweetalert2";

const CourseSidebar = ({
  course,
  selectedSection,
  setSelectedSection,
  handleLectureClick,
  calculateCompletedLectures,
  selectedLecture,
}) => {
  if (!course) {
    return <div>Loading...</div>;
  }

  const { sections } = course;

  // Hàm xử lý khi người dùng nhấn vào phần (section)
  const handleSectionClick = (section) => {
    setSelectedSection(selectedSection === section ? null : section);
  };

  return (
    <div className="w-1/4 bg-white p-6 border-r h-screen flex flex-col shadow-xl rounded-lg">
      {/* Tiến độ học tập */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Tiến độ học tập</h2>
        <div className="mt-4">
          {sections && (
            <div className="flex justify-between">
              <span className="text-gray-500">Tiến độ:</span>
              <span className="text-gray-500">
                {sections.reduce(
                  (total, section) =>
                    total + calculateCompletedLectures(section.lectures),
                  0
                )}{" "}
                /{" "}
                {sections.reduce(
                  (total, section) => total + section.lectures.length,
                  0
                )}{" "}
                bài học
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách các phần và bài học */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Các phần trong khóa học
        </h2>
        <div className="mt-4 space-y-4">
          {sections?.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleSectionClick(section)}
              >
                <h3 className="text-lg font-medium text-gray-700">
                  {section.title}
                </h3>
                <span className="text-gray-400">
                  {selectedSection === section ? "-" : "+"}
                </span>
              </div>

              {selectedSection === section && (
                <div className="mt-4 space-y-2">
                  {section.lectures?.map((lecture, index) => {
                    const watched = lecture.watched || false; // Trạng thái watched từ API
                    const progress = lecture.progress || 0; // Tiến độ từ API nếu có

                    return (
                      <div
                        key={lecture.lecture_id}
                        className={`flex items-center justify-between p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                          selectedLecture?.lecture_id === lecture.lecture_id
                            ? "bg-blue-100"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (
                            index === 0 || // Cho phép chọn bài học đầu tiên
                            watched || // Bài học đã hoàn thành
                            progress >= 70 || // Bài học đạt ít nhất 70%
                            (index > 0 && section.lectures[index - 1]?.watched) // Bài học nằm sau bài đã hoàn thành
                          ) {
                            handleLectureClick(lecture);
                          } else {
                            Swal.fire({
                              title: "Thông báo",
                              text: "Bạn cần xem ít nhất 70% video của bài học trước khi chuyển sang bài học tiếp theo.",
                              icon: "warning",
                            });
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <span
                            className={`text-sm ${
                              watched || progress >= 70
                                ? "text-green-600"
                                : "text-gray-800"
                            }`}
                          >
                            {lecture.title}
                          </span>
                        </div>
                        <div className="text-green-500">
                          {watched ? <FaCheckCircle /> : <FaRegCircle />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
