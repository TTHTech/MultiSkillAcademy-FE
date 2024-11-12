import PropTypes from "prop-types";
import CourseCard from "./CoursesCard";

const ListCard = ({ courses }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course, index) => (
                <CourseCard
                    key={index}
                    courseId={course.courseId}
                    images={course.images}
                    title={course.title}
                    description={course.description}
                    rating={course.rating}
                    price={course.price}
                    status={course.status}
                />
            ))}
        </div>
    );
};

ListCard.propTypes = {
    courses: PropTypes.arrayOf(
        PropTypes.shape({
            courseId: PropTypes.string.isRequired,
            images: PropTypes.arrayOf(PropTypes.string).isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            rating: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ListCard;