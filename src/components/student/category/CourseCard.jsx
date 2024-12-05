import React from 'react';

const CourseCard = ({ course }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
          style={{ fontSize: '16px' }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <img
        src={course.imageUrls[0] || 'default-image-url.jpg'} // Fallback image if no image is provided
        alt={course.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      {/* Course Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
      {/* Instructor Name */}
      <p className="text-sm text-gray-600 mb-1">
        Giảng viên: {course.instructorFirstName} {course.instructorLastName}
      </p>
      {/* Course Level */}
      <p className="text-sm text-gray-600 mb-1">Mức độ: {course.level}</p>
      {/* Price */}
      <p className="text-sm text-gray-600 mb-1">Giá: {course.price.toLocaleString('vi-VN')} VND</p>
      {/* Duration */}
      <p className="text-sm text-gray-600 mb-3">Thời gian: {course.duration}</p>
      {/* Rating */}
      <div className="flex items-center">
        {renderStars(course.rating)}
        <span className="ml-2 text-sm text-gray-600">({course.rating})</span>
      </div>
    </div>
  );
};

export default CourseCard;
