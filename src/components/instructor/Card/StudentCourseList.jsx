import CourseCard from './StudentCourseCard'; 

const CoursesList = ({ filteredCourses }) => {
    return (
        <div className="flex flex-wrap justify-start bg-gray-100 py-6 w-full gap-6">
            {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                    <CourseCard key={course.courseId} course={course} />
                ))
            ) : (
                <p className="text-center text-gray-600">No courses found</p>
            )}
        </div>
    );
};

export default CoursesList;
