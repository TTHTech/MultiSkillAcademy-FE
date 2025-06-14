import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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
  const [instructorStats, setInstructorStats] = useState({
    totalInstructors: 0,
    newInstructorsToday: 0,
    activeInstructors: 0,
    inactiveInstructors: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please login first.");
      return;
    }

    axios
      .get(`${baseUrl}/api/admin/instructors/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInstructorStats({
          totalInstructors: response.data.totalInstructors ?? 0,
          newInstructorsToday: response.data.newInstructorsToday ?? 0,
          activeInstructors: response.data.activeInstructors ?? 0,
          inactiveInstructors: response.data.inactiveInstructors ?? 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching instructor stats:", error);
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
        name="Tổng số Giảng viên"
        icon={Users}
        value={instructorStats.totalInstructors.toLocaleString()}
        color="#6366F1"
      />
      <StatCard
        name="Giảng viên mới hôm nay"
        icon={UserPlus}
        value={instructorStats.newInstructorsToday}
        color="#10B981"
      />
      <StatCard
        name="Giảng viên đang hoạt động"
        icon={UserCheck}
        value={instructorStats.activeInstructors.toLocaleString()}
        color="#F59E0B"
      />
      <StatCard
        name="Giảng viên không hoạt động"
        icon={UserX}
        value={instructorStats.inactiveInstructors.toLocaleString()}
        color="#EF4444"
      />
    </motion.div>
  );
};

export default OverviewCards;
