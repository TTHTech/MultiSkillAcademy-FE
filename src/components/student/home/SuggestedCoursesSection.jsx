import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import CoursesCard from './CoursesCard';

const SuggestedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student/courses/active");
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random());
        setCourses(shuffledCourses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
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
      <div className="text-left mb-6 ">
        <h2 className="text-2xl font-bold text-gray-900">
          Được Đề Xuất Dành Cho Bạn
        </h2>
      </div>

      <div className="relative w-full mx-auto max-w-[1500px]">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-md rounded-full hover:bg-gray-200 transition-all"
        >
          <i className="fas fa-chevron-left text-gray-700"></i>
        </button>

        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-hidden"
          style={{
            scrollBehavior: "smooth",
            width: "100%",
            maxWidth: "1500px",
            overflowY: "hidden",
          }}
        >
          {courses.map((course, index) => (
            <CoursesCard key={index} course={course} />
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-md rounded-full hover:bg-gray-200 transition-all"
        >
          <i className="fas fa-chevron-right text-gray-700"></i>
        </button>
      </div>
    </section>
  );
};

export default SuggestedCoursesSection;