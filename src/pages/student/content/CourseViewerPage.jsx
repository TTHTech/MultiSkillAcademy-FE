import React, { useEffect } from "react";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseViewer from "../../../components/student/content/CourseViewer.jsx"; // Đảm bảo import đúng
import { useParams } from "react-router-dom";
import { decodeId } from '../../../utils/hash';

const CourseViewerPage = () => {
  const { courseHash } = useParams();
  const id = decodeId(courseHash);

  // Thêm padding-bottom cho body khi component mount
  useEffect(() => {
    // Lưu lại giá trị cũ của padding-bottom
    const originalPaddingBottom = document.body.style.paddingBottom;
    
    // Thêm padding-bottom để tạo không gian cho sidebar
    document.body.style.paddingBottom = "0";
    
    // Clean up khi component unmount
    return () => {
      document.body.style.paddingBottom = originalPaddingBottom;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>

      {/* Content */}
      <div className="flex-grow bg-gray-100 pb-0">
        <CourseViewer id={id} /> {/* Truyền id khóa học cho CourseViewer */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseViewerPage;
