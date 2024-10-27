// src/components/home/FeaturedCourses.jsx
import React, { useRef } from "react";

const courses = [
  {
    title: "Cách tạo một khóa học Udemy (Có phụ đề)",
    subtitle: "Chào mừng bạn!",
    description: "Bài giảng • 2 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.xg_u1DbrwB1WD2-NZFcOmwHaEG?w=249&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Viết ứng dụng bán hàng với Java Spring",
    subtitle: "Tùy biến các hàm Jwt, Login, Register User",
    description: "Bài giảng • 36 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.necZERyMHrvZ0dTFT_NXxgHaES?w=281&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Thiết kế cơ sở dữ liệu ứng dụng nghe nhạc",
    subtitle: "Cài đặt Oracle 21c trên Windows 11",
    description: "Bài giảng • 6 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.cWrsk85mAO6xEkewVZOTiQHaEL?w=257&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Khóa học Photoshop cơ bản",
    subtitle: "Thành thạo Photoshop trong 30 ngày",
    description: "Bài giảng • 8 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.foWfuwSbYXhGYzrCLg14bwHaEl?w=263&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "React từ cơ bản đến nâng cao",
    subtitle: "Xây dựng dự án React",
    description: "Bài giảng • 42 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.rodXYkP7AbvxdjCjXTyAKAHaEL?w=267&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Lập trình Python cơ bản",
    subtitle: "Bước vào thế giới Python",
    description: "Bài giảng • 12 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.mbxqZ67P5YIafMOyORL26QAAAA?w=317&h=175&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  },
  {
    title: "Kỹ năng thuyết trình hiệu quả",
    subtitle: "Giao tiếp chuyên nghiệp",
    description: "Bài giảng • 25 phút",
    thumbnail: "https://th.bing.com/th/id/OIP.jFXiUIsU6M3gyJv0kVWXBAHaEL?w=293&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
  }
];

const FeaturedCourses = () => {
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Hãy bắt đầu học nào</h2>
        <a href="#" className="text-purple-600 underline">Học tập</a>
      </div>

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
          {courses.map((course, index) => (
            <div key={index} className="w-80 flex-shrink-0 border rounded-lg overflow-hidden shadow-lg bg-white">
              {/* Hình ảnh và biểu tượng phát */}
              <div className="relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white p-2 rounded-full shadow-md">
                    <i className="fas fa-play text-xl text-black"></i>
                  </button>
                </div>
              </div>
              {/* Nội dung khóa học */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                <p className="text-sm text-gray-800 font-semibold">{course.subtitle}</p>
                <p className="text-gray-700">{course.description}</p>
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

export default FeaturedCourses;
