import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';

const CourseList = ({ categoryId, filter }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCourses, setNoCourses] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/student/categories/${categoryId}/courses`);
        setCourses(response.data);
        setNoCourses(response.data.length === 0);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setNoCourses(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryId]);

  const filteredCourses = useCallback(() => {
    return courses.filter(course => {
      if (filter.level && course.level !== filter.level) return false;
      if (filter.priceRange && !isInPriceRange(course.price, filter.priceRange)) return false;
      if (filter.rating && course.rating < filter.rating) return false;
      return true;
    });
  }, [courses, filter]);

  useEffect(() => {
    const filtered = filteredCourses();
    setNoCourses(filtered.length === 0);
  }, [filter, filteredCourses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses().slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCourses().length / coursesPerPage);

  return (
    <div className="flex flex-col space-y-6 from-yellow-50 to-purple-100">
      {loading ? (
        <p>Đang tải...</p>
      ) : noCourses ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 min-h-screen">
          <p>Không có khóa học nào phù hợp với bộ lọc của bạn.</p>
          <Link to="/student/home">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      ) : (
        <>
          {currentCourses.map((course, index) => (
            <Link key={index} to={`/course/${course.courseId}`} className="w-full">
              <CourseCard course={course} />
            </Link>
          ))}

          {/* Pagination controls */}
          <div className="flex justify-center items-center mt-6">
            {/* Previous Button */}
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
            >
              Trước
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md mx-2 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const isInPriceRange = (price, priceRange) => {
  const priceStr = String(price);
  const priceInt = parseInt(priceStr.replace(/[^\d]/g, ''));
  const [minPrice, maxPrice] = priceRange.split('-').map(val => parseInt(val.replace(/[^\d]/g, '')));
  return priceInt >= minPrice && priceInt <= maxPrice;
};

export default CourseList;
