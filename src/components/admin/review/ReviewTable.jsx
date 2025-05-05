import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10; // Hiển thị 10 khóa học mỗi trang
  const [totalPages, setTotalPages] = useState(1);

  // Bộ lọc
  const [categoryFilter, setCategoryFilter] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [salesFilter, setSalesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found, please login again.");
        }

        const response = await fetch(`${baseUrl}/api/admin/sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sales data.");
        }

        const data = await response.json();

        // Cập nhật dữ liệu
        const updatedData = data.map((course) => ({
          ...course,
          totalRevenue: course.totalRevenue || 0,
          averageReviews: course.averageReviews || 0,
          reviewCount: course.reviewCount || 0,
          totalSales: course.totalSales || 0,
          courseStatus: course.courseStatus || "Inactive",
        }));

        setCourses(updatedData);
        setFilteredCourses(updatedData);

        // Tính tổng số trang
        const totalPages = Math.ceil(updatedData.length / coursesPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sales data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    filterCourses(
      term,
      categoryFilter,
      revenueFilter,
      reviewFilter,
      salesFilter,
      statusFilter
    );
  };

  // Filter courses based on multiple criteria
  const filterCourses = (
    searchTerm,
    category,
    revenue,
    review,
    sales,
    status
  ) => {
    let filtered = courses.filter(
      (course) =>
        course.courseId.toLowerCase().includes(searchTerm) ||
        course.title.toLowerCase().includes(searchTerm)
    );

    // Filter by category
    if (category) {
      filtered = filtered.filter((course) => course.categoryName === category);
    }

    // Filter by total revenue
    if (revenue) {
      if (revenue === "low") {
        filtered = filtered.sort((a, b) => a.totalRevenue - b.totalRevenue);
      } else if (revenue === "high") {
        filtered = filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
      }
    }

    // Filter by average reviews
    if (review) {
      if (review === "low") {
        filtered = filtered.sort((a, b) => a.averageReviews - b.averageReviews);
      } else if (review === "high") {
        filtered = filtered.sort((a, b) => b.averageReviews - a.averageReviews);
      }
    }

    // Filter by review count
    if (review) {
      if (review === "low") {
        filtered = filtered.sort((a, b) => a.reviewCount - b.reviewCount);
      } else if (review === "high") {
        filtered = filtered.sort((a, b) => b.reviewCount - a.reviewCount);
      }
    }

    // Filter by total sales
    if (sales) {
      if (sales === "low") {
        filtered = filtered.sort((a, b) => a.totalSales - b.totalSales);
      } else if (sales === "high") {
        filtered = filtered.sort((a, b) => b.totalSales - a.totalSales);
      }
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((course) => course.courseStatus === status);
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage)); // Cập nhật tổng số trang
    setCurrentPage(1); // Reset về trang đầu
  };

  // Tính toán các khóa học cần hiển thị cho trang hiện tại
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  // Chuyển sang trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Chuyển sang trang trước đó
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              filterCourses(
                searchTerm,
                e.target.value,
                revenueFilter,
                reviewFilter,
                salesFilter,
                statusFilter
              );
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {/* Add your categories here */}
            <option value="Phát triển">Phát triển</option>
            <option value="Kinh doanh">Kinh doanh</option>
            <option value="Tài chính & Kế toán">Tài chính & Kế toán</option>
            <option value="CNTT & Phần mềm">CNTT & Phần mềm</option>
            <option value="Năng suất văn phòng">Năng suất văn phòng</option>
            <option value="thiết kế đồ họa">Thiết kế</option>
          </select>

          {/* Total Revenue Filter */}
          <select
            value={revenueFilter}
            onChange={(e) => {
              setRevenueFilter(e.target.value);
              filterCourses(
                searchTerm,
                categoryFilter,
                e.target.value,
                reviewFilter,
                salesFilter,
                statusFilter
              );
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Total Revenue</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>

          {/* Average Reviews Filter */}
          <select
            value={reviewFilter}
            onChange={(e) => {
              setReviewFilter(e.target.value);
              filterCourses(
                searchTerm,
                categoryFilter,
                revenueFilter,
                e.target.value,
                salesFilter,
                statusFilter
              );
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Average Reviews</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>

          {/* Total Sales Filter */}
          <select
            value={salesFilter}
            onChange={(e) => {
              setSalesFilter(e.target.value);
              filterCourses(
                searchTerm,
                categoryFilter,
                revenueFilter,
                reviewFilter,
                e.target.value,
                statusFilter
              );
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Total Sales</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              filterCourses(
                searchTerm,
                categoryFilter,
                revenueFilter,
                reviewFilter,
                salesFilter,
                e.target.value
              );
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Clock">Clock</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full table-auto text-white">
          <thead>
            <tr>
              <th className="p-2">Course ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Total Revenue</th>
              <th className="p-2">Avg. Reviews</th>
              <th className="p-2">Review Count</th>
              <th className="p-2">Total Sales</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course.courseId}>
                <td className="p-2">{course.courseId}</td>
                <td className="p-2">{course.title}</td>
                <td className="p-2">{course.categoryName}</td>
                <td className="p-2">{course.totalRevenue}</td>
                <td className="p-2">{course.averageReviews}</td>
                <td className="p-2">{course.reviewCount}</td>
                <td className="p-2">{course.totalSales}</td>
                <td
                  className={`p-2 ${
                    course.courseStatus === "Active"
                      ?" text-yellow-300"
                      : course.courseStatus === "Clock"
                      ? " text-red-600"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {course.courseStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default SalesTable;
