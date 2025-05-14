import { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import axios from "axios";
import moment from "moment";
import CourseFilter from "./CourseFilter";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const StudentList = () => {
  const [open, setOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const userId = Number(localStorage.getItem("userId"));
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredStudents.length / studentsPerPage)),
    [filteredStudents]
  );
  const indexOfFirstStudent = (currentPage - 1) * studentsPerPage;
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * studentsPerPage;
    return filteredStudents.slice(start, start + studentsPerPage);
  }, [filteredStudents, currentPage]);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEmailClick = (email) => {
    setSelectedStudentEmail(email);
    setIsModalOpen(true);
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", selectedStudentEmail);
    formData.append("content", emailContent);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.post(`${baseUrl}/api/instructor/send-email`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/instructor/students/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setIsLoading(false);
        setStudents(response.data);
        setFilteredStudents(response.data);
        setCurrentPage(1);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleFilterChange = useCallback((data) => {
    setFilteredStudents(data);
    setCurrentPage(1);
  }, []);

  const getProgressColor = (progress) => {
    if (progress <= 40) return "bg-red-500";
    if (progress <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(1, currentPage - 2);
      const right = Math.min(totalPages, currentPage + 2);
      if (left > 1) pages.push(1, "...");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <section
      className={`flex-1 min-h-screen bg-gradient-to-b from-green-100 to-blue-200 duration-300 ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} />

      <div className="container mx-auto p-6">
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center">
              <div className="relative flex flex-col items-center bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl">
                <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-semibold text-lg animate-pulse">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh Sách Học Viên</h1>

        <CourseFilter students={students} onFilterChange={handleFilterChange} />

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="py-3 px-6 text-left">STT</th>
                <th className="py-3 px-6 text-left">Tên học viên</th>
                <th className="py-3 px-6 text-left">
                  Email (Chọn email để gởi)
                </th>
                <th className="py-3 px-6 text-left">SĐT</th>
                <th className="py-3 px-6 text-left">Khóa học</th>
                <th className="py-3 px-6 text-left">Ngày đăng ký</th>
                <th className="py-3 px-6 text-left">Tiến độ</th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={student.studentId}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6">
                    {indexOfFirstStudent + index + 1}
                  </td>
                  <td className="py-4 px-6 font-medium">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => handleEmailClick(student.email)}>
                      {student.email}
                    </button>
                  </td>
                  <td className="py-4 px-6">{student.phoneNumber || "N/A"}</td>
                  <td className="py-4 px-6">{student.courseName}</td>
                  <td className="py-4 px-6">
                    {moment(student.enrolled_at).format("DD-MM-YYYY")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`${getProgressColor(
                          student.progress
                        )} h-4 rounded-full`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {student.progress}%
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-1 rounded-lg shadow-md border transition-all ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              }`}
            >
              Trang trước
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={idx} className="px-4 py-2 mx-1">
                  …
                </span>
              ) : (
                <button
                  key={idx}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 mx-1 rounded-lg shadow-md border transition-all ${
                    currentPage === page
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white border-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 mx-1 rounded-lg shadow-md border transition-all ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg transform transition-transform duration-300 ease-in-out">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Send Email to {selectedStudentEmail}
            </h3>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter your message"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="9"
            ></textarea>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="mb-4 text-sm text-gray-500 file:mr-5 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSendEmail}
                disabled={isLoading}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Send Email
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
                <p className="mt-4 text-blue-500 text-xl font-bold">
                  Sending email, please wait...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StudentList;
