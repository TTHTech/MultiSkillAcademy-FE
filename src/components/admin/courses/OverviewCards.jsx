import { motion } from "framer-motion";
import { BookOpen, Hourglass, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

// Animated skeleton loader for cards
const SkeletonCard = () => (
  <div className="bg-gradient-to-r from-[#343D4A] to-[#3B4A59] rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3 w-2/3">
        <div className="h-3 bg-gray-600 rounded w-24"></div>
        <div className="h-6 bg-gray-600 rounded w-16"></div>
      </div>
      <div className="h-12 w-12 rounded-full bg-gray-600"></div>
    </div>
  </div>
);

// Enhanced error component
const ErrorMessage = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-900 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg mb-8 flex items-center"
  >
    <AlertCircle className="mr-3 flex-shrink-0" />
    <p>{message}</p>
  </motion.div>
);

// Enhanced stat card with trend indicator and better animations
const StatCard = ({ name, icon: Icon, value, color, description }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#2A303C] to-[#3B4A59] text-white rounded-xl shadow-lg p-6 border border-opacity-10 transform transition-all hover:scale-105 hover:shadow-xl"
      style={{ borderColor: color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: `0 0 20px ${color}30` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="p-3 rounded-full bg-opacity-20"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="text-white" style={{ color }} size={24} />
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {name}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-3xl font-bold" style={{ color }}>
          {value}
        </p>
        {description && (
          <p className="text-sm text-gray-400">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

const OverviewCards = () => {
  const [courseStats, setCourseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login first.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(
          "http://localhost:8080/api/admin/courses/stats", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setCourseStats({
          totalCourses: response.data.totalCourses ?? 0,
          pendingCourses: response.data.pendingCourses ?? 0,
          activeCourses: response.data.activeCourses ?? 0,
          inactiveCourses: response.data.inactiveCourses ?? 0,
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch course statistics:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load course statistics. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Show loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Show error message if any
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <StatCard
        name="Total Courses"
        icon={BookOpen}
        value={courseStats.totalCourses.toLocaleString()}
        color="#6366F1"
        description="All courses on platform"
      />
      <StatCard
        name="Pending Review"
        icon={Hourglass}
        value={courseStats.pendingCourses.toLocaleString()}
        color="#F59E0B"
        description="Awaiting approval"
      />
      <StatCard
        name="Active Courses"
        icon={CheckCircle}
        value={courseStats.activeCourses.toLocaleString()}
        color="#10B981"
        description="Published and live"
      />
      <StatCard
        name="Inactive Courses"
        icon={XCircle}
        value={courseStats.inactiveCourses.toLocaleString()}
        color="#EF4444"
        description="Unpublished or disabled"
      />
    </motion.div>
  );
};

export default OverviewCards;