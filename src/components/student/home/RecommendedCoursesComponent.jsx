import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, Trophy, Flame, Crown, Loader2, BookOpen } from 'lucide-react';
import { motion } from "framer-motion";

const RecommendedCoursesComponent = ({ categoryId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef(null);

  // Fetch courses from the recommendation API
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        setLoading(true);
        // Get auth token from localStorage or your auth context
        const token = localStorage.getItem('token'); // Adjust based on your auth implementation
        
        if (!token) {
          setError("Vui lòng đăng nhập để xem khóa học được đề xuất.");
          setLoading(false);
          return;
        }

        // Determine which API endpoint to use based on categoryId
        let url = "http://localhost:8080/api/student/recommendations";
        if (categoryId) {
          url = `http://localhost:8080/api/student/recommendations/category/${categoryId}`;
        }

        // Make API request with auth token
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            count: 10 // Request 10 recommendations
          }
        });

        // Process the courses data
        const fetchedCourses = response.data.map(course => {
          const originalPrice = course.price || 500000;
          const discount = course.discount || 30;
          const discountedPrice = originalPrice * (1 - (discount / 100));

          return {
            ...course,
            courseId: course.courseId || course.id,
            originalPrice,
            discount,
            discountedPrice,
            tag: (course.rating >= 4.5) ? 'Bestseller' : (course.enrollmentCount > 50 ? 'Hot' : ''),
            isNew: course.createdAt && new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          };
        });

        setCourses(fetchedCourses);
        
        // Check scroll buttons visibility after courses are loaded
        setTimeout(() => {
          checkScroll();
        }, 100);
      } catch (err) {
        console.error("Failed to fetch recommended courses", err);
        if (err.response?.status === 401) {
          setError("Vui lòng đăng nhập để xem khóa học được đề xuất.");
        } else {
          setError("Không thể tải dữ liệu khóa học được đề xuất.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedCourses();
  }, [categoryId]);

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
      }, 4000);
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
        <div className="max-w-[1500px] mx-auto flex justify-center items-center min-h-[300px]">
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

  if (courses.length === 0) {
    return (
      <section className="py-12 px-6 bg-gradient-to-r from-indigo-50 to-violet-50">
        <div className="max-w-[1500px] mx-auto flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4 text-center">
            <BookOpen className="w-12 h-12 text-indigo-600" />
            <p className="text-gray-700 font-medium">Chưa có khóa học được đề xuất cho bạn.</p>
            <p className="text-gray-500">Hãy khám phá thêm các khóa học để nhận được đề xuất phù hợp hơn.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-indigo-50 to-violet-50">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-start gap-4">
            <Crown className="w-12 h-12 text-indigo-600 mt-1" />
            <div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {categoryId ? 'Khóa Học Đề Xuất Theo Danh Mục' : 'Khóa Học Dành Cho Bạn'}
              </h2>
              <p className="text-gray-700 mt-2 font-medium">
                {categoryId 
                  ? 'Được đề xuất dựa trên sở thích của bạn trong danh mục này' 
                  : 'Được đề xuất dựa trên lịch sử học tập và sở thích của bạn'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className={`p-3 rounded-md transition-all duration-300 ${
                isLeftVisible
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800 hover:bg-indigo-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isLeftVisible}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`p-3 rounded-md transition-all duration-300 ${
                isRightVisible
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800 hover:bg-indigo-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isRightVisible}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Courses Container */}
        <motion.div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 hide-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
              className="flex-none w-[300px] bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={course.thumbnail || course.imageUrls?.[0] || "/default-course-image.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {course.isNew && (
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Mới
                    </span>
                  )}
                  {course.tag && (
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      course.tag === 'Bestseller' ? 'bg-yellow-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      {course.tag === 'Bestseller' ? (
                        <Trophy className="w-3 h-3" />
                      ) : (
                        <Flame className="w-3 h-3" />
                      )}
                      {course.tag}
                    </span>
                  )}
                </div>
                {course.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{course.discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-gray-600 mb-2 flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-indigo-600" />
                  <span>
                    {course.instructorFirstName || course.instructorName || 'Giảng viên'} 
                    {course.instructorLastName ? ` ${course.instructorLastName}` : ''}
                  </span>
                </p>

                {/* Stats */}
                <div className="flex items-center mb-2">
                  <span className="text-gray-900 font-bold text-lg mr-2">
                    {(course.rating || 0).toFixed(1)}
                  </span>
                  <div className="flex gap-1">{renderStars(course.rating || 0)}</div>
                  <span className="text-gray-500 ml-2">
                    ({course.reviews || course.numberReview || 0})
                  </span>
                </div>

                {/* Score if available from recommendation API */}
                {course.score && (
                  <p className="text-xs text-green-600 font-medium mb-2">
                    Độ phù hợp: {course.score.toFixed(1)}/5
                  </p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-sm line-through text-gray-500">
                    đ{course.originalPrice?.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-xl font-bold text-indigo-600">
                    đ{course.discountedPrice.toLocaleString("vi-VN")}
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

export default RecommendedCoursesComponent;