import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  BarChart2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Award,
  Activity,
  PieChart,
  Clock,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PolicyStatistics = ({ policyId, policyName, onClose }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa sử dụng';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/${policyId}/statistics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Không thể tải thống kê');
      }

      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) {
      fetchStatistics();
    }
  }, [policyId]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-gray-800 rounded-xl p-8">
          <Loader2 className="animate-spin h-8 w-8 text-purple-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Thống kê chính sách</h2>
            <p className="text-gray-400 mt-1">{policyName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">

        {error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : statistics ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Số lần sử dụng</h4>
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{statistics.totalUsageCount}</p>
                <p className="text-xs text-gray-500 mt-1">Lần cuối: {formatDate(statistics.lastUsedAt)}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Tổng doanh thu xử lý</h4>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(statistics.totalRevenueProcessed || 0)}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Thu nhập giảng viên</h4>
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(statistics.totalInstructorShareGenerated || 0)}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Tổng thưởng</h4>
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(statistics.totalBonusGenerated || 0)}</p>
              </div>
            </div>

            {/* Monthly Usage Chart */}
            {statistics.monthlyUsages && statistics.monthlyUsages.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <BarChart2 size={20} className="mr-2 text-green-400" />
                  Sử dụng theo tháng
                </h3>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statistics.monthlyUsages.map(u => ({
                        ...u,
                        period: `T${u.month}/${u.year}`
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="period" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '0.5rem'
                        }}
                        labelStyle={{ color: '#E5E7EB' }}
                        formatter={(value, name) => {
                          if (name === 'instructorCount') return [value, 'Giảng viên'];
                          if (name === 'totalRevenue') return [formatCurrency(value), 'Doanh thu'];
                          if (name === 'totalBonus') return [formatCurrency(value), 'Thưởng'];
                          return [value, name];
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#E5E7EB' }}
                        formatter={(value) => {
                          if (value === 'instructorCount') return 'Số giảng viên';
                          if (value === 'totalRevenue') return 'Doanh thu';
                          if (value === 'totalBonus') return 'Thưởng';
                          return value;
                        }}
                      />
                      <Bar dataKey="instructorCount" fill="#8B5CF6" />
                      <Bar dataKey="totalRevenue" fill="#10B981" />
                      <Bar dataKey="totalBonus" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Distribution Pie Chart */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <PieChart size={20} className="mr-2 text-purple-400" />
                  Phân bổ doanh thu
                </h3>
                
                {statistics.totalRevenueProcessed > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { 
                              name: 'Thu nhập giảng viên', 
                              value: statistics.totalInstructorShareGenerated || 0 
                            },
                            { 
                              name: 'Thưởng', 
                              value: statistics.totalBonusGenerated || 0 
                            },
                            { 
                              name: 'Nền tảng', 
                              value: (statistics.totalRevenueProcessed || 0) - 
                                     (statistics.totalInstructorShareGenerated || 0) - 
                                     (statistics.totalBonusGenerated || 0)
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#8B5CF6" />
                          <Cell fill="#F59E0B" />
                          <Cell fill="#10B981" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '0.5rem'
                          }}
                          formatter={(value) => formatCurrency(value)}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <p>Chưa có dữ liệu</p>
                  </div>
                )}
              </div>

              {/* Monthly Details Table */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar size={20} className="mr-2 text-blue-400" />
                  Chi tiết theo tháng
                </h3>
                
                {statistics.monthlyUsages && statistics.monthlyUsages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-600">
                          <th className="text-left py-2 text-gray-400">Tháng</th>
                          <th className="text-right py-2 text-gray-400">GV</th>
                          <th className="text-right py-2 text-gray-400">Doanh thu</th>
                          <th className="text-right py-2 text-gray-400">Thưởng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics.monthlyUsages.slice(0, 6).map((usage, index) => (
                          <tr key={index} className="border-b border-gray-600">
                            <td className="py-2 text-gray-300">T{usage.month}/{usage.year}</td>
                            <td className="py-2 text-right text-gray-300">{usage.instructorCount}</td>
                            <td className="py-2 text-right text-gray-300">{formatCurrency(usage.totalRevenue)}</td>
                            <td className="py-2 text-right text-gray-300">{formatCurrency(usage.totalBonus)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {statistics.monthlyUsages.length > 6 && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Và {statistics.monthlyUsages.length - 6} tháng khác...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <p>Chưa có dữ liệu chi tiết</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Insights */}
            <div className="bg-gray-700 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-green-400" />
                Phân tích & Đánh giá
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {statistics.totalUsageCount > 0 && (
                  <>
                    <div className="bg-gray-600 rounded-lg p-4">
                      <p className="text-gray-400 mb-1">Doanh thu trung bình/tháng</p>
                      <p className="text-xl font-semibold text-white">
                        {formatCurrency((statistics.totalRevenueProcessed || 0) / statistics.totalUsageCount)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-600 rounded-lg p-4">
                      <p className="text-gray-400 mb-1">Thưởng trung bình/tháng</p>
                      <p className="text-xl font-semibold text-white">
                        {formatCurrency((statistics.totalBonusGenerated || 0) / statistics.totalUsageCount)}
                      </p>
                    </div>
                    
                    {statistics.monthlyUsages && statistics.monthlyUsages.length > 0 && (
                      <>
                        <div className="bg-gray-600 rounded-lg p-4">
                          <p className="text-gray-400 mb-1">Giảng viên TB/tháng</p>
                          <p className="text-xl font-semibold text-white">
                            {Math.round(statistics.monthlyUsages.reduce((sum, u) => sum + u.instructorCount, 0) / statistics.monthlyUsages.length)}
                          </p>
                        </div>
                        
                        <div className="bg-gray-600 rounded-lg p-4">
                          <p className="text-gray-400 mb-1">Tỷ lệ thưởng/doanh thu</p>
                          <p className="text-xl font-semibold text-white">
                            {((statistics.totalBonusGenerated || 0) / (statistics.totalRevenueProcessed || 1) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BarChart2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Không có dữ liệu thống kê</p>
          </div>
        )}
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PolicyStatistics;