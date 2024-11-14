import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom
import axios from "axios";

const SuggestedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student/courses/active");
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
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
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Lĩnh vực sẽ học tiếp theo</h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>

        <div ref={scrollContainer} className="flex space-x-4 overflow-x-scroll no-scrollbar">
          {courses.map((course, index) => (
            <Link to={`/course/${course.courseId}`} key={index} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={course.imageUrls?.[0] || "default-image-url.jpg"} alt={course.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-800 font-medium">
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                <div className="flex items-center text-yellow-500 mt-2">
                  <span className="text-lg font-semibold">{course.rating}</span>
                  <i className="fas fa-star text-sm ml-1"></i> {/* Biểu tượng ngôi sao nhỏ hơn và thẳng hàng */}
                  <span className="ml-2 text-sm text-gray-600">({course.reviews || 999})</span>
                </div>


                <p className="text-lg font-bold text-gray-900 mt-2">đ {course.price}</p>
              </div>
            </Link>
          ))}
        </div>

        <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full">
          <i className="fas fa-chevron-right text-gray-800"></i>
        </button>
      </div>
    </section>
  );
};

export default SuggestedCoursesSection;