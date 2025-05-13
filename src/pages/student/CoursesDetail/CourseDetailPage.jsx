import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import { RefreshCcw } from "lucide-react";
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseHeader from "../../../components/student/CoursesDetail/CourseHeader";
import CourseMedia from "../../../components/student/CoursesDetail/CourseMedia";
import CourseContent from "../../../components/student/CoursesDetail/CourseContent";
import CourseContentDetails from "../../../components/student/CoursesDetail/CourseContentDetails";
import CourseRequirements from "../../../components/student/CoursesDetail/CourseRequirements";
import CourseReviews from "../../../components/student/CoursesDetail/CourseReviews";
import CourseInstructor from "../../../components/student/CoursesDetail/CourseInstructor";
import { decodeId } from "../../../utils/hash";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CourseDetailPage = () => {
  const { courseHash } = useParams();
  const courseId = decodeId(courseHash);
  const [courseData, setCourseData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState([]);
  const [instructorDetail, setInstructorDetail] = useState([]);

  useEffect(() => {
    console.log("CourseId" + courseId);
    if (!courseId) {
      return;
    }
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(
          `${baseUrl}/api/student/courses/${courseId}`
        );
        setCourseData(courseResponse.data);

        const studentResponse = await axios.get(
          `${baseUrl}/api/student/number-student/${courseId}`
        );
        setStudent(studentResponse.data);

        const instructorDetailResponse = await axios.get(
          `${baseUrl}/api/student/number-detail/${courseId}`
        );
        setInstructorDetail(instructorDetailResponse.data);

        const reviewsResponse = await axios.get(
          `${baseUrl}/api/student/reviews/${courseId}`
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
        `${baseUrl}/api/student/cart/add/${courseId}`,
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 font-semibold animate-pulse">
          Đang tải nội dung khóa học...
        </p>
        <div className="mt-8 w-full max-w-3xl space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-5/6"></div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-md p-6">
        <RefreshCcw className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
        <p className="text-gray-700 mb-6">Không tìm thấy khóa học.</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <RefreshCcw className="w-5 h-5 mr-2" />
          Thử lại
        </button>
      </div>
    );
  }
  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto mt-[30px] ">
      <NavBar />
      <div className="container mx-auto max-w-[1600px] px-8 py-8 lg:flex lg:gap-8 lg:pr-16">
        {/* Nội dung bên trái */}
        <div className="lg:w-3/4 overflow-auto">
          <CourseHeader
            title={courseData.title}
            description={courseData.description}
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
            rating={courseData.rating}
            studentCount={courseData.studentCount || student}
            lastUpdated={courseData.updatedAt}
            lectureCount={courseData.lessonsCount}
            duration={courseData.duration}
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
              promotion={courseData.discount}
              enddate={courseData.endDate}
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
