import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Loader2,
  BarChart2,
  Percent,
  Zap
} from "lucide-react";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PolicyPreview = ({ policy, onClose, onApply }) => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${baseUrl}/api/admin/revenue-policies/preview?policyId=${policy.id}&month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu xem trước');
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (error) {
      console.error("Error fetching preview:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policy) {
      fetchPreview();
    }
  }, [policy, month, year]);

  const handleApply = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn áp dụng chính sách "${policy.name}" cho tháng ${month}/${year}?`)) {
      return;
    }

    try {
      setApplying(true);
      
      await onApply({
        policyId: policy.id,
        month: month,
        year: year,
        forceApply: false
      });
      
      onClose();
    } catch (error) {
      console.error("Error applying policy:", error);
      
      // If revenues already exist, ask to force apply
      if (error.message.includes('forceApply')) {
        if (window.confirm('Doanh thu đã được tính cho kỳ này. Bạn có muốn tính lại?')) {
          try {
            await onApply({
              policyId: policy.id,
              month: month,
              year: year,
              forceApply: true
            });
            onClose();
          } catch (forceError) {
            setError(forceError.message);
          }
        }
      } else {
        setError(error.message);
      }
    } finally {
      setApplying(false);
    }
  };

  const monthOptions = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-4xl my-8 mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Xem trước & Áp dụng chính sách</h2>
            <p className="text-gray-400 mt-1">{policy.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Period Selection */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-purple-400" />
            Chọn kỳ áp dụng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tháng</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Năm</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview Data */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-purple-400" />
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center text-red-400">
              <AlertCircle size={20} className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : previewData ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Giảng viên ảnh hưởng</h4>
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{previewData.instructorsAffected}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Tổng doanh thu</h4>
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(previewData.totalRevenueAffected)}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-400">Thưởng sự kiện</h4>
                  <Percent className="h-5 w-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(previewData.totalEventBonus)}</p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-green-400" />
                So sánh trước và sau khi áp dụng
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-400">Chỉ số</th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-400">Hiện tại</th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-400">Sau khi áp dụng</th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-gray-400">Thay đổi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-600">
                      <td className="py-3 px-4 text-sm text-gray-300">Thu nhập giảng viên</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalInstructorShareBefore)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalInstructorShareAfter)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className={previewData.totalInstructorShareAfter > previewData.totalInstructorShareBefore ? 'text-green-400' : 'text-red-400'}>
                          {previewData.totalInstructorShareAfter > previewData.totalInstructorShareBefore ? '+' : ''}
                          {formatCurrency(previewData.totalInstructorShareAfter - previewData.totalInstructorShareBefore)}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="py-3 px-4 text-sm text-gray-300">Thưởng đánh giá</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalRatingBonusBefore)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalRatingBonusAfter)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className={previewData.totalRatingBonusAfter > previewData.totalRatingBonusBefore ? 'text-green-400' : 'text-red-400'}>
                          {previewData.totalRatingBonusAfter > previewData.totalRatingBonusBefore ? '+' : ''}
                          {formatCurrency(previewData.totalRatingBonusAfter - previewData.totalRatingBonusBefore)}
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-600">
                      <td className="py-3 px-4 text-sm text-gray-300">Thu nhập nền tảng</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalPlatformShareBefore)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-300">
                        {formatCurrency(previewData.totalPlatformShareAfter)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className={previewData.totalPlatformShareAfter < previewData.totalPlatformShareBefore ? 'text-green-400' : 'text-red-400'}>
                          {previewData.totalPlatformShareAfter > previewData.totalPlatformShareBefore ? '+' : ''}
                          {formatCurrency(previewData.totalPlatformShareAfter - previewData.totalPlatformShareBefore)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sample Impacts */}
            {previewData.sampleImpacts && previewData.sampleImpacts.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-purple-400" />
                  Ảnh hưởng đến một số giảng viên
                </h3>
                
                <div className="space-y-3">
                  {previewData.sampleImpacts.map((impact, index) => (
                    <div key={index} className="bg-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-white">{impact.instructorName}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-gray-400">
                              Trước: {formatCurrency(impact.revenueBefore)}
                            </span>
                            <ArrowRight size={16} className="text-gray-500" />
                            <span className="text-gray-300">
                              Sau: {formatCurrency(impact.revenueAfter)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${impact.difference > 0 ? 'text-green-400' : impact.difference < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {impact.difference > 0 ? '+' : ''}{formatCurrency(impact.difference)}
                          </div>
                          <div className={`text-sm ${impact.percentageChange > 0 ? 'text-green-400' : impact.percentageChange < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {impact.percentageChange > 0 ? '+' : ''}{formatPercentage(impact.percentageChange)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleApply}
                disabled={applying || loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Đang áp dụng...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    Áp dụng chính sách
                  </>
                )}
              </button>
            </div>
          </>
        ) : null}
      </motion.div>
    </motion.div>
  );
};

export default PolicyPreview;