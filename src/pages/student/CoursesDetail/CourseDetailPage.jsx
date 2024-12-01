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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Lấy thông tin khóa học
        const courseResponse = await axios.get(`https://educoresystem-1.onrender.com/api/student/courses/${courseId}`);
        setCourseData(courseResponse.data);
  
        // Lấy reviews của khóa học
        const reviewsResponse = await axios.get(`https://educoresystem-1.onrender.com/api/student/reviews/${courseId}`);
        
        console.log("Reviews Response: ", reviewsResponse.data); // Thêm log để kiểm tra dữ liệu trả về
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Failed to fetch course details or reviews", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseDetails();
  }, [courseId]);
  

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://educoresystem-1.onrender.com/api/student/cart/add/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

          <CourseContentDetails contentDetails={courseData.courseContent || []} />
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
          <CourseReviews reviews={reviews || []} />
        </div>
        <div className="lg:flex lg:justify-center lg:w-1/4 lg:mr-4 lg:items-start">
          <CourseMedia
            price={courseData.price}
            thumbnail={courseData.imageUrls?.[0] || "default-image-url.jpg"}
            onAddToCart={handleAddToCart}
            onBuyNow={() => alert("Mua ngay")}
            resourceDescription={courseData.resourceDescription || []}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
