import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Users, Tag, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-[#343D4A] to-[#3B4A59] rounded-xl p-6"
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-600 rounded"></div>
                <div className="h-8 w-32 bg-gray-600 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-gray-600 rounded-full"></div>
            </div>
            <div className="mt-4 h-4 w-20 bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ name, icon: Icon, value, color, trend }) => {
  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown;

  return (
    <motion.div
      className="bg-gradient-to-r from-[#343D4A] to-[#3B4A59] rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">{name}</h3>
        <div
          className="p-3 rounded-full bg-opacity-20"
          style={{ backgroundColor: color }}
        >
          <Icon className="text-white" size={24} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend !== undefined && (
          <div className="flex items-center space-x-1">
            <TrendIcon size={16} className={trendColor} />
            <span className={`text-sm ${trendColor}`}>
              {Math.abs(trend)}% vs last month
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg mb-8"
  >
    {message}
  </motion.div>
);

const OverviewCards = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalSales: 0,
    trends: {
      courses: 0,
      users: 5.2,
      categories: -2.1,
      sales: 12.5,
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please login again.");
        }

        const response = await axios.get("http://localhost:8080/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats({
          totalCourses: response.data.totalCourses ?? 0,
          totalUsers: response.data.totalUsers ?? 0,
          totalCategories: response.data.totalCategories ?? 0,
          totalSales: response.data.totalSales ?? 0,
          trends: response.data.trends ?? {
            courses: 0,
            users: 0,
            categories: 0,
            sales: 0,
          },
        });
      } catch (error) {
        let errorMessage = "Failed to load statistics.";
        if (error.response?.status === 401) {
          errorMessage = "Session expired. Please login again.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        setError(errorMessage);
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const cards = [
    {
      name: "Total Courses",
      icon: BookOpen,
      value: stats.totalCourses.toLocaleString(),
      color: "#4CAF50",
      trend: stats.trends.courses
    },
    {
      name: "Total Users",
      icon: Users,
      value: stats.totalUsers.toLocaleString(),
      color: "#FF6347",
      trend: stats.trends.users
    },
    {
      name: "Total Categories",
      icon: Tag,
      value: stats.totalCategories.toLocaleString(),
      color: "#FFA500",
      trend: stats.trends.categories
    },
    {
      name: "Total Sales",
      icon: DollarSign,
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(stats.totalSales),
      color: "#2196F3",
      trend: stats.trends.sales
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          staggerChildren: 0.1
        }}
      >
        {cards.map((card, index) => (
          <StatCard
            key={card.name}
            {...card}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default OverviewCards;