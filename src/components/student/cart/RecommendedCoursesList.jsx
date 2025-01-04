import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Star, ChevronLeft, ChevronRight, Clock, Users, Trophy } from 'lucide-react';

const RecommendedCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student/courses/top-rated");
        const shuffledCourses = response.data.sort(() => 0.5 - Math.random());
        setCourses(shuffledCourses);
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

  const courseWidth = 320; // Increased width for better presentation
  const visibleCourses = 4; // Adjusted number of visible courses
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

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-[1500px] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Khóa học được đề xuất
            </h2>
            <p className="text-gray-600 mt-2">
              Dựa trên đánh giá và lượt đăng ký từ học viên
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className={`p-3 rounded-full transition-all duration-300 ${
                isLeftVisible
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isLeftVisible}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={scrollRight}
              className={`p-3 rounded-full transition-all duration-300 ${
                isRightVisible
                  ? 'bg-white shadow-lg hover:shadow-xl text-gray-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isRightVisible}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Courses Container */}
        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-hidden scroll-smooth pb-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 2%, black 98%, transparent)'
          }}
        >
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.courseId}`}
              key={index}
              className="flex-none w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.imageUrls?.[0] || "default-image-url.jpg"}
                  alt={course.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Course Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  <span>{course.instructorFirstName} {course.instructorLastName}</span>
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900">{course.rating}</span>
                    <span className="text-gray-500">({course.reviews || course.numberReview})</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>6h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>1.2k</span>
                    </div>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    đ{course.price.toLocaleString("vi-VN")}
                  </span>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium transition-colors duration-300 hover:bg-blue-100">
                    Chi tiết
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedCoursesSection;