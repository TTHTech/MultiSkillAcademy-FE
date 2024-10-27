// src/components/student/CoursesDetail/CourseInstructor.jsx
import React from 'react';

const CourseInstructor = ({ instructor }) => {
  return (
    <div className="bg-white p-6 rounded shadow-lg mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Giảng viên</h2>
      
      {/* Instructor Header */}
      <div className="flex items-center mb-4">
        <img 
          src={instructor.image} 
          alt="Instructor" 
          className="w-16 h-16 rounded-full mr-4" 
        />
        <div>
          <h3 className="text-xl font-semibold text-purple-600">
            {instructor.name}
          </h3>
          <p className="text-gray-500">{instructor.title}</p>
        </div>
      </div>
      
      {/* Instructor Metrics */}
      <div className="flex items-center text-gray-600 mb-4">
        <span className="mr-4">⭐ {instructor.rating} xếp hạng giảng viên</span>
        <span className="mr-4">👤 {instructor.reviews} đánh giá</span>
        <span className="mr-4">👥 {instructor.students} học viên</span>
        <span>📚 {instructor.courses} khóa học</span>
      </div>

      {/* Instructor Description */}
      <p className="text-gray-700">{instructor.description}</p>
    </div>
  );
};

export default CourseInstructor;
