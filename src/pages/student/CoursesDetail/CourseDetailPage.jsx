import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

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
  const [student, setStudent] = useState([]);
  const [instructorDetail, setInstructorDetail] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(
          `http://localhost:8080/api/student/courses/${courseId}`
        );
        setCourseData(courseResponse.data);

        const studentResponse = await axios.get(
          `http://localhost:8080/api/student/number-student/${courseId}`
        );
        setStudent(studentResponse.data);

        const instructorDetailResponse = await axios.get(
          `http://localhost:8080/api/student/number-detail/${courseId}`
        );
        setInstructorDetail(instructorDetailResponse.data);

        const reviewsResponse = await axios.get(
          `http://localhost:8080/api/student/reviews/${courseId}`
        );
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
        `http://localhost:8080/api/student/cart/add/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Khóa học đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Failed to add course to cart", error);
      toast.error("Có lỗi xảy ra khi thêm khóa học vào giỏ hàng.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>Không tìm thấy khóa học.</p>;

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto mt-[30px] ">
      <NavBar />
      <div className="container mx-auto max-w-[1600px] px-8 py-8 lg:flex lg:gap-8 lg:pr-16">
        {/* Nội dung bên trái */}
        <div className="lg:w-3/4 overflow-auto">
          <CourseHeader
            title={courseData.title}
            description={courseData.description}
            instructor={`${courseData.instructorFirstName} ${courseData.instructorLastName}`}
            rating={courseData.rating}
            studentCount={courseData.studentCount || student}
            lastUpdated={courseData.updatedAt}
          />
          <CourseContentDetails
            contentDetails={courseData.courseContent || []}
          />
          <CourseContent content={courseData.sections || []} />
          <CourseRequirements
            requirements={courseData.requirements || []}
            description={courseData.description}
            targetAudience={courseData.targetAudience || []}
          />
          <CourseInstructor
            instructor={{
              id: courseData.instructorId,
              name: `${courseData.instructorFirstName} ${courseData.instructorLastName}`,
              title: courseData.instructorTitle || "Giảng viên",
              image:
                courseData.instructorProfileImage || "default-image-url.jpg",
              rating: instructorDetail.rating || 0,
              reviews: instructorDetail.reviews || 0,
              students: instructorDetail.students || 0,
              courses: instructorDetail.courses || 0,
              description: courseData.instructorDescription || "",
            }}
          />
          <CourseReviews reviews={reviews || []} />
        </div>

        {/* Nội dung bên phải */}
        <div className="lg:w-1/4">
          <div
            className="sticky top-24"
            style={{
              height: "fit-content", // Đảm bảo chiều cao phù hợp
            }}
          >
            <CourseMedia
              price={courseData.price}
              thumbnail={courseData.imageUrls?.[0] || "default-image-url.jpg"}
              onAddToCart={handleAddToCart}
              onBuyNow={() => alert("Mua ngay")}
              resourceDescription={courseData.resourceDescription || []}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CourseDetailPage;
