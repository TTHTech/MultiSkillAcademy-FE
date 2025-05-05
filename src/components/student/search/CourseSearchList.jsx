import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { encodeId } from '../../../utils/hash';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseSearchList = ({ searchQuery }) => {
  const [courses, setCourses] = useState([]); // List of courses
  const [loading, setLoading] = useState(true); // Loading state
  const [noCourses, setNoCourses] = useState(false); // No courses found
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const coursesPerPage = 5; // Number of courses per page

  // Fetch courses based on search query
  useEffect(() => {
    const fetchCourses = async () => {
      if (!searchQuery || searchQuery.trim() === "") {
        setNoCourses(true);
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${baseUrl}/api/student/courses/search`,
          {
            params: { query: searchQuery },
          }
        );

        console.log("API Search Response:", response.data);

        const fetchedCourses = response.data.courses || [];
        setCourses(fetchedCourses);
        setNoCourses(fetchedCourses.length === 0);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setNoCourses(true);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <div className="flex flex-col space-y-6">
      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : noCourses ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 min-h-screen">
          <p>
            Không tìm thấy khóa học nào phù hợp với từ khóa "{searchQuery}".
          </p>
          <Link to="/student/home">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Display course list */}
          <div className="grid grid-cols-1 gap-6">
            {currentCourses.map((course, index) => (
              <Link
                key={index}
                to={`/course/${encodeId(course.courseId)}`}
                className="w-full"
              >
                <CourseCard course={course} />
              </Link>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                Trước
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseSearchList;
