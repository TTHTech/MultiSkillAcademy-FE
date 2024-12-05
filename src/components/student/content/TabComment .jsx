import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TabComment = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Only display the first 6 reviews by default
  const displayedReviews = Array.isArray(reviews) && reviews.length > 0
    ? showAll ? reviews : reviews.slice(0, 6)
    : [];

  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá</h2>

      {loading ? (
        <p className="text-gray-600">Đang tải đánh giá...</p>
      ) : displayedReviews.length === 0 ? (
        <p className="text-gray-600">Chưa có đánh giá nào cho khóa học này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedReviews.map((review, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2 text-gray-900">
                  {review.studentFirstName} {review.studentLastName}
                </span>
                <span className="text-yellow-500">{review.rating} ★</span>
              </div>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(reviews) && reviews.length > 6 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 border rounded-lg font-semibold text-gray-900 hover:bg-gray-200"
          >
            {showAll ? "Ẩn bớt đánh giá" : "Hiện tất cả đánh giá"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TabComment;
