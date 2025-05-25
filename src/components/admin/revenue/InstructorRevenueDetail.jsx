// src/components/admin/revenue/InstructorRevenueDetail.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart
} from 'recharts';
import { 
  ChevronLeft, 
  User, 
  DollarSign, 
  Percent, 
  BarChart2, 
  PieChart as PieChartIcon, 
  TrendingUp,
  Calendar,
  Award,
  Target,
  BookOpen
} from 'lucide-react';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const InstructorRevenueDetail = ({
  instructorDetails,
  monthlyRevenue,
  selectedYear,
  selectedMonth,
  onBackClick
}) => {
  const [courseRevenues, setCourseRevenues] = useState([]);
  const [sourceRevenues, setSourceRevenues] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
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

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Fetch additional data
  useEffect(() => {
    if (instructorDetails && instructorDetails.instructorId) {
      fetchCourseRevenues();
      fetchSourceRevenues();
    }
  }, [instructorDetails, selectedMonth, selectedYear]);

  // Fetch course revenues
  const fetchCourseRevenues = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/${instructorDetails.instructorId}/courses?month=${selectedMonth}&year=${selectedYear}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        setCourseRevenues(data);
      }
    } catch (error) {
      console.error("Error fetching course revenues:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch source revenues
  const fetchSourceRevenues = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/${instructorDetails.instructorId}/sources?month=${selectedMonth}&year=${selectedYear}`,
        { headers: getAuthHeaders() }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSourceRevenues(data);
      }
    } catch (error) {
      console.error("Error fetching source revenues:", error);
    }
  };

  // Colors for charts
  const COLORS = {
    revenue: "#4f46e5", // indigo-600
    instructorShare: "#10b981", // emerald-500
    platformShare: "#f59e0b", // amber-500
    ratingBonus: "#ef4444", // red-500
    referral: {
      instructor: "#8b5cf6", // violet-500
      platform: "#06b6d4" // cyan-500
    }
  };

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-2xl p-4 text-sm">
          <p className="font-medium text-white mb-2 text-center">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="font-medium text-gray-300">{entry.name}:</span>
              </div>
              <span className="text-white font-semibold ml-3">
                {entry.name === "Doanh thu" 
                  ? `${entry.value.toLocaleString()} Triệu VNĐ`
                  : formatCurrency(entry.value * 1000000)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-2xl p-3 text-sm">
          <p style={{ color: payload[0].color }} className="font-medium">
            {payload[0].name}: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for charts
  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-sm font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!instructorDetails) return null;

  // Data for pie chart
  const pieData = [
    { 
      name: "Giảng viên giới thiệu", 
      value: instructorDetails.instructorReferredPercentage || 0,
      color: COLORS.referral.instructor
    },
    { 
      name: "Nền tảng giới thiệu", 
      value: 100 - (instructorDetails.instructorReferredPercentage || 0),
      color: COLORS.referral.platform
    }
  ];

  return (
    <motion.div 
      className="space-y-8 font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg">
        <button
          onClick={onBackClick}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
        >
          <ChevronLeft size={18} className="mr-2" />
          Quay lại danh sách
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 bg-gray-800/80 rounded-lg text-gray-200 font-medium flex items-center border border-gray-600/50">
            <Calendar className="mr-2 h-4 w-4 text-blue-400" />
            {getMonthName(selectedMonth)} {selectedYear}
          </div>
          <div className="px-4 py-2 bg-gray-800/80 rounded-lg text-gray-200 font-medium flex items-center border border-gray-600/50">
            <BarChart2 size={18} className="mr-2 text-yellow-400" />
            Năm: {selectedYear}
          </div>
        </div>
      </div>
      
      {/* Instructor header */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-600/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mr-4 shadow-lg">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              {instructorDetails.instructorFirstName} {instructorDetails.instructorLastName}
            </h2>
            <p className="text-gray-400">ID: {instructorDetails.instructorId}</p>
            <p className="text-gray-400 text-sm">{instructorDetails.instructorEmail}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-sm p-6 rounded-xl border border-emerald-500/30 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mr-3">
                <DollarSign size={20} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-300 text-sm font-medium">Tổng doanh thu</p>
                <p className="text-emerald-400 font-bold text-lg">{formatCurrency(instructorDetails.totalRevenue || 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm p-6 rounded-xl border border-blue-500/30 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mr-3">
                <Target size={20} className="text-blue-300" />
              </div>
              <div>
                <p className="text-blue-300 text-sm font-medium">Phần chia GV</p>
                <p className="text-blue-400 font-bold text-lg">{formatCurrency(instructorDetails.instructorShare || 0)}</p>
                <p className="text-blue-300 text-xs">
                  {instructorDetails.totalRevenue > 0 ? formatPercent(((instructorDetails.instructorShare || 0) / instructorDetails.totalRevenue) * 100) : '0%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/30 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center mr-3">
                <Award size={20} className="text-yellow-300" />
              </div>
              <div>
                <p className="text-yellow-300 text-sm font-medium">Thưởng rating</p>
                <p className="text-yellow-400 font-bold text-lg">{formatCurrency(instructorDetails.ratingBonus || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 shadow-lg">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mr-3">
                <Percent size={20} className="text-purple-300" />
              </div>
              <div>
                <p className="text-purple-300 text-sm font-medium">Tổng thu nhập</p>
                <p className="text-purple-400 font-bold text-lg">
                  {formatCurrency((instructorDetails.instructorShare || 0) + (instructorDetails.ratingBonus || 0))}
                </p>
                <p className="text-purple-300 text-xs">
                  {instructorDetails.totalRevenue > 0 ? formatPercent((((instructorDetails.instructorShare || 0) + (instructorDetails.ratingBonus || 0)) / instructorDetails.totalRevenue) * 100) : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Monthly revenue chart */}
      {monthlyRevenue && monthlyRevenue.length > 0 && (
        <motion.div 
          className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <BarChart2 size={20} className="text-blue-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Doanh thu theo tháng năm {selectedYear} (Triệu VNĐ)</h3>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyRevenue}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorShare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.instructorShare} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.instructorShare} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#999" 
                  tick={{ fill: '#cbd5e1' }}
                  axisLine={{ stroke: '#444' }}
                  tickLine={{ stroke: '#444' }}
                />
                <YAxis 
                  stroke="#999" 
                  tick={{ fill: '#cbd5e1' }}
                  axisLine={{ stroke: '#444' }}
                  tickLine={{ stroke: '#444' }}
                  tickFormatter={(value) => `${value}M`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
                
                <Area
                  type="monotone"
                  dataKey="totalRevenueMillions"
                  name="Doanh thu"
                  stroke={COLORS.revenue}
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
                
                <Line
                  type="monotone"
                  dataKey="instructorShare"
                  name="Phần chia GV" 
                  stroke={COLORS.instructorShare}
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 0, fill: COLORS.instructorShare }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />

                <Line
                  type="monotone"
                  dataKey="ratingBonus"
                  name="Thưởng rating" 
                  stroke={COLORS.ratingBonus}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 0, fill: COLORS.ratingBonus }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
      
      {/* Revenue sources and course breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue sources */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <PieChartIcon size={20} className="text-indigo-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Phân bổ doanh thu theo nguồn</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            {sourceRevenues.map((item, index) => (
              <div 
                key={`source-${index}`}
                className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: COLORS.referral[item.sourceType === 'INSTRUCTOR_REFERRED' ? 'instructor' : 'platform'] }}></div>
                  <span className="text-gray-200 font-medium">{item.sourceName}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{formatPercent(item.percentage || 0)}</div>
                  <div className="text-gray-400 text-sm">{formatCurrency(item.revenue || 0)}</div>
                </div>
              </div>
            ))}
          </div>
          
          {pieData.length > 0 && (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
        
        {/* Course breakdown */}
        <motion.div 
          className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-600/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <BookOpen size={20} className="text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Doanh thu theo khóa học</h3>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {courseRevenues.length > 0 ? (
              courseRevenues.map((course, index) => (
                <div 
                  key={`course-${index}`}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium text-sm line-clamp-2">{course.courseTitle}</h4>
                    <span className="text-emerald-400 font-bold text-sm ml-2">
                      {formatCurrency(course.totalRevenue || 0)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Phần chia GV:</span>
                      <span className="text-blue-300 ml-1 font-medium">
                        {formatCurrency(course.instructorShare || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Thưởng rating:</span>
                      <span className="text-yellow-300 ml-1 font-medium">
                        {formatCurrency(course.ratingBonus || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating TB:</span>
                      <span className="text-white ml-1 font-medium">
                        {course.averageRating ? course.averageRating.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Tỷ lệ hoàn:</span>
                      <span className="text-red-300 ml-1 font-medium">
                        {course.refundRate ? formatPercent(course.refundRate * 100) : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Chưa có dữ liệu khóa học cho tháng này</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstructorRevenueDetail;