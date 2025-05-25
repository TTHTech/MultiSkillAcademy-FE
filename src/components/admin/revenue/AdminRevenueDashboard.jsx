// src/components/admin/revenue/AdminRevenueDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  RefreshCw,
  Eye,
  AlertCircle,
  Award,
  Target,
  Zap
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import Toast from "./Toast";
import ErrorBoundary from "./ErrorBoundary";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Main component
const AdminRevenueDashboard = () => {
  // States for dashboard overview
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // States for filtering
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Chart colors
  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initial data load for dashboard overview
  useEffect(() => {
    fetchDashboardSummary();
    fetchMonthlyRevenue();
    fetchTopInstructors();
  }, [selectedYear, selectedMonth]);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json'
    };
  };

  // Fetch dashboard summary data
  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      // Use same endpoint as calculation result for consistency
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/revenue-details?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dashboard data from revenue-details:", data); // Debug log
      
      if (data.success) {
        // Transform data to match dashboard format
        const dashboardData = {
          totalInstructors: data.allInstructors ? data.allInstructors.length : 0,
          totalMonthlyRevenue: data.totalRevenue || 0,
          totalInstructorShare: data.totalInstructorShare || 0,
          totalPlatformShare: data.totalPlatformShare || 0,
          totalRatingBonus: data.totalRatingBonus || 0,
          month: data.month,
          year: data.year
        };
        setDashboardData(dashboardData);
      } else {
        // Fallback to summary endpoint
        fetchSummaryFallback();
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu dashboard: ${error.message}`);
      // Try fallback
      fetchSummaryFallback();
    } finally {
      setLoading(false);
    }
  };

  // Fallback to original summary endpoint
  const fetchSummaryFallback = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/summary`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Dashboard data from summary fallback:", data); // Debug log
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error in summary fallback:", error);
    }
  };

  // Fetch monthly revenue data for charts
  const fetchMonthlyRevenue = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/revenue-details?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Transform data for charts
        if (data.success && data.allInstructors) {
          // Create monthly trend data (simulate for demo)
          const monthlyData = [];
          for (let i = 1; i <= 12; i++) {
            monthlyData.push({
              month: `T${i}`,
              revenue: Math.random() * 1000000000 + 500000000, // Random data for demo
              instructorShare: Math.random() * 400000000 + 200000000,
              platformShare: Math.random() * 300000000 + 150000000,
              growth: Math.random() * 20 - 10 // Random growth rate
            });
          }
          setMonthlyRevenueData(monthlyData);
        }
      }
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  };

  // Fetch top instructors
  const fetchTopInstructors = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues?page=0&size=10&sortBy=totalRevenue&sortDirection=desc&month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: getAuthHeaders()
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          setTopInstructors(data.content);
        }
      }
    } catch (error) {
      console.error("Error fetching top instructors:", error);
    }
  };

  // Handle year selection
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Handle month selection
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  // Format to currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format to short currency (M, B)
  const formatShortCurrency = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Format percentage
  const formatPercent = (value) => {
    return value.toFixed(1) + "%";
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-2xl p-4 text-sm">
          <p className="font-medium text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="text-gray-300">{entry.name}:</span>
              </div>
              <span className="text-white font-semibold ml-3">
                {formatShortCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
            <BarChart3 className="animate-pulse h-8 w-8 text-white" />
          </div>
          <div className="text-gray-300 text-lg font-medium">Đang tải dashboard...</div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 text-red-400 p-6 rounded-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <p className="font-semibold">Lỗi: {error}</p>
        </div>
        <button 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
          onClick={() => {
            setError(null);
            fetchDashboardSummary();
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-gray-700/50 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-blue-400" />
            Tổng quan doanh thu
          </h2>
          <p className="text-gray-400">Dashboard phân tích doanh thu và hiệu suất</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="bg-gray-800/80 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>{getMonthName(i+1)}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="bg-gray-800/80 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>

          <button
            onClick={() => {
              fetchDashboardSummary();
              fetchMonthlyRevenue();
              fetchTopInstructors();
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {dashboardData && (
        <div className="mb-4">
          <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/50 mb-6">
            <p className="text-sm text-gray-300">
              📊 Dữ liệu hiển thị cho: <span className="font-semibold text-white">{getMonthName(selectedMonth)} {selectedYear}</span>
              {dashboardData.month && dashboardData.year && (
                <span className="ml-2 text-blue-400">
                  (API: {dashboardData.month}/{dashboardData.year})
                </span>
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">Tổng giảng viên</p>
                  <p className="text-blue-400 font-bold text-2xl">{dashboardData.totalInstructors || 0}</p>
                  <p className="text-blue-300 text-xs mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Có doanh thu
                  </p>
                </div>
                <div className="p-3 bg-blue-600/20 rounded-full">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-sm font-medium mb-1">Doanh thu tháng</p>
                  <p className="text-emerald-400 font-bold text-2xl">
                    {formatShortCurrency(dashboardData.totalMonthlyRevenue || 0)}
                  </p>
                  <p className="text-emerald-300 text-xs mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {getMonthName(selectedMonth)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-600/20 rounded-full">
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium mb-1">Phần chia GV</p>
                  <p className="text-purple-400 font-bold text-2xl">
                    {formatShortCurrency(dashboardData.totalInstructorShare || 0)}
                  </p>
                  <p className="text-purple-300 text-xs mt-1 flex items-center">
                    <Target className="h-3 w-3 mr-1" />
                    ~{dashboardData.totalMonthlyRevenue > 0 ? formatPercent((dashboardData.totalInstructorShare / dashboardData.totalMonthlyRevenue) * 100) : '0%'}
                  </p>
                </div>
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Target className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-6 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-medium mb-1">Thưởng rating</p>
                  <p className="text-yellow-400 font-bold text-2xl">
                    {formatShortCurrency(dashboardData.totalRatingBonus || 0)}
                  </p>
                  <p className="text-yellow-300 text-xs mt-1 flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Khuyến khích chất lượng
                  </p>
                </div>
                <div className="p-3 bg-yellow-600/20 rounded-full">
                  <Award className="h-8 w-8 text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Trend */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-400" />
              Xu hướng doanh thu ({selectedYear})
            </h3>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorInstructorShare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={formatShortCurrency} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Tổng doanh thu"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="instructorShare"
                  name="Phần chia GV"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorInstructorShare)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Distribution */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-purple-400" />
              Phân bổ doanh thu
            </h3>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          
          {dashboardData && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Phần chia GV', value: dashboardData.totalInstructorShare || 0, color: '#10b981' },
                      { name: 'Phần nền tảng', value: dashboardData.totalPlatformShare || 0, color: '#6366f1' },
                      { name: 'Thưởng rating', value: dashboardData.totalRatingBonus || 0, color: '#f59e0b' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {[
                      { name: 'Phần chia GV', value: dashboardData.totalInstructorShare || 0, color: '#10b981' },
                      { name: 'Phần nền tảng', value: dashboardData.totalPlatformShare || 0, color: '#6366f1' },
                      { name: 'Thưởng rating', value: dashboardData.totalRatingBonus || 0, color: '#f59e0b' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [formatCurrency(value), 'Giá trị']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Instructors Table */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Award className="mr-2 h-5 w-5 text-yellow-400" />
            Top giảng viên theo doanh thu ({getMonthName(selectedMonth)} {selectedYear})
          </h3>
          <span className="text-sm text-gray-400">{topInstructors.length} giảng viên</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-900/50 text-gray-300">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Giảng viên</th>
                <th className="py-3 px-4 text-right">Doanh thu</th>
                <th className="py-3 px-4 text-right">Phần chia</th>
                <th className="py-3 px-4 text-right">Thưởng</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {topInstructors.length > 0 ? (
                topInstructors.map((instructor, index) => (
                  <motion.tr 
                    key={instructor.instructorId} 
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="py-3 px-4 font-medium text-gray-300">
                      <div className="flex items-center">
                        {index < 3 && (
                          <Award className={`h-4 w-4 mr-2 ${
                            index === 0 ? 'text-yellow-400' : 
                            index === 1 ? 'text-gray-300' : 
                            'text-orange-400'
                          }`} />
                        )}
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium mr-3">
                          {instructor.instructorFirstName?.[0]}{instructor.instructorLastName?.[0]}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {instructor.instructorFirstName} {instructor.instructorLastName}
                          </div>
                          <div className="text-gray-400 text-xs">ID: {instructor.instructorId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                      {formatCurrency(instructor.totalRevenue || 0)}
                    </td>
                    <td className="py-3 px-4 text-right text-blue-400 font-medium">
                      {formatCurrency(instructor.instructorShare || 0)}
                    </td>
                    <td className="py-3 px-4 text-right text-yellow-400 font-medium">
                      {formatCurrency(instructor.ratingBonus || 0)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        instructor.paymentStatus === 'PAID' 
                          ? 'bg-green-900/50 text-green-300 border border-green-500/30'
                          : instructor.paymentStatus === 'PARTIAL'
                          ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                          : 'bg-red-900/50 text-red-300 border border-red-500/30'
                      }`}>
                        {instructor.paymentStatus === 'PAID' ? 'Đã trả' 
                         : instructor.paymentStatus === 'PARTIAL' ? 'Trả 1 phần'
                         : 'Chưa trả'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <Users size={48} className="text-gray-500 mb-4" />
                      <p>Chưa có dữ liệu giảng viên cho tháng này.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  );
};

// Main component wrapper with error boundary
const AdminRevenueDashboardWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminRevenueDashboard />
    </ErrorBoundary>
  );
};

export default AdminRevenueDashboardWithErrorBoundary;