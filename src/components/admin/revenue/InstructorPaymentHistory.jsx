// Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Download, 
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import Toast from "./Toast";
import ErrorBoundary from "./ErrorBoundary";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const InstructorPaymentHistory = () => {
  // States
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("totalRevenue");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Auth helpers
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json'
    };
  };

  // Fetch instructors data
  const fetchInstructors = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        return;
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sortBy: sortBy,
        sortDirection: sortDirection,
        month: selectedMonth.toString(),
        year: selectedYear.toString()
      });

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      if (paymentStatusFilter !== 'ALL') {
        params.append('paymentStatus', paymentStatusFilter);
      }

      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues?${params.toString()}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      
      // Use monthly data directly from the API response
      setInstructors(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

    } catch (error) {
      console.error("Error fetching instructors:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Export instructor payment history
  const handleExportInstructorHistory = async (instructorId, instructorName) => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${baseUrl}/api/admin/reports/export/instructor-payment-history/${instructorId}?month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }
        throw new Error(`Export failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LichSu_ThanhToan_${instructorName.replace(/\s+/g, '_')}_${selectedMonth.toString().padStart(2, '0')}_${selectedYear}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("success", `Xuất lịch sử thanh toán cho ${instructorName} thành công!`);
    } catch (error) {
      console.error("Export error:", error);
      showToast("error", `Lỗi khi xuất báo cáo: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  // Handle filter changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
    setCurrentPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setPaymentStatusFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
    setCurrentPage(0);
  };

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchInstructors();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedYear, selectedMonth, paymentStatusFilter, sortBy, sortDirection, currentPage, pageSize]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status, paymentRate) => {
    if (paymentRate >= 100) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã trả đủ
        </span>
      );
    } else if (paymentRate > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Trả một phần
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-500/30">
          <XCircle className="w-3 h-3 mr-1" />
          Chưa trả
        </span>
      );
    }
  };

  if (loading && instructors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
            <Users className="animate-pulse h-8 w-8 text-white" />
          </div>
          <div className="text-gray-300 text-lg font-medium">Đang tải dữ liệu...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-gray-700/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
              <Users className="mr-3 h-7 w-7 text-blue-400" />
              Lịch sử thanh toán giảng viên
            </h1>
            <p className="text-gray-400">Quản lý và xuất báo cáo thanh toán cho tất cả giảng viên</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className="bg-gray-800/80 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>Tháng {i+1}</option>
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
            onClick={fetchInstructors}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-600/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <select
          value={paymentStatusFilter}
          onChange={handleStatusFilterChange}
          className="bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Chưa thanh toán</option>
          <option value="PARTIAL">Thanh toán một phần</option>
          <option value="PAID">Đã thanh toán</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setCurrentPage(0);
          }}
          className="bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
          <option value={100}>100 / trang</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm">Tổng giảng viên</p>
              <p className="text-blue-400 font-bold text-xl">{totalElements}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm">Đã trả đủ</p>
              <p className="text-emerald-400 font-bold text-xl">
                {instructors.filter(i => {
                  const totalEarnings = (i.instructorShare || 0) + (i.ratingBonus || 0);
                  return totalEarnings > 0 && (i.paidAmount || 0) >= totalEarnings;
                }).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-sm">Trả một phần</p>
              <p className="text-yellow-400 font-bold text-xl">
                {instructors.filter(i => {
                  const totalEarnings = (i.instructorShare || 0) + (i.ratingBonus || 0);
                  return (i.paidAmount || 0) > 0 && (i.paidAmount || 0) < totalEarnings;
                }).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm">Chưa trả</p>
              <p className="text-red-400 font-bold text-xl">
                {instructors.filter(i => (i.paidAmount || 0) === 0).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-900/50 text-gray-300">
              <tr>
                <th className="py-3 px-4">Giảng viên</th>
                <th className="py-3 px-4 text-right cursor-pointer hover:bg-gray-700/30" 
                    onClick={() => handleSortChange('totalRevenue')}>
                  Tổng DT ({getMonthName(selectedMonth)} {selectedYear})
                  {sortBy === 'totalRevenue' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="py-3 px-4 text-right">Thu nhập</th>
                <th className="py-3 px-4 text-right">Đã trả</th>
                <th className="py-3 px-4 text-right">Còn lại</th>
                <th className="py-3 px-4 text-center">Tỷ lệ trả</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor, index) => (
                <motion.tr 
                  key={instructor.instructorId}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                        {instructor.instructorFirstName?.[0]}{instructor.instructorLastName?.[0]}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {instructor.instructorFirstName} {instructor.instructorLastName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ID: {instructor.instructorId} • {instructor.instructorEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                    {formatCurrency(instructor.totalRevenue)}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-400 font-medium">
                    {formatCurrency((instructor.instructorShare || 0) + (instructor.ratingBonus || 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-green-400 font-medium">
                    {formatCurrency(instructor.paidAmount)}
                  </td>
                  <td className="py-3 px-4 text-right text-yellow-400 font-medium">
                    {formatCurrency(instructor.remainingAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="text-white font-semibold">
                      {(() => {
                        const totalEarnings = (instructor.instructorShare || 0) + (instructor.ratingBonus || 0);
                        const paymentRate = totalEarnings > 0 ? ((instructor.paidAmount || 0) / totalEarnings) * 100 : 0;
                        return paymentRate.toFixed(1);
                      })()}%
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mt-1">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((() => {
                            const totalEarnings = (instructor.instructorShare || 0) + (instructor.ratingBonus || 0);
                            return totalEarnings > 0 ? ((instructor.paidAmount || 0) / totalEarnings) * 100 : 0;
                          })(), 100)}%` 
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {(() => {
                      const totalEarnings = (instructor.instructorShare || 0) + (instructor.ratingBonus || 0);
                      const paymentRate = totalEarnings > 0 ? ((instructor.paidAmount || 0) / totalEarnings) * 100 : 0;
                      return getPaymentStatusBadge(instructor.paymentStatus, paymentRate);
                    })()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleExportInstructorHistory(
                        instructor.instructorId, 
                        `${instructor.instructorFirstName}_${instructor.instructorLastName}`
                      )}
                      disabled={exportLoading}
                      className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 p-2 hover:bg-blue-500/10 rounded-lg"
                      title="Xuất lịch sử thanh toán"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
            <div className="text-sm text-gray-400">
              Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} của {totalElements} giảng viên
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-300" />
              </button>

              <span className="text-sm text-gray-300 px-3">
                Trang {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

const InstructorPaymentHistoryWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <InstructorPaymentHistory/>
    </ErrorBoundary>
  );
};

export default InstructorPaymentHistoryWithErrorBoundary;