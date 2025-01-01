import React from 'react';
import { Star, Clock, BookOpen, Users, Tag } from 'lucide-react';

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

const RatingStars = ({ rating = 0, reviewsCount = 0 }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={18}
          className={`${
            index < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-gray-200 text-gray-200"
          } transition-colors duration-200`}
        />
      ))}
    </div>
    <span className="text-sm font-medium text-gray-600">
      {rating.toFixed(1)}
    </span>
    <span className="text-sm text-gray-400">
      ({reviewsCount} đánh giá)
    </span>
  </div>
);

const Badge = ({ icon: Icon, children = '' }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
    <Icon size={14} />
    <span>{children}</span>
  </div>
);

const PriceTag = ({ price = 0, discountedPrice }) => (
  <div className="space-y-1 text-right">
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-3 rounded-xl shadow-sm">
      <p className="text-2xl font-bold text-blue-800">
        {price.toLocaleString('vi-VN')} VND
      </p>
      {discountedPrice && (
        <p className="text-sm text-gray-500 line-through">
          {discountedPrice.toLocaleString('vi-VN')} VND
        </p>
      )}
    </div>
    <button className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
      Đăng ký ngay
    </button>
  </div>
);

const StatBadge = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <Icon size={16} className="text-gray-400" />
    <span className="text-sm">
      <span className="font-medium">{value}</span> {label}
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
    discountedPrice,
    studentsCount = 0,
    lessonsCount = 0,
    reviewsCount = 0
  } = { ...defaultCourse, ...course };

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 w-full max-w-6xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 opacity-80 rounded-2xl -z-10" />
      
      <div className="flex gap-8">
        {/* Course Image */}
        <div className="w-1/4 flex-shrink-0">
          <div className="relative overflow-hidden rounded-xl shadow-md aspect-square">
            <img
              src={imageUrls[0] || defaultCourse.imageUrls[0]}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            {discountedPrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                Giảm {Math.round(((discountedPrice - price) / discountedPrice) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {title}
            </h2>
            
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge icon={BookOpen}>{level}</Badge>
              <Badge icon={Clock}>{duration}</Badge>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex gap-4">
                <StatBadge icon={Users} value={studentsCount} label="học viên" />
                <StatBadge icon={BookOpen} value={lessonsCount} label="bài học" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-medium">Giảng viên:</span>{' '}
              {instructorFirstName} {instructorLastName}
            </p>
            <RatingStars rating={rating} reviewsCount={reviewsCount} />
            <p className="text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Tag size={14} />
            <span>TypeScript, React, NextJS</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="w-1/4 flex-shrink-0 flex items-start justify-end">
          <PriceTag 
            price={price} 
            discountedPrice={discountedPrice}
            onEnroll={onEnroll}
          />
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300" />
    </div>
  );
};

export default CourseCard;