import { motion } from "framer-motion";
import { BookOpen, CheckCircle, XCircle, AlertCircle, Folder, BookMarked } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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

// Enhanced stat card with better animations and visual design
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-200">{name}</h3>
          <p className="mt-1 text-3xl font-bold" style={{ color }}>{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>

        <div
          className="p-3 rounded-full bg-opacity-20"
          style={{ backgroundColor: `${color}30` }}
        >
          <Icon className="text-white" style={{ color }} size={24} />
        </div>
      </div>
    </motion.div>
  );
};

const OverviewCards = () => {
  const [categoryStats, setCategoryStats] = useState(null);
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
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login first.");
        setLoading(false);
        return;
      }
      
      try {
        // Fetch both API endpoints in parallel
        const [categoryResponse, courseResponse] = await Promise.all([
          axios.get(`${baseUrl}/api/admin/categories/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseUrl}/api/admin/courses/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        // Update category statistics
        setCategoryStats({
          totalCategories: categoryResponse.data.totalCategories ?? 0,
          activeCategories: categoryResponse.data.activeCategories ?? 0,
          inactiveCategories: categoryResponse.data.inactiveCategories ?? 0,
        });
        
        // Update course statistics
        setCourseStats({
          totalCourses: courseResponse.data.totalCourses ?? 0,
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError(
          err.response?.data?.message || 
          "Failed to load statistics. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
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
        name="Total Categories"
        icon={Folder}
        value={categoryStats.totalCategories.toLocaleString()}
        color="#6366F1"
        description="All categories on platform"
      />
      <StatCard
        name="Active Categories"
        icon={CheckCircle}
        value={categoryStats.activeCategories.toLocaleString()}
        color="#10B981"
        description="Published and visible"
      />
      <StatCard
        name="Inactive Categories"
        icon={XCircle}
        value={categoryStats.inactiveCategories.toLocaleString()}
        color="#EF4444"
        description="Hidden from users"
      />
      <StatCard
        name="Total Courses"
        icon={BookMarked}
        value={courseStats.totalCourses.toLocaleString()}
        color="#8B5CF6"
        description="Across all categories"
      />
    </motion.div>
  );
};

export default OverviewCards;