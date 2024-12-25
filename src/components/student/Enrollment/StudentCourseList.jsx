import CourseCard from './StudentCourseCard';

const StudentCoursesList = ({ filteredCourses }) => {
    return (
        <div className="grid grid-cols-4 gap-4 bg-gray-100 py-6 w-full">
            {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                    <div key={course.courseId}>
                        <CourseCard course={course} />
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-600">No courses found</p>
            )}
        </div>
    );
};

export default StudentCoursesList;
