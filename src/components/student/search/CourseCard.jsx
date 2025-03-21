import React from 'react';
import { Star, Clock, BookOpen, Users, Tag, Play, Award } from 'lucide-react';

const defaultCourse = {
  title: 'Khóa học chưa có tên',
  imageUrls: ['/placeholder-course.jpg'],
  level: 'Chưa cập nhật',
  duration: 'Chưa cập nhật',
  instructorFirstName: '',
  instructorLastName: 'Chưa cập nhật',
  rating: 0,
  price: 0,
  description: 'Chưa có mô tả cho khóa học này.',
  studentsCount: 0,
  lessonsCount: 0
};

const RatingStars = ({ rating = 0, reviewsCount = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                size={16}
                className="fill-yellow-400 text-yellow-400 transition-colors duration-200"
                strokeWidth={1.5}
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <Star
                  size={16}
                  className="fill-gray-300 text-gray-300"
                  strokeWidth={1.5}
                />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={index}
                size={16}
                className="fill-gray-300 text-gray-300 transition-colors duration-200"
                strokeWidth={1.5}
              />
            );
          }
        })}
      </div>
      <span className="text-sm font-bold text-gray-700">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-gray-400">
        ({reviewsCount.toLocaleString('vi-VN')} đánh giá)
      </span>
    </div>
  );
};

const Badge = ({ icon: Icon, children = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-blue-50 text-blue-700 border-blue-100',
    success: 'bg-green-50 text-green-700 border-green-100',
    warning: 'bg-orange-50 text-orange-700 border-orange-100'
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border ${variants[variant]}`}>
      <Icon size={14} />
      <span>{children}</span>
    </div>
  );
};

const PriceTag = ({ price = 0, onEnroll }) => {
  const originalPrice = 500000;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 px-6 py-4 rounded-md shadow-sm border border-blue-100">
        <p className="text-sm text-gray-500 line-through mb-1">
          đ{originalPrice.toLocaleString('vi-VN')}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-blue-900">
            đ{price.toLocaleString('vi-VN')}
          </p>
          <span className="text-xs font-medium text-red-500">
            -{discountPercent}%
          </span>
        </div>
      </div>
      <button 
        onClick={onEnroll}
        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Đăng ký ngay
      </button>
    </div>
  );
};

const StatBadge = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
    <Icon size={16} className="text-gray-400" />
    <span className="text-sm">
      <span className="font-semibold">{value.toLocaleString('vi-VN')}</span> {label}
    </span>
  </div>
);

const CourseCard = ({ course = defaultCourse, onEnroll }) => {
  const {
    title,
    imageUrls,
    level,
    duration,
    instructorFirstName,
    instructorLastName,
    rating,
    price,
    description,
    studentsCount = 0,
    lessonsCount,
    numberReview
  } = { ...defaultCourse, ...course };

  const discountPercent = Math.round(((500000 - price) / 500000) * 100);

  return (
    <div className="group relative bg-white p-7 rounded-md shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full max-w-6xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 opacity-80 rounded-md -z-10" />
      
      <div className="flex gap-8">
        {/* Course Image */}
        <div className="w-1/4 flex-shrink-0">
          <div className="relative overflow-hidden rounded-md shadow-md aspect-[4/3]">
            <img
              src={imageUrls[0] || defaultCourse.imageUrls[0]}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-md shadow-sm">
              Giảm {discountPercent}%
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {title}
            </h2>
            
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge icon={Award} variant="success">{level}</Badge>
              <Badge icon={Clock} variant="warning">{duration}</Badge>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex gap-6">
                <StatBadge icon={Users} value={studentsCount} label="học viên" />
                <StatBadge icon={BookOpen} value={lessonsCount} label="bài học" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700 flex items-center gap-2">
              <img 
                src={`https://ui-avatars.com/api/?name=${instructorFirstName}+${instructorLastName}&background=random`}
                alt={`${instructorFirstName} ${instructorLastName}`}
                className="w-6 h-6 rounded-md"
              />
              <span className="font-medium hover:text-blue-600 transition-colors cursor-pointer">
                {instructorFirstName} {instructorLastName}
              </span>
            </p>
            <RatingStars rating={rating} reviewsCount={numberReview} />
            <p className="text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="w-1/4 flex-shrink-0">
          <PriceTag 
            price={price}
            onEnroll={onEnroll}
          />
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-blue-100 transition-all duration-300" />
    </div>
  );
};

export default CourseCard;