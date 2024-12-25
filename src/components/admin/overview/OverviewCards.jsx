import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { BookOpen, Users, Tag, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

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
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalSales: 0,
  });
  const [error, setError] = useState(null);

  // Gọi API khi component được tải
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please login first.");
      return;
    }

    axios
      .get("http://localhost:8080/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStats({
          totalCourses: response.data.totalCourses ?? 0,
          totalUsers: response.data.totalUsers ?? 0,
          totalCategories: response.data.totalCategories ?? 0,
          totalSales: response.data.totalSales ?? 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setError("Failed to load stats.");
      });
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
        name="Total Courses"
        icon={BookOpen}
        value={stats.totalCourses.toLocaleString()}
        color="#4CAF50"
      />
      <StatCard
        name="Total Users"
        icon={Users}
        value={stats.totalUsers.toLocaleString()}
        color="#FF6347"
      />
      <StatCard
        name="Total Categories"
        icon={Tag}
        value={stats.totalCategories.toLocaleString()}
        color="#FFA500"
      />
      <StatCard
        name="Total Sales"
        icon={DollarSign}
        value={`₫${stats.totalSales.toLocaleString()}`}
        color="#2196F3"
      />
    </motion.div>
  );
};

export default OverviewCards;
