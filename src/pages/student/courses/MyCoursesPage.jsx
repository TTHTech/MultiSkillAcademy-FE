// src/pages/student/courses/MyCoursesPage.jsx
import React from "react";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CoursesList from "../../../components/student/courses/CoursesList";

const MyCoursesPage = () => {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto">
      <NavBar /> {/* Thêm NavBar ở đầu trang */}
      
      <div className="container mx-auto p-6 bg-white">
        {/* Tiêu đề với kiểu chữ lớn và màu sắc rõ ràng */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 pb-4">Khóa học của tôi</h1>
        
        {/* Hiển thị danh sách khóa học */}
        <CoursesList />
      </div>
      
      <Footer /> {/* Thêm Footer ở cuối trang, nếu muốn */}
    </div>
  );
};

export default MyCoursesPage;
