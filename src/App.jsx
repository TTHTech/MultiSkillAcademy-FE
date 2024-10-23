import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/admin/common/Sidebar";
import OverviewPage from "./pages/admin/OverviewPage";
import CoursesPage from "./pages/admin/CoursesPage";
import StudentPage from "./pages/admin/StudentPage";
import SalesPage from "./pages/admin/SalesPage";
import OrdersPage from "./pages/admin/OrdersPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import InstructorPage from "./pages/admin/InstructorPage";
import AddNewUserPage from "./pages/admin/AddNewUserPage"; // Import AddNewUserPage
import LoginPage from "./pages/auth/LoginPage"; // Import LoginPage

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Nếu không có token, chuyển hướng đến trang đăng nhập
      navigate("/login");
    } else {
      // Nếu có token, cập nhật trạng thái đã đăng nhập
      setIsLoggedIn(true);
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Kiểm tra đường dẫn, ẩn Sidebar nếu đang ở trang login hoặc logout */}
      {isLoggedIn && location.pathname !== "/login" && location.pathname !== "/logout" && (
        <Sidebar />
      )}

      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Chỉ hiển thị các route này nếu đã đăng nhập */}
        {isLoggedIn && (
          <>
            <Route path="/admin" element={<OverviewPage />} />
            <Route path="/admin/courses" element={<CoursesPage />} />
            <Route path="/admin/student" element={<StudentPage />} />
            <Route path="/admin/instructor" element={<InstructorPage />} />
            <Route path="/admin/sales" element={<SalesPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/add-user" element={<AddNewUserPage />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
