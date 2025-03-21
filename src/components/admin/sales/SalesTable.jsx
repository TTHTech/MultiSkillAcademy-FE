import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("");
  const [reviewFilter, setReviewFilter] = useState("");
  const [salesFilter, setSalesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [exportOption, setExportOption] = useState("currentPage");

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
          courseStatus: course.courseStatus || "Inactive",
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
    filterCourses(
      term,
      categoryFilter,
      revenueFilter,
      reviewFilter,
      salesFilter,
      statusFilter
    );
  };

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

    if (category) {
      filtered = filtered.filter((course) => course.categoryName === category);
    }

    if (revenue) {
      filtered =
        revenue === "low"
          ? filtered.sort((a, b) => a.totalRevenue - b.totalRevenue)
          : filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    if (review) {
      filtered =
        review === "low"
          ? filtered.sort((a, b) => a.averageReviews - b.averageReviews)
          : filtered.sort((a, b) => b.averageReviews - a.averageReviews);
    }

    if (sales) {
      filtered =
        sales === "low"
          ? filtered.sort((a, b) => a.totalSales - b.totalSales)
          : filtered.sort((a, b) => b.totalSales - a.totalSales);
    }

    if (status) {
      filtered = filtered.filter((course) => course.courseStatus === status);
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
    setCurrentPage(1);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

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
    const tableColumns = [
      "ID",
      "Title",
      "Revenue",
      "Average Review",
      "Review Count",
      "Total Sales",
      "Status",
    ];
    let tableData = [];

    if (exportOption === "all") {
      tableData = courses.map((course) => [
        course.courseId,
        course.title,
        course.totalRevenue,
        course.averageReviews,
        course.reviewCount,
        course.totalSales,
        course.courseStatus,
      ]);
    } else {
      tableData = currentCourses.map((course) => [
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExportExcel = () => {
    const tableData =
      exportOption === "all"
        ? courses.map((course) => ({
            ID: course.courseId,
            Title: course.title,
            Revenue: course.totalRevenue,
            "Average Review": course.averageReviews,
            "Review Count": course.reviewCount,
            "Total Sales": course.totalSales,
            Status: course.courseStatus,
          }))
        : currentCourses.map((course) => ({
            ID: course.courseId,
            Title: course.title,
            Revenue: course.totalRevenue,
            "Average Review": course.averageReviews,
            "Review Count": course.reviewCount,
            "Total Sales": course.totalSales,
            Status: course.courseStatus,
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

    XLSX.writeFile(workbook, "sales_table.xlsx");
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
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex gap-4 items-center">
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
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Phát triển">Phát triển</option>
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Tài chính & Kế toán">Tài chính</option>
              <option value="CNTT & Phần mềm">CNTT </option>
              <option value="Năng suất văn phòng">Văn phòng</option>
              <option value="Thiết kế đồ họa">Đồ họa</option>
            </select>

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
                filterCourses(
                  searchTerm,
                  categoryFilter,
                  revenueFilter,
                  e.target.value,
                  salesFilter,
                  statusFilter
                );
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Avg Reviews</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>

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
                filterCourses(
                  searchTerm,
                  categoryFilter,
                  revenueFilter,
                  reviewFilter,
                  salesFilter,
                  e.target.value
                );
              }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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
              <td
                className={`py-3 px-6 font-roboto ${
                  course.courseStatus === "Active"
                    ? "text-yellow-300"
                    : "text-red-500"
                }`}
              >
                {course.courseStatus}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <div className="flex items-center">
          {(() => {
            const pages = [];

            if (totalPages <= 13) {
              // Hiển thị tất cả các trang nếu tổng số trang <= 13
              for (let i = 1; i <= totalPages; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 rounded-lg ${
                      currentPage === i
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
            } else {
              // Hiển thị 10 trang đầu và 3 trang cuối, với logic động
              if (currentPage <= 10) {
                for (let i = 1; i <= 10; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                pages.push(
                  <span key="dots-end" className="px-4 py-2">
                    ...
                  </span>
                );
                for (let i = totalPages - 2; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              } else if (currentPage > 10 && currentPage <= totalPages - 10) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300`}
                  >
                    1
                  </button>
                );
                pages.push(
                  <span key="dots-start" className="px-4 py-2">
                    ...
                  </span>
                );

                for (let i = currentPage - 4; i <= currentPage + 4; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                pages.push(
                  <span key="dots-end" className="px-4 py-2">
                    ...
                  </span>
                );
                for (let i = totalPages - 2; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300`}
                  >
                    1
                  </button>
                );
                pages.push(
                  <span key="dots-start" className="px-4 py-2">
                    ...
                  </span>
                );

                for (let i = totalPages - 12; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 mx-1 rounded-lg ${
                        currentPage === i
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
              }
            }

            return pages;
          })()}
        </div>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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

        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white rounded-lg py-2 px-4 focus:outline-none hover:bg-green-700"
        >
          Export to Excel
        </button>
      </div>
    </motion.div>
  );
};

export default SalesTable;
