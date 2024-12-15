import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/instructor/Sidebar/Sidebar";

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
    setCurrentPage(1); // Reset về trang đầu
  };

  // Lấy các review cho trang hiện tại
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  // Tạo danh sách các trang
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section
      className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-gray-100 min-h-screen ${
        open ? "ml-72" : "ml-16"
      }`}
    >
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} className="h-full lg:w-64" />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">
            Danh sách đánh giá
          </h1>

          {/* Bộ lọc */}
          <div className="bg-white shadow-md rounded-md p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nhập tên khóa học"
                className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseNameFilter}
                onChange={(e) => setCourseNameFilter(e.target.value)}
              />
              <select
                className="border rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <button
                onClick={handleFilter}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
              >
                Lọc
              </button>
            </div>
          </div>

          {/* Thống kê */}
          <div className="bg-blue-100 rounded-md p-4 mb-6 text-center sm:text-left">
            <p className="text-lg font-semibold text-blue-700">
              Số đánh giá: <strong>{filteredReviews.length}</strong>
            </p>
            <p className="text-lg font-semibold text-blue-700">
              Đánh giá trung bình:{" "}
              <strong>{calculateAverageRating()} ⭐</strong>
            </p>
          </div>

          {/* Xử lý trạng thái */}
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

              {/* Phân trang */}
              <div className="flex justify-center items-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-2 mx-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 transition`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstructorReviews;
