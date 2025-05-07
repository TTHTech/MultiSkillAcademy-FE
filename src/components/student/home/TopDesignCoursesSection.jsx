import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flame,
  Palette,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { encodeId } from '../../../utils/hash';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TopDesignCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef(null);

  const categoryId = "CAT007";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/student/courses/category/${categoryId}`
        );
        const { categoryName, courses: fetchedCourses } = response.data;

        const enhancedCourses = fetchedCourses.map((course) => {
          const originalPrice = Math.floor(course.price);
          const discount = course.discount;
          const discountedPrice = Math.floor(
            originalPrice * (1 - discount / 100)
          );

          return {
            ...course,
            originalPrice,
            discount,
            discountedPrice,
            tag: course.rating >= 4.5 ? "Bestseller" : "Hot",
            isNew:
              course.createdAt &&
              new Date(course.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          };
        });

        setCategoryName(categoryName);
        setCourses(enhancedCourses);

        // Check scroll buttons visibility after courses are loaded
        setTimeout(() => {
          checkScroll();
        }, 100);
      } catch (err) {
        setError("Không thể tải dữ liệu khóa học thiết kế.");
        console.error("Failed to fetch design courses", err);
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
      container.addEventListener("scroll", checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [courses]);

  useEffect(() => {
    let autoScrollInterval;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (scrollContainer.current) {
          const { scrollLeft, scrollWidth, clientWidth } =
            scrollContainer.current;
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
        scrollContainer.current.scrollWidth -
          scrollContainer.current.clientWidth
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
            <Star
              className="w-5 h-5 text-gray-300"
              fill="none"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                strokeWidth={1.5}
              />
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
      <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="max-w-[1500px] mx-auto flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-gray-600">Đang tải khóa học thiết kế...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="max-w-[1500px] mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-purple-50 to-violet-50">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-start gap-4">
            <Palette className="w-12 h-12 text-purple-500 mt-1" />
            <div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Thiết Kế & Sáng Tạo
              </h2>
              <p className="text-gray-700 mt-2 font-medium">
                Khám phá các khóa học thiết kế từ các chuyên gia sáng tạo hàng
                đầu
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className={`p-3 rounded-md transition-all duration-300 ${
                isLeftVisible
                  ? "bg-white shadow-lg hover:shadow-xl text-gray-800 hover:bg-purple-50"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isLeftVisible}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`p-3 rounded-md transition-all duration-300 ${
                isRightVisible
                  ? "bg-white shadow-lg hover:shadow-xl text-gray-800 hover:bg-purple-50"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {courses.map((course, index) => (
            <Link
              to={`/course/${encodeId(course.courseId)}`}
              key={index}
              className="flex-none w-[300px] bg-white rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative h-[180px] overflow-hidden">
                <img
                  src={course.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {course.isNew && (
                    <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Mới
                    </span>
                  )}
                  <span
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      course.tag === "Bestseller"
                        ? "bg-yellow-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {course.tag === "Bestseller" ? (
                      <Trophy className="w-3 h-3" />
                    ) : (
                      <Flame className="w-3 h-3" />
                    )}
                    {course.tag}
                  </span>
                </div>
                {course.discount !== 0 && (
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
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span>
                    {course.instructorFirstName} {course.instructorLastName}
                  </span>
                </p>

                {/* Stats */}
                <div className="flex items-center mb-2">
                  <span className="text-gray-900 font-bold text-lg mr-2">
                    {course.rating.toFixed(1)}
                  </span>
                  <div className="flex gap-1">{renderStars(course.rating)}</div>
                  <span className="text-gray-500 ml-2">
                    ({course.reviews || course.numberReview})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  {course.originalPrice !== course.discountedPrice && (
                    <span className="text-sm line-through text-gray-500">
                      đ{course.originalPrice?.toLocaleString("vi-VN")}
                    </span>
                  )}
                  <span className="text-xl font-bold text-rose-600">
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

export default TopDesignCoursesSection;
