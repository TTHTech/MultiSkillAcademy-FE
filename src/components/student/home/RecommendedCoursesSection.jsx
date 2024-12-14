import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RecommendedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student/courses/top-rated");
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random()); // Shuffle courses
        setCourses(shuffledCourses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []);

  const courseWidth = 250; // Width of each course card
  const visibleCourses = 5; // Number of courses visible at a time
  const scrollAmount = courseWidth * visibleCourses; // Scroll amount per click

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
    <section className="p-6 bg-gray-50 w-full mb-[30px]">
      {/* Title */}
      <div className="text-left mb-6 ml-[70px] mb-[30px]">
        <h2 className="text-2xl font-bold text-gray-900">Được đề xuất cho bạn dựa trên xếp hạng</h2>
      </div>

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
            width: "1500px", // Container width set to 1500px
            overflowY: "hidden", // Hide vertical scroll
          }}
        >
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="w-[250px] flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Course image */}
              <img
                src={course.imageUrls?.[0] || "default-image-url.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                {/* Course title */}
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                {/* Instructor */}
                <p className="text-sm text-gray-800 font-medium mb-2">
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                {/* Ratings */}
                <div className="flex items-center mb-2">
                  <span className="text-lg font-semibold text-gray-900 mr-1">
                    {course.rating}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < Math.round(course.rating)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        style={{ fontSize: "14px" }}
                      ></i>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({course.reviews || course.numberReview})
                  </span>
                </div>
                {/* Price */}
                <p className="text-lg font-bold text-gray-900">
                  đ {course.price.toLocaleString("vi-VN")}
                </p>
              </div>
            </Link>
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
    </section>
  );
};

export default RecommendedCoursesSection;
