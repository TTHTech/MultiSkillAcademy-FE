// src/pages/student/courses/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import StudentCoursesList from "../../../components/student/Enrollment/StudentCourseList";

const userId = Number(localStorage.getItem("userId"));

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    completionRange: "",
    purchaseDate: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `https://educoresystem-1.onrender.com/api/student/enrollments/${userId}`
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = courses;

      if (filters.searchTerm) {
        filtered = filtered.filter((course) =>
          course.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      if (filters.completionRange) {
        switch (filters.completionRange) {
          case "under25":
            filtered = filtered.filter((course) => course.progress < 25);
            break;
          case "25to50":
            filtered = filtered.filter(
              (course) => course.progress >= 25 && course.progress <= 50
            );
            break;
          case "50to80":
            filtered = filtered.filter(
              (course) => course.progress > 50 && course.progress <= 80
            );
            break;
          case "80to100":
            filtered = filtered.filter(
              (course) => course.progress > 80 && course.progress <= 100
            );
            break;
          default:
            break;
        }
      }

      if (filters.purchaseDate) {
        filtered = filtered.filter((course) => {
          const enrolledAt = new Date(course.enrolled_at);
          const selectedDate = new Date(filters.purchaseDate);
          return enrolledAt.toDateString() === selectedDate.toDateString();
        });
      }

      setFilteredCourses(filtered);
    };

    applyFilters();
  }, [filters, courses]);

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto">
      <NavBar /> {/* Thêm NavBar ở đầu trang */}
      <div className="container mx-auto p-6 bg-gray-100 ">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 pb-4">Khóa học của tôi</h1>
        
        {/* Thêm phần lọc khóa học */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
            }
            className="p-2 border rounded-md"
          />
        </div>

        {/* Hiển thị danh sách khóa học đã được lọc */}
        <div className="flex flex-wrap justify-start gap-6">
          {/* Đảm bảo mỗi phần tử khóa học chiếm 1/4 chiều rộng của màn hình */}
          <StudentCoursesList filteredCourses={filteredCourses} />
        </div>
      </div>
      <Footer /> {/* Thêm Footer ở cuối trang */}
    </div>
  );
};

export default MyCoursesPage;
