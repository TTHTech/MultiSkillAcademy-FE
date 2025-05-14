// src/pages/student/courses/MyCoursesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import StudentCoursesList from "../../../components/student/Enrollment/StudentCourseList";
import {
  Search,
  Calendar,
  Filter,
  BookOpen,
  GraduationCap,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import { ChevronRight as ChevronRightIcon } from "lucide-react";

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
  const [error, setError] = useState(null);
  // Get user ID from localStorage every time the component renders
  const [userId, setUserId] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  // Set userId when component mounts and whenever localStorage changes
  useEffect(() => {
    const currentUserId = Number(localStorage.getItem("userId"));
    setUserId(currentUserId);
  }, []);

  // Fetch courses whenever userId changes
  useEffect(() => {
    if (!userId) return; // Don't fetch if userId is not available yet

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          `${baseUrl}/api/student/enrollments/${userId}`
        );
        setCourses(response.data || []);
        setFilteredCourses(response.data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [userId]);

  const COMPLETION_OPTIONS = [
    { value: "all", label: "Tất cả" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "in-progress", label: "Đang học" },
    { value: "not-started", label: "Chưa bắt đầu" },
  ];

  // Hàm chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd (định dạng input type="date")
  const convertToDateInputFormat = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
      // Reset to first page when filters change
      setCurrentPage(1);
    };

    applyFilters();
  }, [filters, courses]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate completion statistics
  const getCompletionStats = () => {
    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const inProgressCourses = courses.filter(
      (course) => course.progress > 0 && course.progress < 100
    );
    return {
      completed: completedCourses.length,
      inProgress: inProgressCourses.length,
    };
  };

  const stats = getCompletionStats();

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  // Get current courses to display
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // EmptyState component for no courses
  const EmptyState = ({ filterActive }) => (
    <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-50 p-4 rounded-full mb-4">
        <BookOpen className="w-10 h-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {filterActive ? "Không tìm thấy khóa học" : "Chưa có khóa học nào"}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {filterActive
          ? "Không có khóa học nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh bộ lọc để tìm kiếm lại."
          : "Bạn chưa đăng ký khóa học nào. Hãy khám phá danh sách khóa học để bắt đầu hành trình học tập của mình."}
      </p>
      {filterActive ? (
        <button
          onClick={() =>
            setFilters({
              searchTerm: "",
              completionStatus: "all",
              startDate: "",
              endDate: "",
            })
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Xóa bộ lọc
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="http://localhost:5173/student/cart"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Khám phá khóa học
          </a>
          <a
            href="http://localhost:5173/student/home"
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Quay về trang chủ
          </a>
        </div>
      )}
    </div>
  );

  // Determine if filters are active
  const isFilterActive =
    filters.searchTerm !== "" ||
    filters.completionStatus !== "all" ||
    (filters.startDate !== "" && filters.endDate !== "");

  // Force refresh function
  const handleForceRefresh = () => {
    // Get current userId
    const currentUserId = Number(localStorage.getItem("userId"));
    setIsLoading(true);

    // Fetch courses with the current userId
    axios
      .get(`${baseUrl}/api/student/enrollments/${currentUserId}`)
      .then((response) => {
        setCourses(response.data || []);
        setFilteredCourses(response.data || []);
        setError(null);
      })
      .catch((error) => {
        console.error("Error refreshing courses:", error);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    // Generate array of page numbers to display
    const pageNumbers = [];
    const maxPageDisplay = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageDisplay / 2));
    let endPage = Math.min(totalPages, startPage + maxPageDisplay - 1);
    
    if (endPage - startPage + 1 < maxPageDisplay) {
      startPage = Math.max(1, endPage - maxPageDisplay + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex justify-center items-center mt-8 mb-4">
        <nav className="flex items-center gap-1">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg 
                  ${currentPage === 1 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-100"}`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="mx-1 text-gray-500">...</span>
              )}
            </>
          )}
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg 
                ${currentPage === number 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-100"}`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="mx-1 text-gray-500">...</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg 
                  ${currentPage === totalPages 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-700 hover:bg-gray-100"}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-y-auto mt-[90px]">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section with Stats */}
        <div className="flex flex-col mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <a
              href="/student/home"
              className="hover:text-blue-600 transition-colors duration-200 mt-[50px]"
            >
              Trang chủ
            </a>
            <ChevronRightIcon className="w-4 h-4 mt-[50px]" />
            <span className="text-gray-700 font-medium mt-[50px]">
              Danh sách khóa học
            </span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Khóa học của tôi
            </h1>
            <button
              onClick={handleForceRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 2v6h6"></path>
                <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
                <path d="M21 22v-6h-6"></path>
                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
              </svg>
              Làm mới
            </button>
          </div>

          {/* Stats Cards */}
          {!isLoading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Total Courses Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-blue-500">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Tổng số khóa học
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.length}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-500 opacity-80" />
              </div>

              {/* Completed Courses Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-green-500">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Đã hoàn thành
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <GraduationCap className="w-12 h-12 text-green-500 opacity-80" />
              </div>

              {/* In Progress Courses Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between border-l-4 border-yellow-500">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Đang học
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-yellow-500 opacity-80" />
              </div>
            </div>
          )}
        </div>

        {/* Filters Section - only show when there are courses */}
        {!isLoading && !error && courses.length > 0 && (
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
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
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
                  onChange={(e) =>
                    handleFilterChange("completionStatus", e.target.value)
                  }
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
        )}

        {/* Courses List or Error/Empty State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-800">{error}</p>
              <button
                onClick={handleForceRefresh}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState filterActive={false} />
        ) : filteredCourses.length === 0 ? (
          <EmptyState filterActive={true} />
        ) : (
          <>
            <StudentCoursesList filteredCourses={currentCourses} />
            <Pagination />
            {/* Results count */}
            <div className="text-center text-sm text-gray-500 mt-2">
              Hiển thị {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, filteredCourses.length)} của {filteredCourses.length} khóa học
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyCoursesPage;