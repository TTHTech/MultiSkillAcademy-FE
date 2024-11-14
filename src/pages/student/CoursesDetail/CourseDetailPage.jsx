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
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/student/courses/${courseId}`
        );
        setCourseData(response.data);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Hàm thêm khóa học vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token"); // Lấy JWT token từ local storage
      await axios.post(
        `http://localhost:8080/api/student/cart/add/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );
      alert("Khóa học đã được thêm vào giỏ hàng");
    } catch (error) {
      console.error("Failed to add course to cart", error);
      alert("Có lỗi xảy ra khi thêm khóa học vào giỏ hàng");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>Không tìm thấy khóa học.</p>;

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto">
      <NavBar />
      <div className="container mx-auto px-8 py-8 lg:flex lg:gap-8 lg:pr-16">
        <div className="lg:w-3/4">
          <CourseHeader
            title={courseData.title}
            description={courseData.description}
            instructor={`${courseData.instructorFirstName} ${courseData.instructorLastName}`}
            rating={courseData.rating}
            studentCount={courseData.studentCount || 0}
            lastUpdated={courseData.updatedAt}
          />
          <CourseContentDetails contentDetails={courseData.contentDetails || []} />
          <CourseContent content={courseData.sections || []} />
          <CourseRequirements
            requirements={courseData.requirements || []}
            description={courseData.description}
            targetAudience={courseData.targetAudience || []}
          />
          <CourseInstructor
            instructor={{
              name: `${courseData.instructorFirstName} ${courseData.instructorLastName}`,
              title: courseData.instructorTitle || "Giảng viên",
              image: courseData.instructorProfileImage || "default-image-url.jpg",
              rating: courseData.instructorRating || 0,
              reviews: courseData.instructorReviews || 0,
              students: courseData.instructorStudents || 0,
              courses: courseData.instructorCourses || 1,
              description: courseData.instructorDescription || "",
            }}
          />
          <CourseReviews reviews={courseData.reviews || []} />
        </div>
        <div className="lg:flex lg:justify-center lg:w-1/4 lg:mr-4 lg:items-start">
          <CourseMedia
            price={courseData.price}
            thumbnail={courseData.imageUrls?.[0] || "default-image-url.jpg"}
            onAddToCart={handleAddToCart} // Truyền hàm vào nút "Thêm vào Giỏ Hàng"
            onBuyNow={() => alert("Mua ngay")}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
