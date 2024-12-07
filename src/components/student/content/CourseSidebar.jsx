import React, { useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const CourseSidebar = ({
  course,
  selectedSection,
  setSelectedSection,
  handleLectureClick,
  handleCheckboxChange,
  calculateCompletedLectures,
}) => {
  const [selectedLecture, setSelectedLecture] = useState(null); // State lưu trữ bài học được chọn

  if (!course) {
    return <div>Loading...</div>; // Hiển thị khi chưa có dữ liệu
  }

  const { title, sections } = course;

  const handleSectionClick = (section) => {
    setSelectedSection(selectedSection === section ? null : section);
  };

  const handleLectureItemClick = (lecture) => {
    // Đánh dấu bài học đã được chọn
    setSelectedLecture(selectedLecture === lecture ? null : lecture);
    handleLectureClick(lecture); // Gọi hàm xử lý khi nhấn vào bài học
  };

  return (
    <div className="w-1/4 bg-white p-6 border-r h-screen flex flex-col shadow-xl rounded-lg">
      {/* Phần Tiến độ học tập */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">Tiến độ học tập</h2>
        <div className="mt-4">
          {sections && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng số bài học:</span>
              <span className="text-blue-600 font-semibold">
                {sections.reduce((acc, section) => acc + section.lectures.length, 0)}
              </span>
            </div>
          )}
          <div className="mt-2">
            <span className="text-gray-600">Hoàn thành:</span>
            <span className="text-green-600 font-semibold">
              {sections.reduce((acc, section) => acc + calculateCompletedLectures(section.lectures), 0)}{" "}
              /{" "}
              {sections.reduce((acc, section) => acc + section.lectures.length, 0)} bài học
            </span>
          </div>
        </div>
      </div>

      <hr className="my-6 border-t-2 border-gray-200" />

      {/* Phần Danh sách bài học */}
      <div className="mb-6 flex-1 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách bài học</h2>
        <div className="mt-4 space-y-6">
          {sections &&
            sections.map((section) => (
              <div
                key={section.section_id}
                className="hover:bg-gray-50 rounded-lg transition duration-200 ease-in-out"
              >
                <h3
                  className="text-md font-semibold text-gray-700 cursor-pointer hover:text-blue-600 flex justify-between items-center py-2"
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="flex items-center space-x-2">
                    <FaRegCircle className="text-gray-400" />
                    <span>{section.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {calculateCompletedLectures(section.lectures)}/{section.lectures.length}
                  </span>
                </h3>

                {/* Đường gạch ngang phân cách giữa các phần */}
                <hr className="my-4 border-t-1 border-gray-300" />

                {selectedSection === section && (
                  <ul className="mt-4 space-y-3 pl-6">
                    {section.lectures.map((lecture) => (
                      <li
                        key={lecture.lecture_id}
                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-all duration-300 ease-in-out ${
                          lecture.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        } hover:bg-blue-100 hover:text-blue-700 ${
                          selectedLecture === lecture ? "bg-blue-200" : "" // Thêm lớp màu khi bài học được chọn
                        }`}
                        onClick={() => handleLectureItemClick(lecture)}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={lecture.completed}
                            className="mr-3"
                            disabled={lecture.completed}
                            onChange={() => handleCheckboxChange(lecture)}
                          />
                          <span className="font-medium">{lecture.title}</span>
                        </div>
                        <span className="text-sm">{lecture.duration}</span>
                        <span className="ml-2">
                          {lecture.completed ? (
                            <FaCheckCircle className="text-green-400" />
                          ) : (
                            <FaRegCircle className="text-gray-400" />
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
