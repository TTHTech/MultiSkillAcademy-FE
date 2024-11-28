import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const RecommendedCoursesList = () => {
  const [courses, setCourses] = useState([]);  // State để lưu danh sách khóa học
  const [loading, setLoading] = useState(true); // State để kiểm tra khi nào dữ liệu được tải về
  const scrollContainer = useRef(null);

  // Lấy danh sách khóa học từ API
  useEffect(() => {
    // Địa chỉ API bạn đã chỉ định trong backend
    axios
      .get("http://localhost:8080/api/student/courses/top-rated") // Gọi API lấy top-rated courses
      .then((response) => {
        setCourses(response.data);  // Lưu danh sách khóa học vào state
        setLoading(false);  // Đánh dấu là đã tải xong
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
        setLoading(false); // Cũng cần set loading là false nếu có lỗi
      });
  }, []);

  // Hàm cuộn sang trái
  const scrollLeft = () => {
    scrollContainer.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  // Hàm cuộn sang phải
  const scrollRight = () => {
    scrollContainer.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  // Nếu dữ liệu đang được tải
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Bạn cũng có thể thích</h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>

        {/* Horizontal scroll container */}
        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((course, index) => (
            <div key={index} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={course.imageUrls[0]} alt={course.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-700 font-medium">{course.instructorFirstName} {course.instructorLastName}</p>
                <div className="flex items-center text-yellow-500 mt-1">
                  <span>{course.rating}</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {/* Nếu không có reviews, hiển thị 999 */}
                    ({course.reviews ? course.reviews : 999})
                  </span>
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

export default RecommendedCoursesList;
