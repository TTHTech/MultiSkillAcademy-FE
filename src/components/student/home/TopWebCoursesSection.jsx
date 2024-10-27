// src/components/home/TopWebCoursesSection.jsx
import React, { useRef } from "react";

const topWebCourses = [
  {
    title: "Angular and TypeScript",
    instructor: "TU Tran",
    rating: 4.2,
    reviews: 12,
    price: "₫ 399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "Kỹ Thuật Debugs Với Lập Trình FullStack Website",
    instructor: "Hỏi Dân IT với Eric",
    rating: 5.0,
    reviews: 36,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "5 ngày thiết kế website cho digital marketing",
    instructor: "Mỹ Võ Văn",
    rating: 4.6,
    reviews: 42,
    price: "₫ 1.399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "React Pro TypeScript - Thực Hành Dự Án Portfolio",
    instructor: "Hỏi Dân IT với Eric",
    rating: 4.8,
    reviews: 79,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "Nest.JS Zero - Xây Dựng Backend Node.JS Chuyên Nghiệp",
    instructor: "Hỏi Dân IT với Eric",
    rating: 4.8,
    reviews: 177,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "HTML & CSS Cơ Bản",
    instructor: "Ngọc Anh",
    rating: 4.5,
    reviews: 102,
    price: "₫ 299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "JavaScript Nâng Cao",
    instructor: "Phạm Văn Long",
    rating: 4.7,
    reviews: 54,
    price: "₫ 1.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "NodeJS Fullstack Developer",
    instructor: "Hải Nguyễn",
    rating: 4.9,
    reviews: 89,
    price: "₫ 1.999.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "React JS từ cơ bản đến nâng cao",
    instructor: "Khoa Bùi",
    rating: 4.6,
    reviews: 110,
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  },
  {
    title: "Phát Triển Web Với Vue.js",
    instructor: "Linh Võ",
    rating: 4.4,
    reviews: 62,
    price: "₫ 899.000",
    thumbnail: "https://th.bing.com/th/id/OIP.aV4Bz3IY6EbnT0-BFPGVdwAAAA?rs=1&pid=ImgDetMain"
  }
];

const TopWebCoursesSection = () => {
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
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Các khóa học hàng đầu về <a href="#" className="text-purple-600 underline">Phát triển web</a>
      </h2>
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
          {topWebCourses.map((course, index) => (
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

export default TopWebCoursesSection;
