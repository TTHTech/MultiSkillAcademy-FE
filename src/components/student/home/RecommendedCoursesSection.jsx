// src/components/home/RecommendedCoursesSection.jsx
import React, { useRef } from "react";

const recommendedCourses = [
  {
    title: "DevOps on AWS for beginner (Vietnamese)",
    instructor: "Linh Nguyen",
    rating: 4.8,
    reviews: 183,
    price: "₫ 1.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "AWS Cloud for beginner (Vietnamese)",
    instructor: "Linh Nguyen",
    rating: 4.8,
    reviews: 748,
    price: "₫ 1.799.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "AWS Cloud cơ bản (Tiếng Việt)",
    instructor: "Hoa Nguyen Huu",
    rating: 4.5,
    reviews: 191,
    price: "₫ 1.399.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "Khóa học Figma từ cơ bản đến thực chiến",
    instructor: "TELOS Academy, Lưu Trọng Nhân",
    rating: 4.8,
    reviews: 247,
    price: "₫ 549.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "React State Manager - Redux Toolkit, React Query, Redux...",
    instructor: "Hỏi Dân IT với Eric",
    rating: 4.8,
    reviews: 149,
    price: "₫ 2.499.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  // Bổ sung thêm 5 khóa học
  {
    title: "Advanced NodeJS Development",
    instructor: "John Doe",
    rating: 4.7,
    reviews: 135,
    price: "₫ 1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "Full Stack Web Development",
    instructor: "Jane Smith",
    rating: 4.9,
    reviews: 412,
    price: "₫ 2.199.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "Python for Data Science",
    instructor: "Emily Nguyen",
    rating: 4.6,
    reviews: 203,
    price: "₫ 1.599.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "Machine Learning A-Z",
    instructor: "Michael Truong",
    rating: 4.8,
    reviews: 322,
    price: "₫ 2.799.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  },
  {
    title: "Cybersecurity Essentials",
    instructor: "David Le",
    rating: 4.5,
    reviews: 159,
    price: "₫ 1.999.000",
    thumbnail: "https://th.bing.com/th/id/OIP.4ImXDFCLBUdJFeeZh_FTWQHaHa?pid=ImgDet&w=207&h=207&c=7&dpr=1.6"
  }
];

const RecommendedCoursesSection = () => {
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
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Được đề xuất cho bạn dựa trên xếp hạng</h2>
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
          {recommendedCourses.map((course, index) => (
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

export default RecommendedCoursesSection;
