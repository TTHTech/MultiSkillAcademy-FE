import { motion } from "framer-motion";
import { BookOpen, CheckCircle, XCircle } from "lucide-react"; // Cập nhật các biểu tượng
import { useState, useEffect } from "react";
import axios from "axios";

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-[#343D4A] to-[#3B4A59] text-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-200">{name}</h3>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>

        <div
          className="p-3 rounded-full bg-opacity-20"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );
};

const OverviewCards = () => {
  const [categoryStats, setCategoryStats] = useState({
    totalCategories: 0,
    activeCategories: 0,
    inactiveCategories: 0,
  });
  const [courseStats, setCourseStats] = useState({
    totalCourses: 0,
  });
  const [error, setError] = useState(null);

  // Gọi API khi component được tải
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please login first.");
      return;
    }

    // Gọi đồng thời 2 API
    const fetchData = async () => {
      try {
        const [categoryResponse, courseResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/categories/stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8080/api/admin/courses/stats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Cập nhật thống kê danh mục
        setCategoryStats({
          totalCategories: categoryResponse.data.totalCategories ?? 0,
          activeCategories: categoryResponse.data.activeCategories ?? 0,
          inactiveCategories: categoryResponse.data.inactiveCategories ?? 0,
        });

        // Cập nhật thống kê khóa học
        setCourseStats({
          totalCourses: courseResponse.data.totalCourses ?? 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load stats.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard
        name="Total Categories"
        icon={BookOpen}
        value={categoryStats.totalCategories.toLocaleString()}
        color="#6366F1"
      />
      <StatCard
        name="Active Categories"
        icon={CheckCircle}
        value={categoryStats.activeCategories.toLocaleString()}
        color="#10B981"
      />
      <StatCard
        name="Inactive Categories"
        icon={XCircle}
        value={categoryStats.inactiveCategories.toLocaleString()}
        color="#EF4444"
      />
      <StatCard
        name="Total Courses"  // Hiển thị tổng số khóa học
        icon={BookOpen}
        value={courseStats.totalCourses.toLocaleString()}
        color="#6366F1"
      />
    </motion.div>
  );
};

export default OverviewCards;
