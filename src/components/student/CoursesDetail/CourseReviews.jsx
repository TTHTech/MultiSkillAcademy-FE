import React, { useState } from 'react';

const CourseReviews = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  // Kiểm tra nếu reviews có dữ liệu và chỉ hiển thị 6 reviews đầu tiên
  const displayedReviews = Array.isArray(reviews) && reviews.length > 0 
    ? showAll ? reviews : reviews.slice(0, 6)
    : [];

  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Đánh giá</h2>

      {/* Kiểm tra nếu không có đánh giá nào */}
      {displayedReviews.length === 0 ? (
        <p className="text-gray-600">Chưa có đánh giá nào cho khóa học này.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedReviews.map((review, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex items-center mb-2">
                {/* Hiển thị tên người đánh giá (first name và last name) */}
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

      {/* Hiển thị nút để ẩn/hiện tất cả đánh giá nếu có nhiều hơn 6 đánh giá */}
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

export default CourseReviews;
