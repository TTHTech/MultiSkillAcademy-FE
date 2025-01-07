import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/admin/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import CoursesPage from "./pages/admin/CoursesPage";
import StudentPage from "./pages/admin/StudentPage";
import SalesPage from "./pages/admin/SalesPage.jsx";
import SalePage from "./pages/admin/DemoPage.jsx";
import ReviewPage from "./pages/admin/ReviewPage.jsx";
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
import CategoryStudentPage from "./pages/student/category/CategoryStudentPage";
import PageUser from "./pages/instructor/PageUser";
import PageDashboard from "./pages/instructor/PageDashboard";
import PageCourses from "./pages/instructor/PageCourses/PageCourses";
import PagneCourseDetail from "./pages/instructor/PageCourses/PageCourseDetail";
import PageAdd from "./pages/instructor/PageCourses/PageCoursesAdd";
import StudentList from "./pages/instructor/PageStudents";
import CourseViewerPage from "./pages/student/content/CourseViewerPage.jsx";
import CategoryPage from "./pages/admin/CategoryPage";
import Wishlist from "./pages/student/courses/PageWishlist";
import Test from "./pages/instructor/Test/PageTest";
import ForgotPassPage from "./pages/auth/ForgotPassPage";
import ResetPassPage from "./pages/auth/ResetPassPage";
import SuccessPage from "./pages/student/cart/SuccessPage";
import Logout from "./components/auth/Logout.jsx";
import PageReview from "./pages/instructor/PageReview";
import PageSales from "./pages/instructor/PageSales";
import ProfilePage from "./pages/student/profile/ProfilePage.jsx";
import QuizPage from "./pages/student/quiz/QuizPage";
import ResultPage from "./pages/student/quiz/ResultPage";
import SearchCoursePage from "./pages/student/search/SearchCoursePage";
import PageViewScores from "./pages/instructor/PageViewScores";
import CertificateGenerator from "./components/student/certificate/Certificate.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import RegisterForm from "./components/auth/RegisterForm.jsx";
import OtpVerificationForm from "./components/auth/OtpVerificationForm.jsx";
import ForgotPassForm from "./components/auth/ForgotPassForm.jsx";
import ResetPassForm from "./components/auth/ResetPassForm.jsx";
import PageQuestions from "./pages/instructor/PageQuestions/PageQuestions.jsx";
import NotificationList from "./components/student/notification/NotificationList.jsx";
import ChatPage from "./pages/student/chat/ChatPage.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
  
    // Các trang không yêu cầu xác thực
    const noAuthPages = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];
  
    // Nếu không có token và không phải các trang không yêu cầu xác thực, chuyển hướng về login
    if (!token && !noAuthPages.includes(location.pathname)) {
      navigate("/login");
    } else if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, [navigate, location.pathname]);
  

  // Kiểm tra xem trang hiện tại có phải là trang admin không
  const isAdminLayout =
    isLoggedIn && role === "ROLE_ADMIN" && !["/login", "/register", "/verify-otp", "/forgot-password"].includes(location.pathname);

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        {/* Các route cho sinh viên */}
        {/* ... các route khác */}
      </Routes>

      {/* Áp dụng flex h-screen chỉ cho các trang admin */}
      <div className={isAdminLayout ? "flex h-screen" : ""}>
        {/* Hiển thị lớp nền chỉ dành cho admin */}
        {isLoggedIn && role === "ROLE_ADMIN" && (
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>
        )}

        {/* Sidebar chỉ hiển thị cho Admin */}
        {isLoggedIn &&
          role === "ROLE_ADMIN" &&
          !["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"].includes(location.pathname) && (
            <Sidebar />
          )}

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-otp" element={<OtpVerificationForm/>} />
          <Route path="/forgot-password" element={<ForgotPassForm />} />
          <Route path="/reset-password" element={<ResetPassForm />} />
          <Route path="/student/quiz/:id" element={<QuizPage />} />
          <Route path="/certificate" element={<CertificateGenerator />} />
          <Route path="/search" element={<SearchCoursePage />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          {/* Các route cho admin */}
          {isLoggedIn && role === "ROLE_ADMIN" && (
            <>
              <Route path="/admin" element={<OverviewPage />} />
              <Route path="/admin/courses" element={<CoursesPage />} />
              <Route path="/admin/student" element={<StudentPage />} />
              <Route path="/admin/instructor" element={<InstructorPage />} />
              <Route path="/admin/statistics" element={<SalesPage />} />
              <Route path="/admin/sale" element={<SalePage />} />
              <Route path="/admin/category" element={<CategoryPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/add-user" element={<AddNewUserPage />} />
              <Route path="/admin/review" element={<ReviewPage />} />
            </>
          )}

          {/* Các route cho sinh viên */}
          {isLoggedIn && role === "ROLE_STUDENT" && (
            <>
              <Route path="/student/home" element={<StudentHomePage />} />
              <Route path="/student/cart" element={<CartPage />} />
              <Route path="/student/list-my-course" element={<MyCoursesPage />} />
              <Route path="/student/notification" element={<NotificationList/>} />
              <Route path="/student/profile" element={<ProfilePage />} />
              <Route path="/category/:categoryId" element={<CategoryStudentPage />} />
              <Route path="/student/study/:progress/:id" element={<CourseViewerPage />} />
              <Route path="/student/wishlist" element={<Wishlist />} />
              <Route path="/student/chat" element={<ChatPage />} />
              <Route path="/student/Success" element={<SuccessPage />} />
              <Route path="/student/payment/success" element={<SuccessPage />} />
              <Route path="/student/result" element={<ResultPage />} />
              
            </>
          )}

          {/* Các route cho giảng viên */}
          {isLoggedIn && role === "ROLE_INSTRUCTOR" && (
            <>
              <Route path="/instructor/user" element={<PageUser />} />
              <Route path="/instructor/dashboard" element={<PageDashboard />} />
              <Route path="/instructor/courses" element={<PageCourses />} />
              <Route path="/instructor/courses/:id" element={<PagneCourseDetail />} />
              <Route path="/instructor/courses/addCourses" element={<PageAdd />} />
              <Route path="/instructor/review" element={<PageReview />} />
              <Route path="/instructor/students" element={<StudentList />} />
              <Route path="/instructor/sales" element={<PageSales />} />
              <Route path="/instructor/tests" element={<Test />} />
              <Route path="/instructor/scores" element={<PageViewScores />} />
              <Route path="/instructor/questions" element={<PageQuestions />} />
            </>
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
