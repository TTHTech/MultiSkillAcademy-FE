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
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <img
        src={course.imageUrls[0]} 
        alt={course.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
      <p className="text-sm text-gray-600">
        Giảng viên: {course.instructorFirstName} {course.instructorLastName}
      </p>
      <p className="text-sm text-gray-600">Mức độ: {course.level}</p>
      <p className="text-sm text-gray-600">Giá: {course.price.toLocaleString('vi-VN')} VND</p>
      <p className="text-sm text-gray-600">Thời gian: {course.duration}</p>
      <div className="flex items-center mt-2">
        {renderStars(course.rating)}
        <span className="ml-2 text-sm text-gray-600">({course.rating})</span>
      </div>
      <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md">Xem chi tiết</button>
    </div>
  );
};

export default CourseCard;
