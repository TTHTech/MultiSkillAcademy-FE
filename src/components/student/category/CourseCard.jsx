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
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 w-full max-w-6xl flex flex-row">
      {/* Course Image - Left Aligned */}
      <div className="w-1/4 flex items-center justify-start">
        <img
          src={course.imageUrls[0] || 'default-image-url.jpg'} // Fallback image if no image is provided
          alt={course.title}
          className="w-[200px] h-[200px] object-cover rounded-md" // Fixed width and height
        />
      </div>

      {/* Course Info */}
      <div className="flex flex-col justify-between w-2/3 px-4">
        {/* Course Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
        {/* Instructor Name */}
        <p className="text-sm text-gray-600 mb-1">
          Giảng viên: {course.instructorFirstName} {course.instructorLastName}
        </p>
        {/* Course Level */}
        <p className="text-sm text-gray-600 mb-1">Mức độ: {course.level}</p>
        {/* Duration */}
        <p className="text-sm text-gray-600 mb-3">Thời gian: {course.duration}</p>
        {/* Rating */}
        <div className="flex items-center mb-3">
          {renderStars(course.rating)}
          <span className="ml-2 text-sm text-gray-600">({course.rating})</span>
        </div>
      </div>

      {/* Course Price - Aligned to the right */}
      <div className="flex items-center justify-end w-1/4">
        <p className="text-lg font-semibold text-gray-800">
          {course.price.toLocaleString('vi-VN')} VND
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
