// src/components/home/SuggestedCoursesSection.jsx
import React, { useRef } from "react";

const suggestedCourses = [
  {
    title: "Mastering TypeScript",
    instructor: "TU Tran",
    rating: 4.7,
    reviews: 14,
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Khóa học Java Online Tiếng Việt toàn tập (VietJack)",
    instructor: "Nguyễn Tuyền, Ken Jack",
    rating: 4.7,
    reviews: 200,
    price: "₫ 399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "React State Manager - Redux Toolkit, React Query, Redux...",
    instructor: "Hỏi Dân IT với Eric",
    rating: 4.8,
    reviews: 149,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Khóa học Javascript Chuyên Sâu",
    instructor: "Khoa Nguyen",
    rating: 4.1,
    reviews: 104,
    price: "₫ 1.899.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Khóa học Javascript từ cơ bản đến chuyên sâu",
    instructor: "Phạm Ngọc Hòa",
    rating: 4.6,
    reviews: 61,
    price: "₫ 1.899.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Angular Fundamentals",
    instructor: "Quang Tran",
    rating: 4.9,
    reviews: 78,
    price: "₫ 999.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "NodeJS Advanced Concepts",
    instructor: "An Nguyen",
    rating: 4.5,
    reviews: 123,
    price: "₫ 1.599.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "CSS Mastery",
    instructor: "Duc Tran",
    rating: 4.3,
    reviews: 89,
    price: "₫ 599.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "React Native Mobile Development",
    instructor: "Huy Tran",
    rating: 4.8,
    reviews: 211,
    price: "₫ 2.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Data Structures in JavaScript",
    instructor: "Minh Pham",
    rating: 4.6,
    reviews: 95,
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.wEVxzyf22-3EG8PeWEveWwHaHa?w=168&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  }
];

const SuggestedCoursesSection = () => {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    scrollContainer.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainer.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Lĩnh vực sẽ học tiếp theo</h2>
      <p className="text-lg text-gray-900 mb-4">
        Vì bạn đã xem <a href="#" className="text-purple-600 underline">"Angular and TypeScript"</a>
      </p>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>

        {/* Container cuộn ngang không có thanh cuộn */}
        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {suggestedCourses.map((course, index) => (
            <div key={index} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-800 font-medium">{course.instructor}</p>
                <div className="flex items-center text-yellow-500 mt-2">
                  <span>{course.rating}</span>
                  <span className="ml-2 text-sm text-gray-600">({course.reviews})</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-2">{course.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-right text-gray-800"></i>
        </button>
      </div>
    </section>
  );
};

export default SuggestedCoursesSection;
