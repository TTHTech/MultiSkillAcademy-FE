import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";

const userStats = {
  totalUsers: 1200,
  newUsersToday: 50,
  activeUsers: 900,
  churnRate: 5.6,
};

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
  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <StatCard
        name="Total Instructor"
        icon={Users}
        value={userStats.totalUsers.toLocaleString()}
        color="#6366F1"
      />
      <StatCard
        name="New Instructor Today"
        icon={UserPlus}
        value={userStats.newUsersToday}
        color="#10B981"
      />
      <StatCard
        name="Active Instructor"
        icon={UserCheck}
        value={userStats.activeUsers.toLocaleString()}
        color="#F59E0B"
      />
      <StatCard
        name="Churn Rate"
        icon={UserX}
        value={userStats.churnRate}
        color="#EF4444"
      />
    </motion.div>
  );
};

export default OverviewCards;
