import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Flag } from "lucide-react";
import { AlertTriangle } from "lucide-react";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TabComment = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // State for rating filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [sortBy, setSortBy] = useState("newest"); // Sort by newest or highest rating

  // State for adding a review
  const [newRating, setNewRating] = useState(5); // Default to 5 stars
  const [newComment, setNewComment] = useState(""); // Text of the new comment
  const [submitLoading, setSubmitLoading] = useState(false);
  const userId = Number(localStorage.getItem("userId"));

  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  // Fetch reviews when the component is mounted
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/reviews/${courseId}`
        );
        setReviews(response.data); // Set the reviews data
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    const checkReview = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/check/${userId}/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // response.data = { canReview: boolean, message: string }
        const { canReview, message } = response.data;
        setShowAddReview(canReview);
        setReviewMessage(message);
      } catch (error) {
        console.error("Error fetching eligibility:", error);
      }
    };
    checkReview();
    fetchReviews();
  }, [courseId, userId]); // Run when courseId changes

  // Filter reviews by rating
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  // Search reviews by keyword
  const searchedReviews = filteredReviews.filter((review) => {
    return review.comment.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort reviews
  const sortedReviews = searchedReviews.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by newest
    } else if (sortBy === "highest") {
      return b.rating - a.rating; // Sort by highest rating
    }
    return 0;
  });

  // Only display the first 6 reviews by default
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 6);

  // Handle review submission
  const handleSubmitReview = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment!");
      return;
    }

    setSubmitLoading(true);

    try {
      const newReview = {
        courseId,
        userId: userId,
        rating: newRating,
        comment: newComment,
        created_at: Date.now(),
        studentLastName: null,
        studentFirstName: null,
      };

      // Make the API call to submit the new review
      await axios.post(`${baseUrl}/api/student/add-review`, newReview);

      // Re-fetch the reviews after submission
      const response = await axios.get(
        `${baseUrl}/api/student/reviews/${courseId}`
      );
      setShowAddReview(false);
      setReviews(response.data); // Update reviews list
      setNewComment(""); // Reset the comment field
      setNewRating(5); // Reset the rating to default (5 stars)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
        setShowAddReview(false);
        setNewComment("");
        setNewRating(5);
      } else {
        console.error("Failed to submit review", error);
      }
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleReport = async (review) => {
    console.log(review);
    const { value: reason } = await Swal.fire({
      title: "Báo cáo đánh giá",
      input: "textarea",
      inputLabel: "Lý do báo cáo",
      inputPlaceholder: "Nhập lý do tại đây...",
      showCancelButton: true,
      confirmButtonText: "Gửi",
      cancelButtonText: "Hủy",
      preConfirm: (val) => {
        if (!val) Swal.showValidationMessage("Bạn phải nhập lý do!");
        return val;
      },
    });
    if (!reason) return;
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${baseUrl}/api/student/reviews/report`,
        {
          idUserReport: userId,
          targetId: review.review_id,
          reason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Swal.fire("Thành công", "Báo cáo đã được gửi!", "success");
    } catch (err) {
      console.error(err);
      await Swal.fire("Lỗi", "Không gửi được báo cáo, thử lại sau.", "error");
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
      {/* Add Review Form */}
      {/* Add Review Form or Message */}
      {showAddReview ? (
        <div className="mt-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Thêm đánh giá của bạn
          </h3>

          {/* Star Rating */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium text-gray-700">Đánh giá:</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className={`
              text-2xl transition-transform transform hover:scale-110
              ${newRating >= star ? "text-yellow-500" : "text-gray-300"}
            `}
                  aria-label={`${star} sao`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment textarea */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về khóa học..."
            rows="5"
            className="
        w-full p-4 mb-6
        border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-400
        resize-none
      "
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmitReview}
              disabled={submitLoading}
              className={`
          px-6 py-3 font-semibold rounded-lg transition
          ${
            submitLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
          text-white
        `}
            >
              {submitLoading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-start p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <AlertTriangle
            size={24}
            className="flex-shrink-0 text-red-500 mr-3"
          />
          <p className="text-red-700 font-medium">{reviewMessage}</p>
        </div>
      )}

      {/* Filter, Sort, and Search Section */}
      <div className="flex justify-between mt-4 mb-4">
        <div className="flex space-x-4">
          {/* Rating Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-md bg-white"
          >
            <option value="newest">Mới nhất</option>
            <option value="highest">Đánh giá cao nhất</option>
          </select>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm đánh giá..."
          className="p-2 border rounded-md bg-white w-1/3"
        />
      </div>

      {/* Reviews List */}
      {loading ? (
        <p className="text-gray-600 text-center">Đang tải đánh giá...</p>
      ) : displayedReviews.length === 0 ? (
        <p className="text-gray-600 text-center">
          Chưa có đánh giá nào cho khóa học này.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReviews.map((review, index) => (
            <div
              key={index}
              className="border p-6 rounded-lg bg-gray-50 shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <img
                    src={review.profileImage}
                    alt={`${review.studentFirstName} ${review.studentLastName}`}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-900">
                      {review.studentFirstName} {review.studentLastName}
                    </span>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      <span className="text-yellow-500 font-medium">
                        {review.rating} ★
                      </span>
                      <span className="text-blue-600">
                        Tiến độ lúc đánh giá: {review.progress}%
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReport(review)}
                  className="p-2 text-red-500 hover:text-red-600 transition"
                  title="Báo cáo"
                >
                  <Flag size={24} />
                </button>
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Show More Reviews Button */}
      {Array.isArray(reviews) && reviews.length > 6 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out mb-[100px] mt-[50px]"
          >
            {showAll ? "Ẩn bớt đánh giá" : "Hiện tất cả đánh giá"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TabComment;
