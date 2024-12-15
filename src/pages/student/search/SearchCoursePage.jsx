import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../../../components/student/common/NavBar';
import Footer from '../../../components/student/common/Footer';
import CourseSearchList from '../../../components/student/search/CourseSearchList';
import CourseFilter from '../../../components/student/category/CourseFilter';
import axios from 'axios';
import debounce from 'lodash.debounce';

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
  
        console.log('API Response:', response.data); // Log dữ liệu trả về từ API
  
        const fetchedCourses = response.data.courses || [];
        setCourses(fetchedCourses);
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
      console.log('Filtering course:', course); // Debugging log
      if (filter.level && course.level !== filter.level) return false;
      if (filter.priceRange && !isInPriceRange(course.price, filter.priceRange)) return false;
      if (filter.rating && course.rating < filter.rating) return false;
      return true;
    });
  }, [courses, filter]);

  useEffect(() => {
    setNoCourses(filteredCourses().length === 0);
  }, [filter, filteredCourses]);

  // Debounce filter handling
  const handleFilter = useCallback(
    debounce((newFilter) => {
      setFilter(newFilter);
    }, 300),
    []
  );

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
              <p className="text-center text-gray-500">Đang tải kết quả...</p>
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
              <CourseSearchList searchQuery={query} />
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
  console.log('Checking price range:', price, priceRange); // Debugging log
  if (!priceRange) return true; // Không có khoảng giá => trả về true
  const priceInt = parseInt(String(price).replace(/[^\d]/g, ''));
  const [minPrice, maxPrice] = priceRange.split('-').map((val) => parseInt(val.replace(/[^\d]/g, '')));

  return priceInt >= minPrice && priceInt <= maxPrice;
};

export default SearchCoursePage;
