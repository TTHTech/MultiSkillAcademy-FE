const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];
    
    for (let i = 1; i <= totalStars; i++) {
        stars.push(
            <svg
                key={i}
                className={`w-4 h-4 fill-current ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M12 .587l3.668 7.431 8.208 1.192-5.938 5.786 1.401 8.166L12 18.902l-7.339 3.86 1.401-8.166L.124 9.21l8.208-1.192z" />
            </svg>
        );
    }
    return stars;
};

const CourseCard = ({ course }) => {
    // Convert timestamp to a readable date
    const purchaseDate = new Date(course.enrolled_at).toLocaleDateString();

    // Handle redirection when clicking the card
    const handleCardClick = () => {
        window.location.href = `http://localhost:5173/hockhoahoc/${course.courseId}`;
    };

    return (
        <div
            className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white m-4 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={handleCardClick}
        >
            <img
                className="w-full h-40 object-cover"
                src={course.images[0]}
                alt={course.title}
            />

            <div className="px-6 py-4">
                <h2 className="font-bold text-xl mb-2 text-gray-800 truncate">
                    {course.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center mb-4">
                    {renderStars(course.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                        {course.rating}/5
                    </span>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {course.description}
                </p>

                <p className="text-gray-600 text-sm mb-1">
                    Duration: {course.duration}
                </p>

                <p className="text-gray-600 text-sm mb-1">
                    Price: ${course.price.toFixed(2)}
                </p>

                <p className="text-gray-600 text-sm mb-2">
                    Purchased on: {purchaseDate}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                        className={`h-2.5 rounded-full ${course.progress <= 40
                                ? 'bg-red-500'
                                : course.progress <= 75
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                            }`}
                        style={{ width: `${course.progress}%` }}
                    ></div>
                </div>

                <p className="text-gray-600 text-sm mb-2">
                    Progress: {course.progress}%
                </p>

                <p
                    className={`text-sm font-semibold ${course.status === 'Active'
                        ? 'text-green-500'
                        : 'text-red-500'
                        }`}
                >
                    {course.status}
                </p>
            </div>
        </div>
    );
};

export default CourseCard;
