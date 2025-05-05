import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, Users, Tag, DollarSign, TrendingUp, TrendingDown, AlertCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Enhanced loading skeleton with more professional appearance
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-blue-900/30 p-5 shadow-lg"
        >
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-700 rounded"></div>
                <div className="h-7 w-32 bg-slate-700 rounded"></div>
              </div>
              <div className="h-12 w-12 bg-slate-700/70 rounded-full"></div>
            </div>
            <div className="mt-3 h-3.5 w-20 bg-slate-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced stat card with better visual design
const StatCard = ({ name, icon: Icon, value, color, trend, delay = 0 }) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendText = isPositive ? "increase" : "decrease";

  // Map of color values to tailwind gradient classes
  const gradientMap = {
    "#4CAF50": "from-emerald-600/20 to-emerald-500/10 border-emerald-600/30", // Green
    "#FF6347": "from-rose-600/20 to-rose-500/10 border-rose-600/30",         // Red
    "#FFA500": "from-amber-600/20 to-amber-500/10 border-amber-600/30",      // Orange
    "#2196F3": "from-blue-600/20 to-blue-500/10 border-blue-600/30",         // Blue
  };

  const gradient = gradientMap[color] || "from-slate-700 to-slate-800 border-slate-600/30";
  
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl border p-5 hover:shadow-2xl transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300 tracking-wide">{name}</h3>
        <div
          className="p-2.5 rounded-lg bg-opacity-20 shadow-inner"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="text-white" size={20} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        {trend !== undefined && (
          <div className="flex items-center space-x-1.5">
            <TrendIcon size={16} className={trendColor} />
            <span className={`text-xs font-medium ${trendColor}`}>
              {Math.abs(trend)}% {trendText} vs last month
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Enhanced error message with retry option
const ErrorMessage = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4"
  >
    <div className="flex items-start gap-3">
      <AlertCircle className="text-red-400 w-5 h-5 mt-0.5" />
      <p className="text-red-300 text-sm">{message}</p>
    </div>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="mt-2 sm:mt-0 sm:ml-auto px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
      >
        <RefreshCcw size={12} />
        Try Again
      </button>
    )}
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await axios.get(`${baseUrl}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add cache busting parameter
        params: { timestamp: new Date().getTime() }
      });

      // Short delay to ensure UI transition is visible on fast connections
      setTimeout(() => {
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
        setLoading(false);
        setRefreshing(false);
      }, 300);
    } catch (error) {
      let errorMessage = "Failed to load statistics.";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
      console.error("Error fetching stats:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(stats.totalSales),
      color: "#2196F3",
      trend: stats.trends.sales
    }
  ];

  if (loading && !refreshing) {
    return <LoadingSkeleton />;
  }

  return (
    <AnimatePresence>
      {error && <ErrorMessage message={error} onRetry={() => fetchStats(true)} />}
      
      <div className="relative">
        {/* Overlay loading indicator during refresh */}
        {refreshing && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCcw size={24} className="text-blue-400 animate-spin" />
              <p className="text-slate-300 text-sm">Refreshing stats...</p>
            </div>
          </div>
        )}
        
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {cards.map((card, index) => (
            <StatCard
              key={card.name}
              {...card}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OverviewCards;