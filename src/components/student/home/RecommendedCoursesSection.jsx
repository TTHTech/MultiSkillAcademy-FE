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
    <section className="p-6 bg-gray-50">
      <div className="pl-50"> {/* Thêm padding-left cho tiêu đề */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900"> 
          Được Đề Xuất Dựa Trên Xếp Hạng
        </h2>
      </div>
      <div className="relative px-50"> {/* Thêm padding-x cho container khóa học */}
        {/* Nút cuộn trái */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white shadow-md rounded-full hover:bg-gray-200 transition-all" 
        >
          <i className="fas fa-chevron-left text-gray-700"></i>
        </button>

        {/* Container khóa học */}
        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-x-scroll no-scrollbar scroll-smooth" 
          style={{ scrollbarWidth: "none" }} 
        >
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Ảnh khóa học */}
              <img
                src={course.imageUrls?.[0] || "default-image-url.jpg"}
                alt={course.title}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                {/* Tiêu đề khóa học */}
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {course.title}
                </h3>
                {/* Giảng viên */}
                <p className="text-sm text-gray-800 font-medium mb-2">
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                {/* Đánh giá */}
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
                    ({course.reviews || 999})
                  </span>
                </div>
                {/* Giá */}
                <p className="text-lg font-bold text-gray-900">
                  đ {course.price.toLocaleString("vi-VN")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Nút cuộn phải */}
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