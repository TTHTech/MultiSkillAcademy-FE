import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, Trophy, Flame } from 'lucide-react';
import { motion } from "framer-motion";

const SuggestedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student/courses/active");
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random());
        const updatedCourses = shuffledCourses.map(course => ({
          ...course,
          originalPrice: 500000, // Set original price to 500000 for all courses
          discount: 30, // Set default discount to 30%
          tag: course.rating >= 4.5 ? 'Bestseller' : 'Hot' // Add tag based on rating
        }));
        setCourses(updatedCourses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainer.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
        setIsLeftVisible(scrollLeft > 0);
        setIsRightVisible(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (scrollContainer.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          scrollContainer.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(autoScroll);
  }, []);

  const courseWidth = 300;
  const visibleCourses = 4;
  const scrollAmount = courseWidth * visibleCourses;

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: scrollAmount,
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

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Khóa học được đề xuất
            </h2>
            <p className="text-gray-700 mt-2 font-medium">
              Dựa trên đánh giá và lượt đăng ký từ học viên
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className={`p-3 rounded-md transition-all duration-300 ${
                isLeftVisible
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800'
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
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800'
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
          className="flex gap-4 overflow-hidden scroll-smooth pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
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
                  src={course.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {course.isNew && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Mới
                    </span>
                  )}
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
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{course.discount}%
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-gray-600 mb-2 flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span>{course.instructorFirstName} {course.instructorLastName}</span>
                </p>

                {/* Stats */}
                <div className="flex items-center mb-2">
                  <span className="text-gray-900 font-bold text-lg mr-2">{course.rating.toFixed(1)}</span>
                  <div className="flex gap-1">{renderStars(course.rating)}</div>
                  <span className="text-gray-500 ml-2">({course.reviews || course.numberReview})</span>
                </div>

                {/* Price */}
                <div>
                  <span className="text-sm line-through text-gray-500 mr-2">
                    đ{course.originalPrice?.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-xl font-bold text-indigo-600">
                    đ{(course.originalPrice * (1 - course.discount / 100)).toLocaleString("vi-VN")}
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

export default SuggestedCoursesSection;