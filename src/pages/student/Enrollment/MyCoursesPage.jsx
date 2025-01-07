// src/pages/student/courses/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import StudentCoursesList from "../../../components/student/Enrollment/StudentCourseList";
import { Search, Calendar, Filter, BookOpen, GraduationCap } from "lucide-react";

const userId = Number(localStorage.getItem("userId"));

const COMPLETION_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "in-progress", label: "Đang học" },
  { value: "not-started", label: "Chưa bắt đầu" },
];

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
    completionStatus: "all",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/student/enrollments/${userId}`
        );
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Hàm chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd (định dạng input type="date")
  const convertToDateInputFormat = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Hàm chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy
  const convertToDisplayFormat = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...courses];

      // Tìm kiếm theo tên
      if (filters.searchTerm) {
        filtered = filtered.filter((course) =>
          course.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      // Lọc theo trạng thái hoàn thành
      if (filters.completionStatus !== "all") {
        filtered = filtered.filter((course) => {
          switch (filters.completionStatus) {
            case "completed":
              return course.progress === 100;
            case "in-progress":
              return course.progress > 0 && course.progress < 100;
            case "not-started":
              return course.progress === 0;
            default:
              return true;
          }
        });
      }

      // Lọc theo ngày
      if (filters.startDate && filters.endDate) {
        filtered = filtered.filter((course) => {
          if (!course.enrollmentDate) return false;

          // Chuyển đổi ngày ghi danh sang định dạng yyyy-mm-dd
          const courseDateParts = course.enrollmentDate.split("/");
          const courseDate = new Date(
            `${courseDateParts[2]}-${courseDateParts[1]}-${courseDateParts[0]}`
          );
          courseDate.setHours(0, 0, 0, 0);

          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);

          return courseDate >= startDate && courseDate <= endDate;
        });
      }

      setFilteredCourses(filtered);
    };

    applyFilters();
  }, [filters, courses]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate completion statistics
  const getCompletionStats = () => {
    const completedCourses = courses.filter(course => course.progress === 100);
    const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100);
    return {
      completed: completedCourses.length,
      inProgress: inProgressCourses.length,
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-y-auto mt-[90px]">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section with Stats */}
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Khóa học của tôi
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-blue-500">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng số khóa học</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-blue-500 opacity-80" />
            </div>

            {/* Completed Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-green-500">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <GraduationCap className="w-12 h-12 text-green-500 opacity-80" />
            </div>

            {/* In Progress Courses Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-yellow-500">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Đang học</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <BookOpen className="w-12 h-12 text-yellow-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition duration-150 ease-in-out"
            />
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Completion Status Filter */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Trạng thái hoàn thành
              </label>
              <select
                value={filters.completionStatus}
                onChange={(e) => handleFilterChange("completionStatus", e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {COMPLETION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                max={filters.endDate || undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange("startDate", value);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                min={filters.startDate || undefined}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange("endDate", value);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <StudentCoursesList filteredCourses={filteredCourses} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyCoursesPage;