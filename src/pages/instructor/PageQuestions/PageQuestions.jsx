import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import Question from "../../../components/instructor/QuestionsAndAnswers/Questions";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseQuestionsTable = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newQuestions");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(true);
  const itemsPerPage = 12;
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/api/instructor/course-questions/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token]);

  useEffect(() => {
    const results = courses.filter((course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(results);
  }, [searchTerm, courses]);

  const handleSort = (key) => {
    const sortedCourses = [...filteredCourses].sort((a, b) => {
      if (key === "newQuestions" || key === "questionNoAnswers") {
        return b[key] - a[key];
      }
      return a[key].localeCompare(b[key]);
    });
    setFilteredCourses(sortedCourses);
    setSortOption(key);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleRowClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <section
      className={`flex-1 p-6 transition-all duration-300 font-medium text-gray-800 ${
        open ? "ml-72" : "ml-16"
      } bg-gradient-to-b from-gray-50 to-gray-100`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Hỏi Đáp Của Khóa Học
        </h1>
        {loading && (
          <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center -mt-12">
              <div className="relative flex flex-col items-center bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl">
                <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-semibold text-lg animate-pulse">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-1/3 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div className="flex items-center space-x-2">
            <label className="font-medium">Sắp xếp theo:</label>
            <select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="newQuestions">Câu hỏi mới nhất</option>
              <option value="questionNoAnswers">
                Câu hỏi chưa được trả lời
              </option>
              <option value="courseName">Tên khóa học</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-6 py-3 text-left">
                  STT
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Hình ảnh
                </th>
                <th className="border border-gray-300 px-6 py-3 text-left">
                  Tên khóa học
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Tổng số câu hỏi
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Số câu hỏi chưa trả lời
                </th>
                <th className="border border-gray-300 px-6 py-3 text-center">
                  Ngày câu hỏi mới nhất
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((course, index) => (
                <tr
                  key={course.courseId}
                  className="hover:bg-gray-50"
                  onClick={() => handleRowClick(course)}
                >
                  <td className="border border-gray-300 px-6 py-3 text-left">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-left">
                    <img
                      src={course.courseIamge}
                      alt={course.courseName}
                      className="h-24 w-44 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-left">
                    {course.courseName}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    {course.totalQuestion}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    {course.questionNoAnswers}
                  </td>
                  <td className="border border-gray-300 px-6 py-3 text-center">
                    {new Date(course.newQuestions).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ${
              open ? "pl-72" : "pl-16"
            }`}
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-[60vw] shadow-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Câu hỏi của khóa học {selectedCourse.courseName}
              </h2>
              <Question courseId={selectedCourse.courseId} />
              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300 hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg shadow-sm transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Trước
          </button>
          <span className="text-gray-700 font-medium">
            Trang {currentPage} của {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg shadow-sm transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseQuestionsTable;
