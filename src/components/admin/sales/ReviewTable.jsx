import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ReviewTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [courseFilter, setCourseFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [courses, setCourses] = useState([]);

  const [exportOption, setExportOption] = useState("currentPage");

  useEffect(() => {
    const fetchReviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login again.");
        }

        const response = await fetch("http://localhost:8080/api/admin/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch review data.");
        }

        const data = await response.json();

        setReviews(data);
        setFilteredReviews(data);

        const totalPages = Math.ceil(data.length / reviewsPerPage);
        setTotalPages(totalPages);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching review data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login again.");
        }

        const response = await fetch("http://localhost:8080/api/admin/courses/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course data.");
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchReviewData();
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterReviews(term, courseFilter, ratingFilter);
  };

  const filterReviews = (searchTerm, course, rating) => {
    let filtered = reviews.filter(
      (review) =>
        review.username.toLowerCase().includes(searchTerm) ||
        review.courseTitle.toLowerCase().includes(searchTerm) ||
        review.comment.toLowerCase().includes(searchTerm) ||
        review.instructorName.toLowerCase().includes(searchTerm)
    );

    if (course) {
      filtered = filtered.filter((review) => review.courseTitle === course);
    }

    if (rating) {
      filtered = filtered.filter((review) => review.rating === parseInt(rating, 10));
    }

    setFilteredReviews(filtered);
    setTotalPages(Math.ceil(filtered.length / reviewsPerPage));
    setCurrentPage(1);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

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
    const tableColumns = ["Username", "Comment", "Rating", "Date", "Course Title", "Instructor"];
    let tableData = [];

    if (exportOption === "all") {
      tableData = reviews.map((review) => [
        review.username,
        review.comment,
        review.rating,
        new Date(review.createdAt).toLocaleDateString(),
        review.courseTitle,
        review.instructorName,
      ]);
    } else {
      tableData = currentReviews.map((review) => [
        review.username,
        review.comment,
        review.rating,
        new Date(review.createdAt).toLocaleDateString(),
        review.courseTitle,
        review.instructorName,
      ]);
    }

    doc.autoTable({
      head: [tableColumns],
      body: tableData,
    });

    doc.save("reviews_table.pdf");
  };

  const handleExportExcel = () => {
    const tableData =
      exportOption === "all"
        ? reviews.map((review) => ({
            Username: review.username,
            Comment: review.comment,
            Rating: review.rating,
            Date: new Date(review.createdAt).toLocaleDateString(),
            "Course Title": review.courseTitle,
            Instructor: review.instructorName,
          }))
        : currentReviews.map((review) => ({
            Username: review.username,
            Comment: review.comment,
            Rating: review.rating,
            Date: new Date(review.createdAt).toLocaleDateString(),
            "Course Title": review.courseTitle,
            Instructor: review.instructorName,
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");

    XLSX.writeFile(workbook, "reviews_table.xlsx");
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
            placeholder="Search reviews (username, comment, instructor, course)..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              filterReviews(searchTerm, e.target.value, ratingFilter);
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              filterReviews(searchTerm, courseFilter, e.target.value);
            }}
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <table className="w-full text-sm text-left text-white">
        <thead className="text-xs uppercase bg-gray-700 text-white">
          <tr>
            <th className="py-3 px-6">Username</th>
            <th className="py-3 px-6">Comment</th>
            <th className="py-3 px-6">Rating</th>
            <th className="py-3 px-6">Date</th>
            <th className="py-3 px-6">Course Title</th>
            <th className="py-3 px-6">Instructor</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="6" className="text-center text-red-500 py-6">
                {error}
              </td>
            </tr>
          ) : (
            currentReviews.map((review, idx) => (
              <tr key={idx} className="border-b border-gray-600">
                <td className="py-3 px-6">{review.username}</td>
                <td className="py-3 px-6">{review.comment}</td>
                <td className="py-3 px-6">{review.rating}</td>
                <td className="py-3 px-6">{new Date(review.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6">{review.courseTitle}</td>
                <td className="py-3 px-6">{review.instructorName}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

export default ReviewTable;
