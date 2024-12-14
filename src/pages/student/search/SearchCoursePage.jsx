import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../../../components/student/common/NavBar';
import Footer from '../../../components/student/common/Footer';
import CourseSearchList from '../../../components/student/search/CourseSearchList';
import CourseFilter from '../../../components/student/category/CourseFilter';
import axios from 'axios';

const SearchCoursePage = () => {
  const location = useLocation(); // Lấy query từ URL
  const [filter, setFilter] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noCourses, setNoCourses] = useState(false);

  const query = new URLSearchParams(location.search).get('query'); // Lấy `query` từ URL

  // Fetch courses based on the search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setNoCourses(true);
        setCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/student/courses/search', {
          params: { query },
        });

        const fetchedCourses = response.data.courses || [];
        setCourses(fetchedCourses); // Assuming API returns `courses` array
        setNoCourses(fetchedCourses.length === 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setNoCourses(true);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Filter the courses
  const filteredCourses = useCallback(() => {
    return courses.filter((course) => {
      if (filter.level && course.level !== filter.level) return false;
      if (filter.priceRange && !isInPriceRange(course.price, filter.priceRange)) return false;
      if (filter.rating && course.rating < filter.rating) return false;
      return true;
    });
  }, [courses, filter]);

  useEffect(() => {
    setNoCourses(filteredCourses().length === 0);
  }, [filter, filteredCourses]);

  // Handle filter changes
  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto">
      <NavBar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {query ? `Kết quả tìm kiếm cho: "${query}"` : 'Kết quả tìm kiếm'}
        </h1>

        <div className="flex space-x-6">
          {/* Bộ lọc bên trái */}
          <div className="w-1/4">
            <CourseFilter onFilter={handleFilter} />
          </div>

          {/* Danh sách khóa học bên phải */}
          <div className="w-3/4">
            {loading ? (
              <p>Đang tải kết quả...</p>
            ) : noCourses ? (
              <div className="text-center text-gray-500">
                <p>Không tìm thấy khóa học nào phù hợp với từ khóa: "{query}".</p>
                <a href="/student/home">
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Quay về trang chủ
                  </button>
                </a>
              </div>
            ) : (
              <CourseSearchList courses={filteredCourses()} filter={filter} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Helper function to check price range
const isInPriceRange = (price, priceRange) => {
  const priceStr = String(price);
  const priceInt = parseInt(priceStr.replace(/[^\d]/g, ''));
  const [minPrice, maxPrice] = priceRange.split('-').map((val) => parseInt(val.replace(/[^\d]/g, '')));
  return priceInt >= minPrice && priceInt <= maxPrice;
};

export default SearchCoursePage;
