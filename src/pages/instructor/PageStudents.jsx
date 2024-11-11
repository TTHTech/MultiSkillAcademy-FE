import { useEffect, useState } from "react";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";
import axios from "axios";
import moment from "moment";

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
      .get("http://localhost:8080/api/instructor/students/1")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const courseOptions = Array.from(
    new Set(students.map((student) => student.courseName))
  );

  useEffect(() => {
    if (selectedCourse) {
      const filtered = students.filter(
        (student) => student.courseName === selectedCourse
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [selectedCourse, students]);

  const getProgressColor = (progress) => {
    if (progress <= 40) return "bg-red-500";
    if (progress <= 75) return "bg-yellow-500";
    return "bg-green-500";
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

        <div className="mb-4">
          <select
            className="block appearance-none bg-white py-2 pl-3 pr-8 text-sm font-medium text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedCourse(e.target.value)}
            value={selectedCourse}
          >
            <option value="">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

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
              {(filteredStudents.length > 0 ? filteredStudents : students).map(
                (student, index) => (
                  <tr
                    key={student.studentId}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-4 px-6">{index + 1}</td>
                    <td className="py-4 px-6 font-medium">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-4 px-6">
                      <button onClick={() => handleEmailClick(student.email)}>
                        {student.email}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      {student.phoneNumber || "N/A"}
                    </td>
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
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
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
