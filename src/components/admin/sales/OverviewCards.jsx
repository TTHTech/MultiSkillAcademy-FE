import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
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
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    inactiveUsers: 0,
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
      .get("http://localhost:8080/api/admin/students/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserStats({
          totalUsers: response.data.totalStudents ?? 0,
          newUsersToday: response.data.newStudentsToday ?? 0,
          activeUsers: response.data.activeStudents ?? 0,
          inactiveUsers: response.data.inactiveStudents ?? 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching student stats:", error);
        setError("Failed to load student stats.");
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
  );
};

export default OverviewCards;
