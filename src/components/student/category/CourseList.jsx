import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CourseList = ({ categoryId, filter }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCourses, setNoCourses] = useState(false); // State for no courses

  // Fetch courses based on categoryId
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/student/categories/${categoryId}/courses`);
        setCourses(response.data);
        setNoCourses(response.data.length === 0); // Check if no courses are available initially
      } catch (error) {
        console.error('Error fetching courses:', error);
        setNoCourses(true); // In case of an error, assume no courses
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryId]);

  // Filter courses based on the selected filters
  const filteredCourses = useCallback(() => {
    return courses.filter(course => {
      if (filter.level && course.level !== filter.level) return false;
      if (filter.priceRange && !isInPriceRange(course.price, filter.priceRange)) return false;
      if (filter.rating && course.rating < filter.rating) return false;
      return true;
    });
  }, [courses, filter]);

  useEffect(() => {
    // After filtering, check if there are no courses
    const filtered = filteredCourses();
    setNoCourses(filtered.length === 0);
  }, [filter, filteredCourses]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <p>Đang tải...</p>
      ) : noCourses ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 min-h-[200px]">
          <p>Không có khóa học nào phù hợp với bộ lọc của bạn.</p>
          {/* Button to go back to home */}
          <Link to="/student/home">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      ) : (
        filteredCourses().map((course, index) => (
          <CourseCard key={index} course={course} />
        ))
      )}
    </div>
  );
};

// Helper function to filter by price range
const isInPriceRange = (price, priceRange) => {
  const priceStr = String(price);  // Chuyển price thành chuỗi nếu không phải chuỗi
  const priceInt = parseInt(priceStr.replace(/[^\d]/g, ''));
  const [minPrice, maxPrice] = priceRange.split('-').map(val => parseInt(val.replace(/[^\d]/g, '')));
  return priceInt >= minPrice && priceInt <= maxPrice;
};

export default CourseList;
