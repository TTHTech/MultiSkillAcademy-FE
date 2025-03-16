import React, { useEffect, useState } from "react";
import axios from "axios";

const ScoreTable = () => {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [courses, setCourses] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    studentName: "",
    courseName: "",
    minScore: "",
    maxScore: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCoursesAndScores = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedCourses = response.data;
        setCourses(fetchedCourses);
        const courseIds = fetchedCourses.map((course) => course.courseId);
        const testPromises = courseIds.map((courseId) =>
          fetch(
            `http://localhost:8080/api/student/scores/details/course/${courseId}`
          ).then((response) => response.json())
        );
        const scoresData = await Promise.all(testPromises);
        const aggregatedScores = scoresData.flat();
        setScores(aggregatedScores);
        setFilteredScores(aggregatedScores);
      } catch (error) {
        console.error("Error fetching courses or scores:", error);
      }
    };

    fetchCoursesAndScores();
  }, [userId, token]);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if ((name === "minScore" || name === "maxScore") && value !== "") {
      const numericValue = Math.max(1, Math.min(10, parseFloat(value)));
      setFilters({ ...filters, [name]: numericValue });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };
  useEffect(() => {
    const filtered = scores.filter((score) => {
      const fullName = `${score.firstName} ${score.lastName}`.toLowerCase();
      const matchesName =
        !filters.studentName ||
        fullName.includes(filters.studentName.toLowerCase());
      const matchesCourse =
        !filters.courseName ||
        score.nameCourse
          .toLowerCase()
          .includes(filters.courseName.toLowerCase());
      const matchesScore =
        (!filters.minScore || score.score >= parseFloat(filters.minScore)) &&
        (!filters.maxScore || score.score <= parseFloat(filters.maxScore));

      return matchesName && matchesCourse && matchesScore;
    });

    setFilteredScores(filtered);
    setCurrentPage(1);
  }, [filters, scores]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredScores.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-100 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Student Scores
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Student Name",
              name: "studentName",
              type: "text",
              placeholder: "Enter student name",
            },
            {
              label: "Course Name",
              name: "courseName",
              type: "text",
              placeholder: "Enter course name",
            },
            {
              label: "Min Score (1-10)",
              name: "minScore",
              type: "number",
              placeholder: "Min score",
              min: 1,
              max: 10,
            },
            {
              label: "Max Score (1-10)",
              name: "maxScore",
              type: "number",
              placeholder: "Max score",
              min: 1,
              max: 10,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-800 text-sm font-bold mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={filters[field.name]}
                onChange={handleFilterChange}
                min={field.min}
                max={field.max}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md text-sm font-semibold
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                   transition-all duration-200"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-4 py-3 text-sm font-semibold">Student Name</th>
              <th className="px-4 py-3 text-sm font-semibold">Course Name</th>
              <th className="px-4 py-3 text-sm font-semibold">Test Name</th>
              <th className="px-4 py-3 text-sm font-semibold">Score</th>
              <th className="px-4 py-3 text-sm font-semibold">Test Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((score, index) => (
              <tr
                key={score.id}
                className={`text-gray-700 text-sm ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-100 transition-all`}
              >
                <td className="px-4 py-3">
                  {score.firstName} {score.lastName}
                </td>
                <td className="px-4 py-3">{score.nameCourse}</td>
                <td className="px-4 py-3">{score.nameTest}</td>
                <td className="px-4 py-3 font-semibold text-center">
                  {score.score}
                </td>
                <td className="px-4 py-3 text-center">
                  {new Date(score.testDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-1 px-3 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
            }`}
          >
            Previous
          </button>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="mx-1 px-3 py-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-2 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-1 px-3 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreTable;
