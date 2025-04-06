import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, Trophy, Flame, Crown, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";

const RecommendedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/student/courses/top-rated");
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random());
        const updatedCourses = shuffledCourses.map(course => {
          const originalPrice = course.price || 500000;
          const discount = course.discount || 30;
          const discountedPrice = originalPrice * (1 - (discount / 100));

          return {
            ...course,
            originalPrice,
            discount,
            discountedPrice,
            tag: course.rating >= 4.5 ? 'Bestseller' : 'Hot',
            isNew: course.createdAt && new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
        });
        setCourses(updatedCourses);
        
        // Check scroll buttons visibility after courses are loaded
        setTimeout(() => {
          checkScroll();
        }, 100);
      } catch (err) {
        setError("Không thể tải dữ liệu khóa học được đề xuất.");
        console.error("Failed to fetch recommended courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const checkScroll = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setIsLeftVisible(scrollLeft > 0);
      setIsRightVisible(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [courses]);

  useEffect(() => {
    let autoScrollInterval;
    
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (scrollContainer.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollContainer.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      }, 3000);
    };

    if (courses.length > 0) {
      startAutoScroll();
    }

    return () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    };
  }, [courses]);

  const courseWidth = 300;
  const visibleCourses = 4;
  const scrollAmount = courseWidth * visibleCourses;

  const scrollLeft = () => {
    if (scrollContainer.current) {
      const newScrollLeft = Math.max(
        scrollContainer.current.scrollLeft - scrollAmount,
        0
      );
      scrollContainer.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      const newScrollLeft = Math.min(
        scrollContainer.current.scrollLeft + scrollAmount,
        scrollContainer.current.scrollWidth - scrollContainer.current.clientWidth
      );
      scrollContainer.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            strokeWidth={1.5}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-5 h-5 text-gray-300" fill="none" strokeWidth={1.5} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" strokeWidth={1.5} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-gray-300"
            fill="none"
            strokeWidth={1.5}
          />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="py-12 px-6 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="max-w-[1500px] mx-auto flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Đang tải khóa học được đề xuất...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="max-w-[1500px] mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-6 bg-white border-t border-gray-100">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header - Simplified for cart context */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Có thể bạn quan tâm
              </h2>
              <p className="text-sm text-gray-600">
                Các khóa học phổ biến được nhiều học viên lựa chọn
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isLeftVisible
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isLeftVisible}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isRightVisible
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isRightVisible}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Courses Container */}
        <motion.div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 hide-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onScroll={checkScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="flex-none w-[280px] bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative h-[160px] overflow-hidden">
                <img
                  src={course.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {course.isNew && (
                    <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                      Mới
                    </span>
                  )}
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                    course.tag === 'Bestseller' ? 'bg-yellow-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {course.tag === 'Bestseller' ? (
                      <Trophy className="w-3 h-3" />
                    ) : (
                      <Flame className="w-3 h-3" />
                    )}
                    {course.tag}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[48px]">
                  {course.title}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={course.instructorAvatar || "default-avatar.jpg"}
                    alt={course.instructorFirstName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    {course.instructorFirstName} {course.instructorLastName}
                  </span>
                </div>

                <div className="flex items-center mb-3">
                  <span className="text-sm font-semibold text-gray-800 mr-1">
                    {course.rating.toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">{renderStars(course.rating)}</div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({course.reviews || course.numberReview})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 line-through">
                      đ{course.originalPrice?.toLocaleString("vi-VN")}
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      đ{course.discountedPrice.toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-2 py-1 rounded-lg">
                    -{course.discount}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendedCoursesSection;