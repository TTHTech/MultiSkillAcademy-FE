import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const [courseNameFilter, setCourseNameFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    handleFilter();
  }, [courseNameFilter, ratingFilter]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/reviews/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(response.data);
        setFilteredReviews(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/instructor/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    fetchReviews();
  }, [token, userId]);

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const totalRating = filteredReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / filteredReviews.length).toFixed(1);
  };

  const handleFilter = () => {
    const filtered = reviews.filter((review) => {
      const matchesCourseName = courseNameFilter
        ? review.courseName
            .toLowerCase()
            .includes(courseNameFilter.toLowerCase())
        : true;
      const matchesRating = ratingFilter
        ? review.rating === parseInt(ratingFilter)
        : true;
      return matchesCourseName && matchesRating;
    });
    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 2, 3);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      }
    }
    return pages;
  };

  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      <Sidebar open={open} setOpen={setOpen} className="h-full lg:w-64" />

      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            Danh sách đánh giá
          </h1>

          <div className="bg-white shadow-lg rounded-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="course-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Chọn khóa học
                </label>
                <select
                  id="course-select"
                  className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseNameFilter}
                  onChange={(e) => setCourseNameFilter(e.target.value)}
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((course) => (
                    <option key={course.courseId} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="rating-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Chọn mức đánh giá
                </label>
                <select
                  id="rating-select"
                  className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="">Chọn mức đánh giá</option>
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-200 to-blue-100 rounded-xl p-6 mb-8 shadow-md text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-xl font-semibold text-blue-800">
                  Số đánh giá:{" "}
                  <span className="font-bold text-blue-900">
                    {filteredReviews.length}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xl font-semibold text-blue-800">
                  Đánh giá trung bình:{" "}
                  <span className="font-bold text-blue-900">
                    {calculateAverageRating()} ⭐
                  </span>
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="overflow-auto shadow-md rounded-md max-h-screen">
                <table className="w-full border-collapse bg-white text-left text-sm lg:text-base">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="border p-3 font-medium text-gray-700">
                        Khóa Học
                      </th>
                      <th className="border p-3 font-medium text-gray-700">
                        Tên Khóa Học
                      </th>
                      <th className="border p-3 font-medium text-gray-700">
                        Tên Học Viên
                      </th>
                      <th className="border p-3 font-medium text-gray-700">
                        Đánh Giá
                      </th>
                      <th className="border p-3 font-medium text-gray-700">
                        Bình Luận
                      </th>
                      <th className="border p-3 font-medium text-gray-700">
                        Ngày Tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.length > 0 ? (
                      currentReviews.map((review, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-100 transition"
                        >
                          <td className="border p-3">{review.courseId}</td>
                          <td className="border p-3">{review.courseName}</td>
                          <td className="border p-3">
                            {`${review.studentFirstName} ${review.studentLastName}`}
                          </td>
                          <td className="border p-3 text-center">
                            {review.rating} ⭐
                          </td>
                          <td className="border p-3">{review.comment}</td>
                          <td className="border p-3">
                            {new Date(review.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="border p-3 text-center text-gray-500"
                        >
                          Không có đánh giá nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
                  }`}
                >
                  Trang trước
                </button>
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="mx-1 px-3 py-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`mx-1 px-3 py-2 rounded ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-3 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white transition"
                  }`}
                >
                  Trang sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstructorReviews;
