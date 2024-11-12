import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const TopPythonCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchPythonCourses = async () => {
      try {
        // Fetch only Python-related courses
        const response = await axios.get("http://localhost:8080/api/student/courses/python");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch Python courses", error);
      }
    };

    fetchPythonCourses();
  }, []);

  const scrollLeft = () => {
    scrollContainer.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainer.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Các khóa học hàng đầu về <a href="#" className="text-purple-600 underline">Lập trình Python</a>
      </h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>

        {/* Horizontal scroll container without scrollbars */}
        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((course, index) => (
            <div key={index} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              {/* Display only the first image */}
              <img
                src={course.imageUrls && course.imageUrls.length > 0 ? course.imageUrls[0] : "default-image-url.jpg"}
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-800 font-medium">
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                <div className="flex items-center text-yellow-500 mt-2">
                  <span>{course.rating}</span>
                  <span className="ml-2 text-sm text-gray-600">({course.reviews || 0})</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-2">{course.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-right text-gray-800"></i>
        </button>
      </div>
    </section>
  );
};

export default TopPythonCoursesSection;
