import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [salesFilter, setSalesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Export selection
  const [exportOption, setExportOption] = useState("currentPage"); // default to export current page

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login again.");
        }

        const response = await fetch("http://localhost:8080/api/admin/sales", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sales data.");
        }

        const data = await response.json();

        const updatedData = data.map((course) => ({
          ...course,
          totalRevenue: course.totalRevenue || 0,
          averageReviews: course.averageReviews || 0,
          reviewCount: course.reviewCount || 0,
          totalSales: course.totalSales || 0,
          courseStatus: course.courseStatus || "Clock",
        }));

        setCourses(updatedData);
        setFilteredCourses(updatedData);

        const totalPages = Math.ceil(updatedData.length / coursesPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterCourses(term, categoryFilter, revenueFilter, reviewFilter, salesFilter, statusFilter);
  };

  const filterCourses = (searchTerm, category, revenue, review, sales, status) => {
    let filtered = courses.filter(
      (course) =>
        course.courseId.toLowerCase().includes(searchTerm) ||
        course.title.toLowerCase().includes(searchTerm)
    );

    if (category) {
      filtered = filtered.filter((course) => course.categoryName === category);
    }

    if (revenue) {
      filtered = revenue === "low" 
        ? filtered.sort((a, b) => a.totalRevenue - b.totalRevenue)
        : filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    if (review) {
      filtered = review === "low"
        ? filtered.sort((a, b) => a.averageReviews - b.averageReviews)
        : filtered.sort((a, b) => b.averageReviews - a.averageReviews);
    }

    if (sales) {
      filtered = sales === "low"
        ? filtered.sort((a, b) => a.totalSales - b.totalSales)
        : filtered.sort((a, b) => b.totalSales - a.totalSales);
    }

    if (status) {
      filtered = filtered.filter((course) => course.courseStatus === status);
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
    setCurrentPage(1); // Reset to first page
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumns = ["ID", "Title", "Revenue", "Average Review", "Review Count", "Total Sales", "Status"];
    let tableData = [];

    if (exportOption === "all") {
      // Export all data
      tableData = courses.map(course => [
        course.courseId,
        course.title,
        course.totalRevenue,
        course.averageReviews,
        course.reviewCount,
        course.totalSales,
        course.courseStatus,
      ]);
    } else {
      // Export only current page data
      tableData = currentCourses.map(course => [
        course.courseId,
        course.title,
        course.totalRevenue,
        course.averageReviews,
        course.reviewCount,
        course.totalSales,
        course.courseStatus,
      ]);
    }

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
    });

    doc.save("sales_table.pdf");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-6 items-center">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                filterCourses(searchTerm, e.target.value, revenueFilter, reviewFilter, salesFilter, statusFilter);
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Phát triển">Phát triển</option>
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Tài chính & Kế toán">Tài chính & Kế toán</option>
              <option value="CNTT & Phần mềm">CNTT & Phần mềm</option>
              <option value="Năng suất văn phòng">Năng suất văn phòng</option>
              <option value="Thiết kế đồ họa">Thiết kế đồ họa</option>
            </select>

            <select
              value={revenueFilter}
              onChange={(e) => {
                setRevenueFilter(e.target.value);
                filterCourses(searchTerm, categoryFilter, e.target.value, reviewFilter, salesFilter, statusFilter);
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Total Revenue</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>

            <select
              value={reviewFilter}
              onChange={(e) => {
                setReviewFilter(e.target.value);
                filterCourses(searchTerm, categoryFilter, revenueFilter, e.target.value, salesFilter, statusFilter);
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Average Reviews</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>

            <select
              value={salesFilter}
              onChange={(e) => {
                setSalesFilter(e.target.value);
                filterCourses(searchTerm, categoryFilter, revenueFilter, reviewFilter, e.target.value, statusFilter);
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Total Sales</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                filterCourses(searchTerm, categoryFilter, revenueFilter, reviewFilter, salesFilter, e.target.value);
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Clock">Clock</option>
            </select>
          </div>
        </div>

        
      </div>

      <table className="w-full text-sm text-left text-white">
        <thead className="text-xs uppercase bg-gray-700 text-white">
          <tr>
            <th className="py-3 px-6">Course ID</th>
            <th className="py-3 px-6">Title</th>
            <th className="py-3 px-6">Revenue</th>
            <th className="py-3 px-6">Average Review</th>
            <th className="py-3 px-6">Review Count</th>
            <th className="py-3 px-6">Total Sales</th>
            <th className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course.courseId} className="border-b border-gray-600">
              <td className="py-3 px-6">{course.courseId}</td>
              <td className="py-3 px-6">{course.title}</td>
              <td className="py-3 px-6">{course.totalRevenue}</td>
              <td className="py-3 px-6">{course.averageReviews}</td>
              <td className="py-3 px-6">{course.reviewCount}</td>
              <td className="py-3 px-6">{course.totalSales}</td>
              <td className="py-3 px-6">{course.courseStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-700 text-white rounded-lg py-2 px-4"
        >
          Prev
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-700 text-white rounded-lg py-2 px-4"
        >
          Next
        </button>
      </div>
      {/* Export Options */}
      <div className="flex items-center justify-end gap-4 mt-4 mb-4">
      <select
        value={exportOption}
        onChange={(e) => setExportOption(e.target.value)}
        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="currentPage">Export Current Page</option>
        <option value="all">Export All</option>
      </select>

      <button
        onClick={handleExportPDF}
        className="bg-blue-600 text-white rounded-lg py-2 px-4 focus:outline-none hover:bg-blue-700"
      >
        Export to PDF
      </button>
    </div>
    </motion.div>
  );
};

export default SalesTable;
