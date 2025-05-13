import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/instructor/Sidebar/Sidebar";
import { FileText, Star } from "lucide-react";
import Swal from "sweetalert2";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reviewsRes, coursesRes] = await Promise.all([
          axios.get(`${baseUrl}/api/instructor/reviews/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/instructor/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setReviews(reviewsRes.data);
        setFilteredReviews(reviewsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

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

  const calculateAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const totalRating = filteredReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / filteredReviews.length).toFixed(1);
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

  const handleReport = async (review) => {
    console.log("Review object:", review);
    const { value: reason } = await Swal.fire({
      title: "Báo cáo đánh giá",
      input: "textarea",
      inputLabel: "Lý do báo cáo",
      inputPlaceholder: "Nhập lý do tại đây...",
      inputAttributes: {
        "aria-label": "Nhập lý do báo cáo",
      },
      showCancelButton: true,
      confirmButtonText: "Gửi báo cáo",
      cancelButtonText: "Hủy",
      preConfirm: (val) => {
        if (!val) {
          Swal.showValidationMessage("Bạn phải nhập lý do báo cáo!");
        }
        return val;
      },
    });

    if (!reason) {
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/api/instructor/reviews/${userId}/report`,
        {
          idUserReport: userId,
          review_id: review.id ?? review.reviewId ?? review.review_id,
          reason: reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await Swal.fire({
        icon: "success",
        title: "Đã gửi báo cáo",
        text: "Báo cáo của bạn đã được gửi thành công!",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: "error",
        title: "Gửi báo cáo thất bại",
        text: "Không thể gửi báo cáo. Vui lòng thử lại sau.",
        confirmButtonText: "OK",
      });
    }
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
          {loading ? (
            <div className="flex flex-col justify-center items-center h-screen">
              <div className="flex flex-col items-center">
                <div className="relative flex flex-col items-center bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl">
                  <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-600 font-semibold text-lg animate-pulse">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
                Danh sách đánh giá
              </h1>

              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-300 to-purple-100 p-1 rounded-2xl shadow-lg">
                    <div className="bg-white rounded-xl p-5">
                      <label
                        htmlFor="course-select"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        <span className="text-purple-600">🎓</span> Chọn khóa
                        học
                      </label>
                      <select
                        id="course-select"
                        className="w-full border border-gray-300 rounded-md p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        value={courseNameFilter}
                        onChange={(e) => setCourseNameFilter(e.target.value)}
                      >
                        <option value="">-- Tất cả khóa học --</option>
                        {courses.map((course) => (
                          <option key={course.courseId} value={course.title}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-pink-300 to-pink-100 p-1 rounded-2xl shadow-lg">
                    <div className="bg-white rounded-xl p-5">
                      <label
                        htmlFor="rating-select"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        <span className="text-yellow-500">⭐</span> Chọn mức
                        đánh giá
                      </label>
                      <select
                        id="rating-select"
                        className="w-full border border-gray-300 rounded-md p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                      >
                        <option value="">-- Tất cả mức đánh giá --</option>
                        <option value="5">5 sao</option>
                        <option value="4">4 sao</option>
                        <option value="3">3 sao</option>
                        <option value="2">2 sao</option>
                        <option value="1">1 sao</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-300 to-blue-100 p-1 rounded-2xl shadow-lg">
                    <div className="bg-white rounded-xl p-6 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block p-3 bg-blue-100 rounded-full">
                          <FileText className="w-6 h-6 text-blue-500" />
                        </span>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">
                          Số đánh giá
                        </p>
                        <p className="mt-1 text-2xl font-bold text-blue-700">
                          {filteredReviews.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-300 to-indigo-100 p-1 rounded-2xl shadow-lg">
                    <div className="bg-white rounded-xl p-6 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className="inline-block p-3 bg-indigo-100 rounded-full">
                          <Star className="w-6 h-6 text-indigo-500" />
                        </span>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">
                          Đánh giá trung bình
                        </p>
                        <p className="mt-1 text-2xl font-bold text-indigo-700 flex items-center justify-center sm:justify-start">
                          {calculateAverageRating()}
                          <Star className="w-5 h-5 ml-1 text-yellow-400" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shadow-md rounded-md">
                <table className="w-full table-auto border-collapse bg-white text-left text-sm lg:text-base">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Khóa Học
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Tên Khóa Học
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Tên Học Viên
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap text-center">
                        Đánh Giá
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Bình Luận
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        Ngày Tạo
                      </th>
                      <th className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap text-center">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentReviews.length > 0 ? (
                      currentReviews.map((review, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border px-4 py-3 whitespace-nowrap">
                            {review.courseId}
                          </td>
                          <td
                            className="border px-4 py-3 truncate max-w-[150px] whitespace-nowrap"
                            title={review.courseName}
                          >
                            {review.courseName}
                          </td>
                          <td className="border px-4 py-3 whitespace-nowrap">
                            {`${review.studentFirstName} ${review.studentLastName}`}
                          </td>
                          <td className="border px-4 py-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center text-yellow-500">
                              {Array.from({ length: review.rating }).map(
                                (_, i) => (
                                  <span key={i}>★</span>
                                )
                              )}
                            </span>
                          </td>
                          <td
                            className="border px-4 py-3 truncate max-w-[200px] whitespace-nowrap"
                            title={review.comment}
                          >
                            {review.comment}
                          </td>
                          <td className="border px-4 py-3 whitespace-nowrap">
                            {new Date(review.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="border px-4 py-3 text-center whitespace-nowrap">
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none transition"
                              aria-label="Báo cáo review"
                              onClick={() => handleReport(review)}
                            >
                              Báo cáo
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="border px-4 py-6 text-center text-gray-500"
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
