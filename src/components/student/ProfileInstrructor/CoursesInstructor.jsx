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
          const originalPrice = Math.floor(course.price);
          const discount = course.discount;
          const discountedPrice = Math.floor(
            originalPrice * (1 - discount / 100)
          );

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
      // Scroll to top of courses section
      window.scrollTo({ top: document.getElementById('courses-section').offsetTop - 100, behavior: 'smooth' });
    }
  };

  // Skeleton loader for courses
  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-56 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 inline-block mx-auto max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Đã xảy ra lỗi
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block p-6 rounded-lg border border-gray-200 bg-white shadow-md">
          <div className="text-gray-400 text-5xl mb-4">
            <i className="fas fa-book-open"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-gray-600">
            Giảng viên này chưa đăng tải khóa học nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section id="courses-section" className="py-8">
      <div className="max-w-screen-xl mx-auto">
        {/* Course Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCourses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={course.imageUrls?.[0] || "https://via.placeholder.com/640x360/f3f4f6/94a3b8?text=Khoá+Học"}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    {/* Tags */}
                    <div className="flex gap-2">
                      {course.isNew && (
                        <span className="inline-flex items-center bg-teal-500 text-white text-xs px-3 py-1 rounded-full">
                          <i className="fas fa-certificate mr-1"></i>
                          Mới
                        </span>
                      )}
                      {course.tag && (
                        <span className={`inline-flex items-center ${course.tag === 'Bestseller' ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs px-3 py-1 rounded-full`}>
                          <i className={`fas ${course.tag === 'Bestseller' ? 'fa-award' : 'fa-fire'} mr-1`}></i>
                          {course.tag}
                        </span>
                      )}
                    </div>
                    
                    {/* Rating */}
                    {course.rating && (
                      <div className="flex items-center bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                        <span className="font-medium text-gray-800">{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mt-2 flex items-center">
                  <i className="fas fa-user-tie mr-2 text-gray-500"></i>
                  {course.instructorFirstName} {course.instructorLastName}
                </p>
                
                <div className="mt-3 flex items-center justify-between">
                  {/* Price */}
                  <div>
                    <p className="text-blue-600 font-bold text-lg">
                      {course.discountedPrice.toLocaleString("vi-VN")}đ
                    </p>
                    {course.discount > 0 && (
                      <div className="flex items-center mt-1">
                        <span className="text-gray-500 text-sm line-through mr-2">
                          {course.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                          -{course.discount}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Course info */}
                  <div className="flex flex-col items-end text-xs text-gray-500">
                    {course.totalLessons && (
                      <span className="flex items-center">
                        <i className="fas fa-play-circle mr-1"></i>
                        {course.totalLessons} bài học
                      </span>
                    )}
                    {course.totalDuration && (
                      <span className="flex items-center mt-1">
                        <i className="fas fa-clock mr-1"></i>
                        {course.totalDuration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Course hover effect */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <i className="fas fa-users mr-2 text-gray-500"></i>
                  {course.enrolledCount || 0} học viên
                </span>
                <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Xem chi tiết
                  <i className="fas fa-arrow-right ml-1 text-xs"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <i className="fas fa-chevron-left mr-1 text-xs"></i>
              Trước
            </button>
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                // Show first page, last page, and pages around current page
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white font-medium shadow-md'
                          : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === 2 && currentPage > 3) ||
                  (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  // Show ellipsis for gaps
                  return (
                    <span
                      key={index}
                      className="w-10 h-10 flex items-center justify-center text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              Sau
              <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesInstructor;