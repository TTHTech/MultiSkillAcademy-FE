import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import TestDetailsModal from "./TestDetailsModal";
import AddTestForm from "./AddTestForm";

const TestList = () => {
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [open, setOpen] = useState(true);
  const [showAddTestForm, setShowAddTestForm] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/instructor/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);

        const courseIds = response.data.map((course) => course.courseId);
        const testPromises = courseIds.map((courseId) =>
          axios.get(`http://localhost:8080/api/instructor/course/test/${courseId}`, {
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
          })
          .catch((error) => console.error("Error fetching tests:", error));
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, [userId, token]);

  const handleFilterByCourse = (e) => {
    const selectedCourseId = e.target.value;
    if (selectedCourseId) {
      const filtered = tests.filter((test) => test.courseId === selectedCourseId);
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
      .get(`http://localhost:8080/api/instructor/test/${testId}`, {
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
      } bg-gradient-to-b from-gray-50 to-blue-50 shadow-lg rounded-xl`}
    >
      <Sidebar open={open} setOpen={setOpen} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">Danh sách bài kiểm tra</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
            onClick={() => setShowAddTestForm(true)}
          >
            Thêm bài kiểm tra
          </button>
        </div>

        {/* Add Test Form */}
        {showAddTestForm && (
          <AddTestForm
            onClose={() => setShowAddTestForm(false)}
            onTestAdded={handleAddTest}
            courses={courses}
          />
        )}

        {/* Course Filter */}
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

          {/* Test Search */}
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

        {/* Test List */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl border transition-all cursor-pointer"
              onClick={() => handleViewTestDetails(test.id)}
            >
              <h2 className="text-lg font-semibold text-gray-800">{test.title}</h2>
              <p className="text-sm text-gray-600">{test.description}</p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Khóa học:</strong> {test.courseTitle}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Số câu hỏi:</strong> {test.questionCount} |{" "}
                <strong>Thời gian:</strong> {test.duration} phút
              </p>
            </div>
          ))}
        </div>

        {/* Test Details Modal */}
        <TestDetailsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      </div>
    </section>
  );
};

export default TestList;
