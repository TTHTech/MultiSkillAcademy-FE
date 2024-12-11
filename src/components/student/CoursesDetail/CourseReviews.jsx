import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const CourseReviews = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  // Kiểm tra nếu reviews có dữ liệu và chỉ hiển thị 6 reviews đầu tiên
  const displayedReviews = Array.isArray(reviews) && reviews.length > 0
    ? showAll ? reviews : reviews.slice(0, 6)
    : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <FaStar className="mr-2 text-yellow-500" /> Đánh giá
      </h2>

      {/* Kiểm tra nếu không có đánh giá nào */}
      {displayedReviews.length === 0 ? (
        <p className="text-gray-600">Chưa có đánh giá nào cho khóa học này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review, index) => (
          <div
            key={index}
            className="border p-6 rounded-lg bg-gray-50 shadow-md hover:shadow-xl hover:border-blue-500 transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center mb-2">
              <img
                src={review.profileImage}
                alt={`${review.studentFirstName} ${review.studentLastName}`}
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
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

      {/* Hiển thị nút để xem tất cả đánh giá */}
      {reviews.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-500 mt-4 hover:underline"
        >
          {showAll ? 'Ẩn bớt' : 'Xem tất cả'}
        </button>
      )}
    </div>
  );
};

export default CourseReviews;
