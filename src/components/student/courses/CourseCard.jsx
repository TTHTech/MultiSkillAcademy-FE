import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover" />
      <div className="p-4">
        {/* Sử dụng text-gray-900 để chữ đậm và rõ hơn */}
        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
        <p className="text-sm text-gray-700">{course.instructor}</p>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-700">Hoàn thành {course.progress}%</p>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">⭐ {course.rating}.0</span>
          <span className="text-gray-700 ml-2">Xếp hạng của bạn</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
