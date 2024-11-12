// src/components/student/cart/RecommendedCoursesList.jsx
import React, { useRef } from "react";

const recommendedCourses = [
  {
    title: "Khóa học Toeic 800 Reading",
    instructor: "Alpha Digital",
    rating: 4.6,
    reviews: 17,
    price: "₫ 899.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "React State Manager - Redux Toolkit, React Query, Redux Saga",
    instructor: "Hỏi Dân IT với Eric",
    rating: 4.8,
    reviews: 149,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Microservices với Spring Cloud, OAuth2, Docker, Kafka...",
    instructor: "JMaster IO",
    rating: 4.8,
    reviews: 19,
    price: "₫ 1.399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Khóa học Javascript từ cơ bản đến chuyên sâu",
    instructor: "Phạm Ngọc Hòa",
    rating: 4.6,
    reviews: 61,
    price: "₫ 1.899.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Khóa học NextJS 14-ReactJS-Typescript thực chiến 2024",
    instructor: "Khánh Nguyễn",
    rating: 4.6,
    reviews: 48,
    price: "₫ 2.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  // Add 5 more courses for a total of 10
  {
    title: "Khóa học Photoshop cơ bản",
    instructor: "Minh Phạm",
    rating: 4.7,
    reviews: 34,
    price: "₫ 799.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Lập trình Python cho người mới bắt đầu",
    instructor: "An Nguyễn",
    rating: 4.5,
    reviews: 100,
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "SQL for Data Analysis",
    instructor: "Lê Phương",
    rating: 4.8,
    reviews: 67,
    price: "₫ 1.599.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Kỹ năng thuyết trình chuyên nghiệp",
    instructor: "Duy Trần",
    rating: 4.6,
    reviews: 88,
    price: "₫ 999.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
  {
    title: "Thiết kế web từ A đến Z với HTML/CSS",
    instructor: "Hồng Quân",
    rating: 4.9,
    reviews: 112,
    price: "₫ 1.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.dEpNSriTlSnlWivuXfiQOQHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
  },
];

const RecommendedCoursesList = () => {
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Bạn cũng có thể thích</h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full"
        >
          <i className="fas fa-chevron-left text-gray-800"></i>
        </button>

        {/* Horizontal scroll container */}
        <div
          ref={scrollContainer}
          className="flex space-x-4 overflow-x-scroll no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recommendedCourses.map((course, index) => (
            <div key={index} className="w-64 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-700 font-medium">{course.instructor}</p>
                <div className="flex items-center text-yellow-500 mt-1">
                  <span>{course.rating}</span>
                  <span className="ml-1 text-sm text-gray-600">({course.reviews})</span>
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

export default RecommendedCoursesList;
