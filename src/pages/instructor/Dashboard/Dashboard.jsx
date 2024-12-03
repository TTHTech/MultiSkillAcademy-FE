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

const Dashboard = () => {
  const [courseData, setCourseData] = useState({});
  const [salesData, setSalesData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [studentData, setStudentData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const courseResponse = await axios.get(
          "http://localhost:8080/api/instructor/dashboard/courses/2",
          config
        );
        const salesResponse = await axios.get(
          "http://localhost:8080/api/instructor/dashboard/sales/2",
          config
        );
        const reviewResponse = await axios.get(
          "http://localhost:8080/api/instructor/dashboard/reviews/2",
          config
        );
        const studentResponse = await axios.get(
          "http://localhost:8080/api/instructor/dashboard/students/2",
          config
        );

        setCourseData(courseResponse.data);
        setSalesData(salesResponse.data);
        setReviewData(reviewResponse.data);
        setStudentData(studentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Instructor Profile
      </h1>

        {/* Left Section - User Profile */}


        {/* Right Section - Card Data Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-8">
        <CardDataStats title="Total Courses" total={courseData.totalCourses}>
            <svg
              className="fill-current text-primary dark:text-white"
              width="22"
              height="50"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ImBook className="text-primary dark:text-white" size={22} />
            </svg>
          </CardDataStats>

          <CardDataStats title="Total Money" total={`$${salesData.totalSales}`}>
            <svg
              className="fill-current text-primary dark:text-white"
              width="22"
              height="50"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <FaDollarSign
                className="text-primary dark:text-white"
                size={22}
              />
            </svg>
          </CardDataStats>

          <CardDataStats title="Total Reviews" total={reviewData.totalReview}>
            <svg
              className="fill-current text-primary dark:text-white"
              width="22"
              height="50"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <FaStar className="text-primary dark:text-white" size={22} />
            </svg>
          </CardDataStats>

          <CardDataStats
            title="Total Students"
            total={studentData.totalStudent}
          >
            <svg
              className="fill-current text-primary dark:text-white"
              width="22"
              height="50"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <PiStudentFill className="text-primary dark:text-white" size={22} />
            </svg>
          </CardDataStats>
        </div>
      <div className="flex-1">
          <User />
        </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <CourseStats data={courseData} />
        <ReviewsStats data={reviewData} />
      </div>
      <div className="mt-4">
      </div>
      <SalesStats data={salesData} />
    </div>
  );
};

export default Dashboard;
