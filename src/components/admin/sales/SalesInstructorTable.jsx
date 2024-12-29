import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const SalesInstructorTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [revenueFilter, setRevenueFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");

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

        const response = await fetch(
          "http://localhost:8080/api/admin/instructor-sales",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch instructor sales data.");
        }

        const data = await response.json();

        setInstructors(data);
        setFilteredInstructors(data);

        const totalPages = Math.ceil(data.length / instructorsPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching instructor sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterInstructors(term, revenueFilter, studentFilter);
  };

  const filterInstructors = (searchTerm, revenue, students) => {
    let filtered = instructors.filter(
      (instructor) =>
        instructor.firstName.toLowerCase().includes(searchTerm) ||
        instructor.lastName.toLowerCase().includes(searchTerm)
    );

    if (revenue) {
      filtered =
        revenue === "low"
          ? filtered.sort((a, b) => a.totalRevenue - b.totalRevenue)
          : filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    if (students) {
      filtered =
        students === "low"
          ? filtered.sort((a, b) => a.studentCount - b.studentCount)
          : filtered.sort((a, b) => b.studentCount - a.studentCount);
    }

    setFilteredInstructors(filtered);
    setTotalPages(Math.ceil(filtered.length / instructorsPerPage));
    setCurrentPage(1);
  };

  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
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
      "Last Name",
      "First Name",
      "Students",
      "Courses",
      "Revenue",
      "Revenue/Course",
    ];
    let tableData = [];

    if (exportOption === "all") {
      tableData = instructors.map((instructor) => [
        instructor.lastName,
        instructor.firstName,
        instructor.studentCount,
        instructor.courseCount,
        instructor.totalRevenue.toFixed(2),
        instructor.revenuePerCourse.toFixed(2),
      ]);
    } else {
      tableData = currentInstructors.map((instructor) => [
        instructor.lastName,
        instructor.firstName,
        instructor.studentCount,
        instructor.courseCount,
        instructor.totalRevenue.toFixed(2),
        instructor.revenuePerCourse.toFixed(2),
      ]);
    }

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
    });

    doc.save("instructor_sales_table.pdf");
  };

  const handleExportExcel = () => {
    const tableData =
      exportOption === "all"
        ? instructors.map((instructor) => ({
            "Last Name": instructor.lastName,
            "First Name": instructor.firstName,
            Students: instructor.studentCount,
            Courses: instructor.courseCount,
            Revenue: instructor.totalRevenue.toFixed(2),
            "Revenue/Course": instructor.revenuePerCourse.toFixed(2),
          }))
        : currentInstructors.map((instructor) => ({
            "Last Name": instructor.lastName,
            "First Name": instructor.firstName,
            Students: instructor.studentCount,
            Courses: instructor.courseCount,
            Revenue: instructor.totalRevenue.toFixed(2),
            "Revenue/Course": instructor.revenuePerCourse.toFixed(2),
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Instructor Sales");

    XLSX.writeFile(workbook, "instructor_sales_table.xlsx");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search instructors..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        {/* Filters */}
        <div className="flex gap-4 items-center">
          <select
            value={revenueFilter}
            onChange={(e) => {
              setRevenueFilter(e.target.value);
              filterInstructors(searchTerm, e.target.value, studentFilter);
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Revenue</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>

          <select
            value={studentFilter}
            onChange={(e) => {
              setStudentFilter(e.target.value);
              filterInstructors(searchTerm, revenueFilter, e.target.value);
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Students</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm text-left text-white">
        <thead className="text-xs uppercase bg-gray-700 text-white">
          <tr>
            <th className="py-3 px-6">Last Name</th>
            <th className="py-3 px-6">First Name</th>
            <th className="py-3 px-6">Students</th>
            <th className="py-3 px-6">Courses</th>
            <th className="py-3 px-6">Revenue</th>
            <th className="py-3 px-6">Revenue/Course</th>
          </tr>
        </thead>
        <tbody>
          {currentInstructors.map((instructor, index) => (
            <tr key={index} className="border-b border-gray-600">
              <td className="py-3 px-6">{instructor.lastName}</td>
              <td className="py-3 px-6">{instructor.firstName}</td>
              <td className="py-3 px-6">{instructor.studentCount}</td>
              <td className="py-3 px-6">{instructor.courseCount}</td>
              <td className="py-3 px-6">
                {instructor.totalRevenue.toFixed(2)}
              </td>
              <td className="py-3 px-6">
                {instructor.revenuePerCourse.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
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

export default SalesInstructorTable;
