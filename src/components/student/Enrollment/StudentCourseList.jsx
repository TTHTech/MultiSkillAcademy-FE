// src/components/student/Enrollment/StudentCoursesList.jsx
import React from 'react';
import CourseCard from './StudentCourseCard';

const StudentCoursesList = ({ filteredCourses }) => {
  if (filteredCourses.length === 0) {
    return (
      <div className="w-full py-16">
        <p className="text-center text-gray-500 text-lg">
          Không tìm thấy khóa học nào
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.courseId}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCoursesList;