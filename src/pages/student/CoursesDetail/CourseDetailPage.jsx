import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseHeader from "../../../components/student/CoursesDetail/CourseHeader";
import CourseMedia from "../../../components/student/CoursesDetail/CourseMedia";
import CourseContent from "../../../components/student/CoursesDetail/CourseContent";
import CourseContentDetails from "../../../components/student/CoursesDetail/CourseContentDetails";
import CourseRequirements from "../../../components/student/CoursesDetail/CourseRequirements";
import CourseReviews from "../../../components/student/CoursesDetail/CourseReviews";
import CourseInstructor from "../../../components/student/CoursesDetail/CourseInstructor";

const CourseDetailPage = () => {
  const { courseId } = useParams(); // Lấy courseId từ URL
  const [courseData, setCourseData] = useState(null); // State để lưu dữ liệu chi tiết khóa học
  const [loading, setLoading] = useState(true); // State để xử lý trạng thái loading

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/courses/${courseId}`
        );
        setCourseData(response.data); // Lưu dữ liệu khóa học vào state
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading khi hoàn tất
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>Không tìm thấy khóa học.</p>;

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto">
      <NavBar /> {/* NavBar ở đầu trang */}
      <div className="container mx-auto px-8 py-8 lg:flex lg:gap-8 lg:pr-16">
        <div className="lg:w-3/4">
          <CourseHeader
            title={courseData.title}
            description={courseData.description}
            instructor={`${courseData.instructorFirstName} ${courseData.instructorLastName}`}
            rating={courseData.rating}
            studentCount={courseData.studentCount || 0} // Số lượng sinh viên (nếu có)
            lastUpdated={courseData.updatedAt} // Ngày cập nhật (nếu có)
          />

          {/* Phần chi tiết nội dung khóa học */}
          <CourseContentDetails
            contentDetails={courseData.contentDetails || []}
          />

          {/* Nội dung chính và yêu cầu của khóa học */}
          <CourseContent content={courseData.sections || []} />
          <CourseRequirements
            requirements={courseData.requirements || []}
            description={courseData.description}
            targetAudience={courseData.targetAudience || []}
          />

          {/* Thông tin giảng viên */}
          <CourseInstructor
            instructor={{
              name: `${courseData.instructorFirstName} ${courseData.instructorLastName}`,
              title: courseData.instructorTitle || "Giảng viên",
              image:
                courseData.instructorProfileImage || "default-image-url.jpg",
              rating: courseData.instructorRating || 0,
              reviews: courseData.instructorReviews || 0,
              students: courseData.instructorStudents || 0,
              courses: courseData.instructorCourses || 1,
              description: courseData.instructorDescription || "",
            }}
          />

          {/* Đánh giá của học viên */}
          <CourseReviews reviews={courseData.reviews || []} />
        </div>

        {/* Phần Sidebar với thông tin về giá và hình ảnh của khóa học */}
        <div className="lg:flex lg:justify-center lg:w-1/4 lg:mr-4 lg:items-start">
          <CourseMedia
            price={courseData.price}
            thumbnail={courseData.imageUrls?.[0] || "default-image-url.jpg"}
            onAddToCart={() => alert("Thêm vào giỏ hàng")}
            onBuyNow={() => alert("Mua ngay")}
          />
        </div>
      </div>
      <Footer /> {/* Footer ở cuối trang */}
    </div>
  );
};

export default CourseDetailPage;
