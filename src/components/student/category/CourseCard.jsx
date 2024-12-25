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
    <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-transform duration-300 w-full max-w-6xl flex flex-row items-center overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-70 -z-10"></div>

      {/* Course Image - Left Aligned */}
      <div className="w-1/4 flex items-center justify-start">
        <img
          src={course.imageUrls[0] || 'default-image-url.jpg'} // Fallback image if no image is provided
          alt={course.title}
          className="w-[220px] h-[220px] object-cover rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Course Info */}
      <div className="flex flex-col justify-between w-2/3 px-6 space-y-4">
        {/* Course Title */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200">
          {course.title}
        </h2>
        {/* Instructor Name */}
        <p className="text-lg text-gray-700 mb-1">
          <span className="font-medium">Giảng viên:</span> {course.instructorFirstName} {course.instructorLastName}
        </p>
        {/* Course Level */}
        <p className="text-lg text-gray-700 mb-1">
          <span className="font-medium">Mức độ:</span> {course.level}
        </p>
        {/* Duration */}
        <p className="text-lg text-gray-700 mb-3">
          <span className="font-medium">Thời gian:</span> {course.duration}
        </p>
        {/* Rating */}
        <div className="flex items-center mb-4">
          {renderStars(course.rating)}
          <span className="ml-2 text-lg text-gray-600">({course.rating})</span>
        </div>
      </div>

      {/* Course Price - Aligned to the right */}
      <div className="flex items-center justify-end w-1/4">
        <p className="text-2xl font-bold text-gray-800 bg-yellow-200 px-6 py-3 rounded-xl shadow-md">
          {course.price.toLocaleString('vi-VN')} VND
        </p>
      </div>
    </div>
  );
};

export default CourseCard;
