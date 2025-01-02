import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CoursesCard from "./CoursesCard"; // Import CoursesCard component

const TopMusicCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollContainer = useRef(null);
  const navigate = useNavigate();

  const categoryId = "CAT010"; // ID danh mục cho âm nhạc

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/courses/category/${categoryId}`
        );
        const { categoryName, courses } = response.data;
        setCategoryName(categoryName);
        setCourses(courses);
      } catch (err) {
        setError("Không thể tải dữ liệu các khóa học âm nhạc.");
        console.error("Failed to fetch courses for music category", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const courseWidth = 250;
  const visibleCourses = 5;
  const scrollAmount = courseWidth * visibleCourses;

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="p-6 bg-gradient-to-r from-yellow-50 to-purple-100 w-[1500px] mt-12 mb-8 mx-auto">
      {/* Title */}
      <div className="text-left mb-6 ">
        <h2
          className="text-2xl font-bold text-gray-900 cursor-pointer"
          onClick={() => navigate(`/category/${categoryId}`)}
        >
          Các Khóa Học Hàng Đầu Về{" "}
          <span className="text-blue-500">
            Nghệ Thuật và{categoryName && ` ${categoryName}`}
          </span>
        </h2>
      </div>

      {/* Loading/Error Message */}
      {loading && <p className="text-center text-gray-500">Đang tải...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Courses List */}
      {!loading && !error && (
        <div className="relative w-full mx-auto" style={{ maxWidth: "1500px" }}>
          {/* Left scroll button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-md rounded-full hover:bg-gray-200 transition-all"
          >
            <i className="fas fa-chevron-left text-gray-700"></i>
          </button>

          {/* Courses container */}
          <div
            ref={scrollContainer}
            className="flex space-x-4 overflow-hidden"
            style={{
              scrollBehavior: "smooth",
              maxWidth: "100%",
              overflowY: "hidden",
            }}
          >
            {courses.map((course, index) => (
              <CoursesCard key={index} course={course} />
            ))}
          </div>

          {/* Right scroll button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-md rounded-full hover:bg-gray-200 transition-all"
          >
            <i className="fas fa-chevron-right text-gray-700"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default TopMusicCoursesSection;
