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
// import PageUser from "./pages/instructor/PageUser";
import PageDashboard from "./pages/instructor/PageDashboard";
import PageCourses from "./pages/instructor/PageCourses/PageCourses";
import PagneCourseDetail from "./pages/instructor/PageCourses/PageCourseDetail";
import PageAdd from "./pages/instructor/PageCourses/PageCoursesAdd";
import StudentList from "./pages/instructor/PageStudent/PageStudents";
import CourseViewerPage from "./pages/student/content/CourseViewerPage.jsx";
import CategoryPage from "./pages/admin/CategoryPage";
import Wishlist from "./pages/student/courses/PageWishlist";
import Test from "./pages/instructor/Test/PageTest";
import ForgotPassPage from "./pages/auth/ForgotPassPage";
import ResetPassPage from "./pages/auth/ResetPassPage";
import SuccessPage from "./pages/student/cart/SuccessPage";
import Logout from "./components/auth/Logout.jsx";
import PageReview from "./pages/instructor/PageReview/PageReview";
import PageSales from "./pages/instructor/PageSales/PageSales.jsx";
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
import NotificationPage from "./pages/admin/NotificationPage";
import AddNotificationPage from "./pages/admin/AddNotificationPage";
import AdminChatPage from "./pages/admin/AdminChatPage";
import PageProfileInstructor from "./pages/student/ProfileInstructor/PageProfileInstructor";
import ReminderPage from "./pages/student/Reminder/ReminderPage.jsx";
import PageSearchCourse from "./pages/instructor/PageSearchCourse/PageSearchCourse";
import SaleByInstructorPage from "./pages/admin/SaleByInstructorPage.jsx";
import UpdateCourse from "./pages/instructor/PageCourses/UpdateCourse.jsx";
import PageReviewCourse from "./pages/admin/PageReviewCourse";
import PageSection from "./pages/admin/PageSection";
import PageLecture from "./pages/admin/PageLecture";
import InstructorChatPage from "./pages/instructor/InstructorChatPage.jsx";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";
import GitHubCallbackPage from "./pages/auth/GitHubCallbackPage";
import PageProfile from "./pages/instructor/PageProfile/PageProfile.jsx";
import AdminRevenuePolicyTable from "./components/admin/policy/AdminRevenuePolicyContainer.jsx";
import AdminRevenueDashboard from "./components/admin/revenue/AdminRevenueDashboard.jsx";
import PageCreateDiscounts from "./pages/admin/PageCreateDiscount.jsx"
import PageDiscount from "./pages/admin/PageDiscount.jsx"
import PageDiscountUsage from "./pages/admin/PageDiscountUsage.jsx"
import AdminInstructorRevenue from "./components/admin/revenue/AdminInstructorRevenueContainer.jsx";
import AdminInstructorSales from "./components/admin/revenue/AdminInstructorSales.jsx";
import PageDiscountInstructor from "./pages/instructor/PageDiscount/PageDiscount.jsx";
import PageBrowseDiscount from "./pages/admin/PageBrowseDiscount.jsx";
import PageReportReviewCourse from "./pages/admin/PageReportReviewCourse.jsx";
import PageCreatePromotion from "./pages/admin/PageCreatePromotion.jsx";
import PagePromotion from "./pages/admin/PagePromotion.jsx"
import PagePromotionUsage from "./pages/admin/PagePromotionUsage.jsx"
import TopicCoursesPage from "./pages/student/topic/TopicCoursesPage.jsx";
import PageAdminProfile from "./pages/admin/PageAdminProfile.jsx"
import PgaeNotifications from "./pages/student/notifications/PgaeNotifications.jsx";
import PageNotification from "./pages/instructor/Notification/PageNotification.jsx";
import ReviewStatisticsPage from "./pages/admin/ReviewStatisticsPage.jsx";
import CoursesStatisticsPage from "./pages/admin/CoursesStatisticsPage.jsx";
import AdminPaymentContainer from "./components/admin/revenue/AdminPaymentContainer.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
  
    // Cập nhật để bao gồm các trang callback OAuth
    const noAuthPages = [
      "/login", 
      "/register", 
      "/verify-otp", 
      "/forgot-password", 
      "/reset-password",
      "/auth/callback",
      "/auth/github/callback"
    ];
  
    if (!token && !noAuthPages.includes(location.pathname)) {
      navigate("/login");
    } else if (token) {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, [navigate, location.pathname]);

  // Kiểm tra có phải route admin không
  const isAdminRoute = 
    isLoggedIn && 
    role === "ROLE_ADMIN" && 
    location.pathname.startsWith("/admin");

  // Kiểm tra hiển thị admin layout
  const shouldShowAdminLayout = 
    isLoggedIn && 
    role === "ROLE_ADMIN" && 
    location.pathname.startsWith("/admin");

  // Kiểm tra hiển thị sidebar
  const shouldShowSidebar = 
    isLoggedIn && 
    role === "ROLE_ADMIN" && 
    !["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <div className={shouldShowAdminLayout ? "flex h-screen overflow-visible relative" : ""}>
        {/* Gradient background chỉ dành cho admin routes */}
        {isAdminRoute && (
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>
        )}

        {/* Sidebar chỉ hiển thị cho Admin */}
        {shouldShowSidebar && <Sidebar />}

        {/* Main Content */}
        <div className={`${isAdminRoute ? 'flex-1 overflow-auto z-10' : 'w-full'}`}>
          <Routes>
            {/* Auth Routes - Không yêu cầu đăng nhập */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/verify-otp" element={<OtpVerificationForm/>} />
            <Route path="/forgot-password" element={<ForgotPassForm />} />
            <Route path="/reset-password" element={<ResetPassForm />} />
            <Route path="/auth/callback" element={<GoogleCallbackPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
            
            {/* Public Routes - Bất kỳ ai cũng có thể truy cập */}
            <Route path="/search" element={<SearchCoursePage />} />
            <Route path="/course/:courseHash" element={<CourseDetailPage />} />

            {/* Đường dẫn quan trọng - luôn available, không phụ thuộc vào điều kiện */}
            <Route path="/student/home" element={<StudentHomePage />} />
            <Route path="/student/quiz/:id" element={<QuizPage />} />
            <Route path="/certificate" element={<CertificateGenerator />} />

            {/* Admin Routes */}
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
                <Route path="/admin/notification" element={<NotificationPage />} />
                <Route path="/admin/add-notification" element={<AddNotificationPage />} />
                <Route path="/admin/chat" element={<AdminChatPage />} />
                <Route path="/admin/sale-by-instructor" element={<SaleByInstructorPage />} />
                <Route path="/admin/statistics-review" element={<ReviewStatisticsPage />} />
                <Route path="/admin/statistics-courses" element={<CoursesStatisticsPage />} />
                <Route path="/admin/courses/reviews" element={<PageReviewCourse />} />
                <Route path="/admin/courses/sections" element={<PageSection />} />
                <Route path="/admin/courses/lectures" element={<PageLecture />} />
                <Route path="/admin/revenue-dashboard" element={<AdminRevenueDashboard  />} />
                <Route path="/admin/revenue-policy" element={<AdminRevenuePolicyTable />} />
                <Route path="/admin/instructor-revenue" element={<AdminInstructorRevenue />} />
                <Route path="/admin/instructor-sales" element={<AdminInstructorSales />} />

                <Route path="/admin/discounts" element={<PageDiscount />} />
                <Route path="/admin/discount/add" element={<PageCreateDiscounts />} />
                <Route path="/admin/discount-usage" element={<PageDiscountUsage />} />
                <Route path="/admin/browsed-discounts" element={<PageBrowseDiscount />} />
                <Route path="/admin/report/review-course" element={<PageReportReviewCourse/>} />
                <Route path="/admin/promotions/add" element={<PageCreatePromotion />} />
                <Route path="/admin/promotions" element={<PagePromotion />} />
                <Route path="/admin/promotions-usage" element={<PagePromotionUsage />} />
                <Route path="/admin/profile-admin" element={<PageAdminProfile />} />
                <Route path="/admin/payments" element={<AdminPaymentContainer />} />
              </>
            )}
            
            {/* Student Routes - trừ những route đã được đặt bên ngoài */}
            {isLoggedIn && role === "ROLE_STUDENT" && (
              <>
                <Route path="/student/cart" element={<CartPage />} />
                <Route path="/student/list-my-course" element={<MyCoursesPage />} />
                <Route path="/student/notification" element={<NotificationList/>} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/category/:categoryId" element={<CategoryStudentPage />} />
                <Route path="/student/study/:progressHash/:courseHash" element={<CourseViewerPage />} />
                <Route path="/student/wishlist" element={<Wishlist />} />
                <Route path="/student/chat" element={<ChatPage />} />
                <Route path="/student/Success" element={<SuccessPage />} />
                <Route path="/student/payment/success" element={<SuccessPage />} />
                <Route path="/student/result" element={<ResultPage />} />
                <Route path="/student/profile-instructor/:id" element={<PageProfileInstructor />} />
                <Route path="/student/reminder" element={<ReminderPage />} />
                <Route path="/topic/:topicPath" element={<TopicCoursesPage />} />
                <Route path="/student/notifications" element={<PgaeNotifications />} />
              </>
            )}
            
            {/* Instructor Routes */}
            {isLoggedIn && role === "ROLE_INSTRUCTOR" && (
              <>
                {/* <Route path="/instructor/user" element={<PageUser />} /> */}
                <Route path="/instructor/dashboard" element={<PageDashboard />} />
                <Route path="/instructor/courses" element={<PageCourses />} />
                <Route path="/instructor/addCourses" element={<PageAdd />} />
                <Route path="/instructor/review" element={<PageReview />} />
                <Route path="/instructor/students" element={<StudentList />} />
                <Route path="/instructor/sales" element={<PageSales />} />
                <Route path="/instructor/tests" element={<Test />} />
                <Route path="/instructor/scores" element={<PageViewScores />} />
                <Route path="/instructor/questions" element={<PageQuestions />} />
                <Route path="/instructor/search" element={<PageSearchCourse />} />
                <Route path="/instructor/courses/:id" element={<UpdateCourse />} />
                <Route path="/instructor/chat" element={<InstructorChatPage />} />
                <Route path="/instructor/user" element={<PageProfile />} />
                <Route path="/instructor/discount" element={<PageDiscountInstructor />} />
                <Route path="/instructor/notifications" element={<PageNotification />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;