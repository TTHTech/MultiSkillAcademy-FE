import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CoursesInstructor = ({ id }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/student/courses/instructor/${id}`);
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random());
        const updatedCourses = shuffledCourses.map(course => {
          const originalPrice = course.price || 500000;
          const discount = course.discount || 30;
          const discountedPrice = Math.floor(originalPrice * (1 - (discount / 100)));

          return {
            ...course,
            originalPrice,
            discount,
            discountedPrice,
            tag: course.rating >= 4.5 ? 'Bestseller' : 'Hot',
            isNew: course.createdAt && new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
        });
        setCourses(updatedCourses);
      } catch (err) {
        setError("Không thể tải dữ liệu khóa học.");
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [id]);

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const currentCourses = courses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Đang tải khóa học...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <section className="py-16 px-6 bg-white-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {currentCourses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="block bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src={course.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={course.title}
                  className="w-full h-56 object-cover rounded-t-lg"
                />
                {course.isNew && (
                  <div className="absolute top-2 right-2 bg-teal-500 text-white text-sm px-3 py-1 rounded-full">
                    Mới
                  </div>
                )}
                {course.tag && (
                  <div className={`absolute bottom-2 left-2 bg-${course.tag === 'Bestseller' ? 'yellow' : 'red'}-500 text-white text-sm px-3 py-1 rounded-full`}>
                    {course.tag}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                <p className="text-yellow-600 font-bold text-lg mt-2">
                  đ{course.discountedPrice.toLocaleString("vi-VN")}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 mx-2 border rounded-full text-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-6 py-2 mx-2 border rounded-full text-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-transparent text-blue-600 hover:bg-blue-100'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 mx-2 border rounded-full text-lg ${currentPage === totalPages ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesInstructor;
