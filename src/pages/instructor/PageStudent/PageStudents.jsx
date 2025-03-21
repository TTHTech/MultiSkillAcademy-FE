import { useEffect, useState } from "react";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import axios from "axios";
import moment from "moment";
import CourseFilter from "./CourseFilter";

const userId = Number(localStorage.getItem("userId"));
const StudentList = () => {
  const [open, setOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
  const [emailContent, setEmailContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const handlePageChange = (newPage) => {
    if (
      newPage > 0 &&
      newPage <= Math.ceil(filteredStudents.length / studentsPerPage)
    ) {
      setCurrentPage(newPage);
    }
  };
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
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
      await axios.post(
        "http://localhost:8080/api/instructor/send-email",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/instructor/students/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleFilterChange = (filteredData) => {
    setFilteredStudents(filteredData);
    setCurrentPage(1); // Reset về trang đầu khi lọc
  };

  const getProgressColor = (progress) => {
    if (progress <= 40) return "bg-red-500";
    if (progress <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      }
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Student List</h1>

        <CourseFilter students={students} onFilterChange={handleFilterChange} />

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-400 text-white">
              <tr>
                <th className="py-3 px-6 text-left">STT</th>
                <th className="py-3 px-6 text-left">Full Name</th>
                <th className="py-3 px-6 text-left">
                  Email (Click to send email)
                </th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Course</th>
                <th className="py-3 px-6 text-left">Enrolled At</th>
                <th className="py-3 px-6 text-left">Progress</th>
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
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-4 py-2 mx-1">
                  ...
                </span>
              ) : (
                <button
                  key={index}
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
            <div className="absolute inset-0 bg-gray-300 bg-opacity-75 flex items-center justify-center z-60">
              <p className="text-xl font-bold text-gray-700 animate-pulse">
                Sending email, please wait...
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StudentList;
