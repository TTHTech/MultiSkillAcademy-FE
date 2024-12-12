import React from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const CourseSidebar = ({
  course,
  selectedSection,
  setSelectedSection,
  handleLectureClick,
  handleCheckboxChange,
  calculateCompletedLectures,
  selectedLecture, // Nhận bài học đã chọn từ component cha
}) => {
  if (!course) {
    return <div>Loading...</div>; // Hiển thị khi chưa có dữ liệu
  }

  const { sections } = course; // Lấy danh sách phần trong khóa học

  // Hàm xử lý khi người dùng nhấn vào phần (section)
  const handleSectionClick = (section) => {
    // Đóng/mở danh sách bài học của phần được chọn
    setSelectedSection(selectedSection === section ? null : section);
  };

  return (
    <div className="w-1/4 bg-white p-6 border-r h-screen flex flex-col shadow-xl rounded-lg">
      {/* Phần Tiến độ học tập */}
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
        <h2 className="text-lg font-semibold text-gray-800">Các phần trong khóa học</h2>
        <div className="mt-4 space-y-4">
          {sections?.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Hiển thị tiêu đề phần và biểu tượng mở/đóng */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => handleSectionClick(section)} // Xử lý khi nhấn vào phần
              >
                <h3 className="text-lg font-medium text-gray-700">{section.title}</h3>
                <span className="text-gray-400">
                  {selectedSection === section ? "-" : "+"}
                </span>
              </div>

              {/* Danh sách bài học trong phần (hiển thị khi phần được mở) */}
              {selectedSection === section && (
                <div className="mt-4 space-y-2">
                  {section.lectures?.map((lecture) => (
                    <div
                      key={lecture.lecture_id}
                      className={`flex items-center justify-between p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                        selectedLecture?.lecture_id === lecture.lecture_id
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleLectureClick(lecture)} // Xử lý khi nhấn vào bài học
                    >
                      <div className="flex items-center">
                        {/* Checkbox trạng thái hoàn thành */}
                        <input
                          type="checkbox"
                          checked={lecture.completed}
                          onChange={() => handleCheckboxChange(lecture)} // Cập nhật trạng thái hoàn thành
                          className="mr-2"
                          disabled={lecture.completed} // Vô hiệu hóa nếu đã hoàn thành
                        />
                        <span
                          className={`text-sm ${
                            lecture.completed ? "line-through text-gray-400" : "text-gray-800"
                          }`}
                        >
                          {lecture.title}
                        </span>
                      </div>
                      {/* Biểu tượng trạng thái hoàn thành */}
                      <div className="text-green-500">
                        {lecture.completed ? <FaCheckCircle /> : <FaRegCircle />}
                      </div>
                    </div>
                  ))}
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
