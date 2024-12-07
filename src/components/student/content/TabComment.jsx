import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Fetch reviews when the component is mounted
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/reviews/${courseId}`);
        setReviews(response.data); // Set the reviews data
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]); // Run when courseId changes

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
        rating: newRating,
        comment: newComment,
      };

      // Make the API call to submit the new review
      await axios.post("http://localhost:8080/api/student/reviews", newReview);

      // Re-fetch the reviews after submission
      const response = await axios.get(`http://localhost:8080/api/student/reviews/${courseId}`);
      setReviews(response.data); // Update reviews list
      setNewComment(""); // Reset the comment field
      setNewRating(5); // Reset the rating to default (5 stars)
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá</h2>

      {/* Filter, Sort, and Search Section */}
      <div className="flex justify-between mb-4">
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
        <p className="text-gray-600 text-center">Chưa có đánh giá nào cho khóa học này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedReviews.map((review, index) => (
            <div key={index} className="border p-6 rounded-lg bg-gray-50 shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300 ease-in-out">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2 text-gray-900">
                  {review.studentFirstName} {review.studentLastName}
                </span>
                <span className="text-yellow-500">{review.rating} ★</span>
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
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            {showAll ? "Ẩn bớt đánh giá" : "Hiện tất cả đánh giá"}
          </button>
        </div>
      )}

      {/* Add Review Form */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Thêm đánh giá của bạn</h3>
        <div className="flex items-center mb-4">
          <span className="mr-2">Đánh giá:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setNewRating(star)}
              className={`text-xl ${newRating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn về khóa học..."
          className="p-4 border rounded-md w-full"
          rows="4"
        ></textarea>

        <div className="text-center mt-4">
          <button
            onClick={handleSubmitReview}
            disabled={submitLoading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            {submitLoading ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabComment;
