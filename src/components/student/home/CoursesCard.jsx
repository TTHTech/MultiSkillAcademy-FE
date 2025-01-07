import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const CoursesCard = ({ course }) => {
  const {
    courseId,
    imageUrls,
    title,
    instructorFirstName,
    instructorLastName,
    rating,
    reviews,
    numberReview,
    price,
  } = course;

  const roundedRating = Math.round(rating);

  return (
    <Link
      to={`/course/${courseId}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 w-[250px] h-auto" // Cố định chiều ngang, cho phép chiều cao tự động
    >
      {/* Image Section */}
      <div className="relative h-[180px]">
        <img
          src={imageUrls?.[0] || "default-image-url.jpg"}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 shadow-md">
          <span className="text-xs font-bold text-indigo-600">
            {price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-gray-600 mb-3">
          {instructorFirstName} {instructorLastName}
        </p>

        {/* Ratings and Reviews */}
        <div className="flex items-center justify-between">
          {/* Stars */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < roundedRating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                fill={index < roundedRating ? 'currentColor' : 'none'}
              />
            ))}
          </div>

          {/* Rating and Review Count */}
          <div
            className="flex items-center text-xs text-gray-600 space-x-1 truncate"
            style={{ maxWidth: '120px' }} // Đảm bảo không cho nội dung tràn thẻ
          >
            <span>{rating.toFixed(1)}</span>
            <span>({reviews || numberReview }  reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CoursesCard;
