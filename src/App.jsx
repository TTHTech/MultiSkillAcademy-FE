import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/admin/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import CoursesPage from "./pages/admin/CoursesPage";
import StudentPage from "./pages/admin/StudentPage";
import SalesPage from "./pages/admin/SalesPage";
import OrdersPage from "./pages/admin/OrdersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import InstructorPage from "./pages/admin/InstructorPage";
import AddNewUserPage from "./pages/admin/AddNewUserPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OtpVerificationPage from "./pages/auth/OtpVerificationPage";
import StudentHomePage from "./pages/student/home/StudentHomePage";
import CartPage from "./pages/student/cart/CartPage";
import MyCoursesPage from "./pages/student/Enrollment/MyCoursesPage";
import CourseDetailPage from "./pages/student/CoursesDetail/CourseDetailPage";

import PageUser from "./pages/instructor/PageUser";
import PageDashboard from "./pages/instructor/PageDashboard";
import PageCourses from "./pages/instructor/PageCourses/PageCourses";
import PagneCourseDetail from "./pages/instructor/PageCourses/PageCourseDetail";
import PageAdd from "./pages/instructor/PageCourses/PageCoursesAdd";
import PageQuestions from "./pages/instructor/PageQuestions";
import StudentList from "./pages/instructor/PageStudents";
import HocKhoaHoc from "./pages/student/courses/StudyACourse";
import CategoryPage from "./pages/admin/CategoryPage";

import Wishlist from "./pages/student/courses/PageWishlist";
import Test from "./pages/instructor/Test/PageTest";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (
      !token &&
      location.pathname !== "/register" &&
      location.pathname !== "/verify-otp"
    ) {
      navigate("/login");
    } else if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, [navigate, location.pathname]);

  return (
    <>
        {/* Toast Notifications */}
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/instructor/user" element={<PageUser />} />
        <Route path="/instructor/dashboard" element={<PageDashboard />} />
        <Route path="/instructor/courses" element={<PageCourses />} />
        <Route path="/instructor/courses/:id" element={<PagneCourseDetail />} />
        <Route path="/instructor/courses/addCourses" element={<PageAdd />} />
        <Route path="/instructor/questions" element={<PageQuestions />} />
        <Route path="/instructor/students" element={<StudentList />} />
        <Route path="/instructor/tests" element={<Test />} />



        <Route path="/student/study/:id" element={<HocKhoaHoc />} />

        <Route path="/student/wishlist" element={<Wishlist />} />
      </Routes>

      <div className="flex h-screen text-gray-100 overflow-hidden">
        {/* Hiển thị lớp nền chỉ dành cho admin */}
        {isLoggedIn && role === "ROLE_ADMIN" && (
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>
        )}

        {/* Kiểm tra hiển thị Sidebar chỉ cho Admin và không hiển thị trên các trang đăng nhập/xác thực */}
        {isLoggedIn &&
          role === "ROLE_ADMIN" &&
          !["/login", "/register", "/verify-otp"].includes(
            location.pathname
          ) && <Sidebar />}

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />

          {/* Phân biệt các route dựa trên role */}
          {isLoggedIn && role === "ROLE_ADMIN" && (
            <>
              <Route path="/admin" element={<OverviewPage />} />
              <Route path="/admin/courses" element={<CoursesPage />} />
              <Route path="/admin/student" element={<StudentPage />} />
              <Route path="/admin/instructor" element={<InstructorPage />} />
              <Route path="/admin/sales" element={<SalesPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/category" element={<CategoryPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/add-user" element={<AddNewUserPage />} />
            </>
          )}

          {/* Các route cho sinh viên khi role là student */}
          {isLoggedIn && role === "ROLE_STUDENT" && (
            <>
              <Route path="/student/home" element={<StudentHomePage />} />
              <Route path="/student/cart" element={<CartPage />} />
              <Route path="/student/list-my-course" element={<MyCoursesPage />} />
              <Route path="/course/:courseId" element={<CourseDetailPage />} />
              <Route path="/student/wishlist" element={<Wishlist />} />

            </>
          )}

          {/* Các route cho giảng viên khi role là instructor */}
          {isLoggedIn && role === "ROLE_INSTRUCTOR" && (
            <>
              {/* <Route path="/instructor/courses" element={<InstructorPage />} /> */}
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
