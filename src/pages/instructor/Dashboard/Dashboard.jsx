import { useEffect, useState } from "react";
import axios from "axios";
import CourseStats from "./CourseStats";
import SalesStats from "./SalesStats";
import ReviewsStats from "./ReviewsStats";
import CardDataStats from "../../../components/instructor/Dashboards/CardDataStats";
import User from "../../../components/instructor/User/User";
import { ImBook } from "react-icons/im";
import { FaDollarSign } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Dashboard = () => {
  const [courseData, setCourseData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [courseResponse, salesResponse, reviewResponse, studentResponse] =
          await Promise.all([
            axios.get(
              `${baseUrl}/api/instructor/dashboard/courses/2`,
              config
            ),
            axios.get(
              `${baseUrl}/api/instructor/dashboard/sales/2`,
              config
            ),
            axios.get(
              `${baseUrl}/api/instructor/dashboard/reviews/2`,
              config
            ),
            axios.get(
              `${baseUrl}/api/instructor/dashboard/students/2`,
              config
            ),
          ]);

        setCourseData(courseResponse.data);
        setSalesData(salesResponse.data);
        setReviewData(reviewResponse.data);
        setStudentData(studentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Không thêm dependency để chỉ chạy khi tải lại.

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Loading data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Instructor Profile
      </h1>
      {/* Cards Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
        <CardDataStats title="Total Courses" total={courseData.totalCourses}>
          <ImBook className="text-blue-500" size={28} />
        </CardDataStats>

        <CardDataStats
          title="Total Money"
          total={`${salesData.totalSales.toLocaleString()} VND`}
        >
          <FaDollarSign className="text-green-500" size={28} />
        </CardDataStats>

        <CardDataStats title="Total Reviews" total={reviewData.totalReview}>
          <FaStar className="text-yellow-500" size={28} />
        </CardDataStats>

        <CardDataStats title="Total Students" total={studentData.totalStudent}>
          <PiStudentFill className="text-purple-500" size={28} />
        </CardDataStats>
      </div>

      {/* User Section */}
      <div className="">
        <User />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg ">
          <CourseStats data={courseData} />
        </div>
        <div className="p-6 rounded-lg">
          <ReviewsStats data={reviewData} />
        </div>
      </div>

      {/* Sales Chart */}
      <div className="p-6 rounded-lg">
        <SalesStats data={salesData} />
      </div>
    </div>
  );
};

export default Dashboard;
