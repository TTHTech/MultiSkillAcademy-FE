import React from "react";
import { motion } from "framer-motion";
import {
  Edit2,
  Trash2,
  Eye,
  Copy,
  BarChart2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  AlertCircle,
  Zap
} from "lucide-react";
// Component imports - trong thực tế sẽ import từ file common
// import { PolicyTypeBadge, LoadingSpinner, Pagination } from './common';

// Mock components để demo
const PolicyTypeBadge = ({ type, category }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200 border border-purple-700">
    {type}
  </span>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center gap-2">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50">Prev</button>
    <span className="text-gray-300">{currentPage} / {totalPages}</span>
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50">Next</button>
  </div>
);

const PolicyList = ({
  policies,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onToggleActivation,
  onDuplicate,
  onPreview,
  onViewStats
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading && policies.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && policies.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-red-800">
        <div className="p-6">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 text-white mr-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400">Lỗi khi tải dữ liệu</h3>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Chính sách
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Loại & Danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Tỷ lệ chia sẻ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thưởng & Ưu đãi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Thống kê
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {policies.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                    <span className="text-gray-400 text-lg">Không tìm thấy chính sách nào</span>
                    <p className="text-gray-500 text-sm mt-1">Hãy tạo chính sách mới hoặc điều chỉnh bộ lọc</p>
                  </div>
                </td>
              </tr>
            ) : (
              policies.map((policy, index) => (
                <motion.tr
                  key={policy.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white flex items-center">
                        {policy.active && (
                          <Zap className="h-4 w-4 text-green-400 mr-2" title="Đang hoạt động" />
                        )}
                        {policy.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{policy.description}</div>
                      {policy.validFrom && policy.validTo && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(policy.validFrom).toLocaleDateString('vi-VN')} - {new Date(policy.validTo).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <PolicyTypeBadge type={policy.policyType} category={policy.category} />
                      {policy.priority > 1 && (
                        <span className="text-xs text-gray-400">Độ ưu tiên: {policy.priority}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-300">
                        <span className="font-medium">GV giới thiệu:</span>{' '}
                        {formatPercentage(policy.instructorReferredRate?.default || 0.9)}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        <span className="font-medium">Nền tảng:</span>{' '}
                        {policy.policyType === 'TIERED' ? 'Theo bậc' : formatPercentage(policy.platformReferredRate?.default || 0.5)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {policy.ratingBonusPercentage > 0 && (
                        <div className="text-gray-300">
                          <span className="text-yellow-400">★</span> {formatPercentage(policy.ratingBonusPercentage)} 
                          <span className="text-xs text-gray-400"> (≥{policy.ratingBonusThreshold})</span>
                        </div>
                      )}
                      {policy.eventBonusPercentage > 0 && (
                        <div className="text-green-400 text-xs mt-1">
                          🎁 Thưởng {formatPercentage(policy.eventBonusPercentage)}
                          {policy.minRevenueForBonus > 0 && (
                            <span className="text-gray-400"> (≥{formatCurrency(policy.minRevenueForBonus)})</span>
                          )}
                        </div>
                      )}
                      {policy.maxRefundRate > 0 && (
                        <div className="text-red-400 text-xs mt-1">
                          Hoàn trả tối đa: {formatPercentage(policy.maxRefundRate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {policy.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200 border border-green-700">
                          <CheckCircle size={12} className="mr-1" />
                          Đang hoạt động
                        </span>
                      ) : policy.expired ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200 border border-red-700">
                          <XCircle size={12} className="mr-1" />
                          Đã hết hạn
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                          <Clock size={12} className="mr-1" />
                          Chưa kích hoạt
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-300">
                        Sử dụng: <span className="font-medium">{policy.usageCount}</span> lần
                      </div>
                      {policy.lastUsedAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          Lần cuối: {formatDate(policy.lastUsedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPreview(policy)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Xem trước"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onViewStats(policy)}
                        className="text-green-400 hover:text-green-300 transition-colors"
                        title="Thống kê"
                      >
                        <BarChart2 size={18} />
                      </button>
                      {policy.canBeEdited && (
                        <button
                          onClick={() => onEdit(policy)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => onDuplicate(policy)}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="Sao chép"
                      >
                        <Copy size={18} />
                      </button>
                      {policy.canBeDeleted && (
                        <button
                          onClick={() => onDelete(policy.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {!policy.expired && (
                        <button
                          onClick={() => onToggleActivation(policy)}
                          className={`ml-2 ${
                            policy.active 
                              ? 'bg-gray-600 hover:bg-gray-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center`}
                        >
                          <Zap size={14} className="mr-1" />
                          {policy.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {policies.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={policies.length}
          />
        </div>
      )}
    </motion.div>
  );
};

export default PolicyList;