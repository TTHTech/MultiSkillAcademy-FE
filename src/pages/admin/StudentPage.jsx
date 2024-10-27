import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/admin/common/Header";
import StatCard from "../../components/admin/common/StatCard";
import UsersTable from "../../components/admin/student/StudentTable";
import UserGrowthChart from "../../components/admin/student/StudentGrowthChart";
import UserActivityHeatmap from "../../components/admin/instructor/InstructorActivityHeatmap";
import UserDemographicsChart from "../../components/admin/student/StudentDemographicsChart";

const UsersPage = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [error, setError] = useState(null); // Để xử lý lỗi

  // Gọi API khi component được tải
  useEffect(() => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Kiểm tra nếu không có token
    if (!token) {
      setError("No token found, please login first.");
      return;
    }

    axios.get("http://localhost:8080/api/admin/students/stats", {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
      }
    })
    .then((response) => {
      console.log("API response:", response.data);  // Thêm log để kiểm tra phản hồi API
      setUserStats({
        totalUsers: response.data.totalStudents ?? 0,  // Sử dụng nullish coalescing để hiển thị 0 khi giá trị null hoặc undefined
        newUsersToday: response.data.newStudentsToday ?? 0,
        activeUsers: response.data.activeStudents ?? 0,
        inactiveUsers: response.data.inactiveStudents ?? 0,
      });
    })
    .catch((error) => {
      console.error("Error fetching student stats:", error.response ? error.response.data : error.message);
      setError("Failed to load student stats. Please check the console for more details.");
    });
  }, []);

  if (error) {
    return <div>Error: {error}</div>; // Hiển thị lỗi nếu xảy ra
  }
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Users" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Student"
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Student Today"
            icon={UserPlus}
            value={userStats.newUsersToday.toLocaleString()}
            color="#10B981"
          />
          <StatCard
            name="Active Student"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Inactive Student"
            icon={UserX}
            value={userStats.inactiveUsers.toLocaleString()}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable />

        {/* USER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <UserGrowthChart />
          <UserActivityHeatmap />
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
