import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../../components/student/common/NavBar'; // Import NavBar
import Footer from '../../../components/student/common/Footer'; // Import Footer
import CourseList from '../../../components/student/category/CourseList';
import CourseFilter from '../../../components/student/category/CourseFilter';
import axios from 'axios';

const CategoryStudentPage = () => {
  const { categoryId } = useParams(); // Extract categoryId from URL params
  const [filter, setFilter] = useState({});

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
  };

  const [categoryName, setCategoryName] = useState('');

  // Fetch category name or any other category-specific data based on categoryId
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/categories/${categoryId}`);
        setCategoryName(response.data.name); // Assuming response contains category name
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto mt-[90px]">
      <NavBar /> {/* Add NavBar to the page */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {categoryName ? `${categoryName} - Khóa Học` : 'Danh Mục Khóa Học'}
        </h1>

        {/* Layout with flex: filter on the left and course list on the right */}
        <div className="flex space-x-6">
          {/* Filter on the left */}
          <div className="w-1/4">
            <CourseFilter onFilter={handleFilter} />
          </div>

          {/* Course List on the right */}
          <div className="w-3/4">
            <CourseList categoryId={categoryId} filter={filter} />
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer to the page */}
    </div>
  );
};

export default CategoryStudentPage;
