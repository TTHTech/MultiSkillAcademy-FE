import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Calendar } from 'lucide-react';

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    if (i < fullStars) {
      stars.push(
        <Star 
          key={i}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          strokeWidth={1}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className="w-4 h-4 text-gray-300" strokeWidth={1} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" strokeWidth={1} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star 
          key={i}
          className="w-4 h-4 text-gray-300"
          strokeWidth={1}
        />
      );
    }
  }
  return stars;
};

const CourseCard = ({ course }) => {
  const purchaseDate = new Date(course.enrolled_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/student/study/${course.progress}/${course.courseId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Course Image */}
      <div className="relative aspect-video">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={course.images?.[0] || '/default-course-image.jpg'}
          alt={course.title}
        />
        {course.progress === 100 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Hoàn thành
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h2>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {renderStars(course.rating)}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({course.rating.toFixed(1)})
          </span>
        </div>

        {/* Course Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{purchaseDate}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Tiến độ học tập
            </span>
            <span className="text-sm font-medium text-blue-600">
              {course.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                course.progress < 25
                  ? 'bg-red-500'
                  : course.progress < 50
                  ? 'bg-yellow-500'
                  : course.progress < 75
                  ? 'bg-blue-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;