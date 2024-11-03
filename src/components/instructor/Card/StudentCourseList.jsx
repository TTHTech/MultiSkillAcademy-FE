import React from 'react';
import CourseCard from './StudentCourseCard'; 

const CoursesList = ({ filteredCourses }) => {
    return (
        <div className="flex flex-wrap justify-center bg-gray-100 py-8 w-full">
            {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                    <CourseCard key={course.courseId} course={course} />
                ))
            ) : (
                <p>No courses found</p>
            )}
        </div>
    );
};

export default CoursesList;
