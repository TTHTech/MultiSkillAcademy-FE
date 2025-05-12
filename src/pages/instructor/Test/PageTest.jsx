import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import TestDetailsModal from "./TestDetailsModal";
import AddTestForm from "./AddTestForm";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TestList = () => {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [open, setOpen] = useState(true);
  const [showAddTestForm, setShowAddTestForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseUrl}/api/instructor/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);

        const courseIds = response.data.map((course) => course.courseId);
        const testPromises = courseIds.map((courseId) =>
          axios.get(`${baseUrl}/api/instructor/course/test/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );

        Promise.all(testPromises)
          .then((results) => {
            const allTests = results.flatMap((result, index) =>
              result.data.map((test) => ({
                ...test,
                courseTitle: response.data[index].title,
              }))
            );
            setTests(allTests);
            setFilteredTests(allTests);
            setLoading(false);
          })
          .catch((error) => console.error("Error fetching tests:", error));
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [userId, token]);

  const handleFilterByCourse = (e) => {
    const selectedCourseId = e.target.value;
    if (selectedCourseId) {
      const filtered = tests.filter(
        (test) => test.courseId === selectedCourseId
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(tests);
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword) {
      const filtered = tests.filter((test) =>
        test.title.toLowerCase().includes(keyword)
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(tests);
    }
  };

  const handleViewTestDetails = (testId) => {
    axios
      .get(`${baseUrl}/api/instructor/test/${testId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSelectedTest(response.data);
      })
      .catch((error) => console.error("Error fetching test details:", error));
  };

  const handleAddTest = (newTest) => {
    setTests([...tests, newTest]);
    setFilteredTests([...filteredTests, newTest]);
  };

  return (
    <section
      className={`flex-1 m-4 p-6 transition-all font-medium text-gray-900 ${
        open ? "ml-72" : "ml-16"
      } bg-gradient-to-b from-gray-100 to-gray-100 rounded-xl`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="p-8">
        {loading && (
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">
            Danh sách bài kiểm tra
          </h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
            onClick={() => setShowAddTestForm(true)}
          >
            Thêm bài kiểm tra
          </button>
        </div>

        {showAddTestForm && (
          <AddTestForm
            onClose={() => setShowAddTestForm(false)}
            onTestAdded={handleAddTest}
            courses={courses}
          />
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lọc theo khóa học:
            </label>
            <select
              className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={handleFilterByCourse}
            >
              <option value="">-- Tất cả khóa học --</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tìm bài kiểm tra:
            </label>
            <input
              type="text"
              placeholder="Nhập tên bài kiểm tra..."
              className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => {
            const hasInvalidQuestions = test.questions.some((q) => {
              const correctAnswersCount = q.answers.filter(
                (a) => a.isCorrect
              ).length;
              return correctAnswersCount === 0 || correctAnswersCount > 1;
            });
            const testBgColor = hasInvalidQuestions ? "bg-red-100" : "bg-white";
            return (
              <div
                key={test.id}
                className={`p-6 ${testBgColor} rounded-xl shadow-md hover:shadow-xl border transition-all cursor-pointer`}
                onClick={() => handleViewTestDetails(test.id)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {test.title}
                </h2>
                <p className="text-sm text-gray-600">{test.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Khóa học:</strong> {test.courseTitle}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Số câu hỏi:</strong> {test.questionCount} |{" "}
                  <strong>Thời gian:</strong> {test.duration} phút
                </p>
              </div>
            );
          })}
        </div>
        <TestDetailsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          open={open}
        />
      </div>
    </section>
  );
};

export default TestList;
