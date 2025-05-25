// src/components/admin/revenue/InstructorRevenueList.jsx
import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  DollarSign,
  Calendar,
  Filter,
  Lock,
  Loader2,
  TrendingUp,
  Award
} from "lucide-react";

const InstructorRevenueList = ({
  instructorRevenues,
  currentPage,
  totalPages,
  itemCount,
  searchTerm,
  sortField,
  sortDirection,
  selectedYear,
  selectedMonth,
  onSearch,
  onSort,
  onYearChange,
  onPageChange,
  onInstructorSelect,
  isMonthLocked,
  loading = false
}) => {
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

  // Handle search input
  const handleSearchInput = (e) => {
    onSearch(e.target.value);
  };

  // Handle year change
  const handleYearChange = (e) => {
    onYearChange(parseInt(e.target.value));
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      'PAID': { color: 'bg-green-900/50 text-green-300 border-green-500/30', text: 'Đã trả' },
      'PARTIAL': { color: 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30', text: 'Trả 1 phần' },
      'PENDING': { color: 'bg-red-900/50 text-red-300 border-red-500/30', text: 'Chưa trả' }
    };
    
    const statusInfo = statusMap[status] || statusMap['PENDING'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  // Create pagination numbers
  const getPaginationItems = () => {
    if (instructorRevenues.length === 0) {
      return <span className="text-gray-400 font-medium">Không có dữ liệu</span>;
    }
    
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
              currentPage === i 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg scale-105" 
                : "bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-600"
            }`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
      }
    } else {
      // Add first page
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
            currentPage === 1 
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg scale-105" 
              : "bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-600"
          }`}
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </button>
      );

      // Calculate page range
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        );
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
                currentPage === i 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg scale-105" 
                  : "bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-600"
              }`}
              aria-current={currentPage === i ? "page" : undefined}
            >
              {i}
            </button>
          );
        }
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        );
      }

      // Add last page
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 ${
              currentPage === totalPages 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg scale-105" 
                : "bg-gray-800/80 border border-gray-700/50 text-gray-300 hover:bg-gray-700/80 hover:text-white hover:border-gray-600"
            }`}
            aria-current={currentPage === totalPages ? "page" : undefined}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pages;
  };

  // ✅ Calculate stats from current data
  const calculateStats = () => {
    const totalRevenue = instructorRevenues.reduce((sum, revenue) => sum + (revenue.totalRevenue || 0), 0);
    const totalInstructorShare = instructorRevenues.reduce((sum, revenue) => sum + (revenue.instructorShare || 0), 0);
    const totalRatingBonus = instructorRevenues.reduce((sum, revenue) => sum + (revenue.ratingBonus || 0), 0);
    
    return {
      totalRevenue,
      totalInstructorShare,
      totalRatingBonus
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6 font-sans">
      {/* Search and filter bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full lg:w-auto">
          {/* Search input */}
          <div className="relative flex items-center w-full sm:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm giảng viên..."
              className="w-full bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
              value={searchTerm}
              onChange={handleSearchInput}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>

          {/* Filter info */}
          <div className="flex items-center space-x-2 text-sm">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">
              {getMonthName(selectedMonth)} {selectedYear}
            </span>
            {isMonthLocked && (
              <div className="flex items-center text-orange-400">
                <Lock className="h-4 w-4 mr-1" />
                <span className="text-xs">Đã khóa</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 font-medium flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Năm:
          </span>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="bg-gray-800/80 border border-gray-600/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all backdrop-blur-sm"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>
      
      {/* ✅ Enhanced stats summary - now shows data for selected month/year */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-blue-300 text-sm font-medium">Tổng giảng viên</p>
              <p className="text-blue-400 font-bold text-xl">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : itemCount}
              </p>
              <p className="text-blue-300 text-xs mt-1">
                {getMonthName(selectedMonth)} {selectedYear}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-emerald-400 mr-3" />
            <div>
              <p className="text-emerald-300 text-sm font-medium">Tổng doanh thu</p>
              <p className="text-emerald-400 font-bold text-xl">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-emerald-300 text-xs mt-1">
                Trang {currentPage}/{totalPages}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-purple-300 text-sm font-medium">Tổng phần chia GV</p>
              <p className="text-purple-400 font-bold text-xl">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : formatCurrency(stats.totalInstructorShare)}
              </p>
              <p className="text-purple-300 text-xs mt-1">
                {stats.totalRevenue > 0 ? formatPercent((stats.totalInstructorShare / stats.totalRevenue) * 100) : '0%'} tổng DT
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-yellow-300 text-sm font-medium">Tổng thưởng rating</p>
              <p className="text-yellow-400 font-bold text-xl">
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : formatCurrency(stats.totalRatingBonus)}
              </p>
              <p className="text-yellow-300 text-xs mt-1">
                Khuyến khích chất lượng
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ Data table with loading state */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-600/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gradient-to-r from-gray-900/80 to-gray-800/80 text-gray-200 tracking-wider backdrop-blur-sm">
              <tr>
                <th 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200" 
                  onClick={() => onSort("instructorId")}
                >
                  <div className="flex items-center space-x-2">
                    <span>ID</span>
                    {sortField === "instructorId" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200" 
                  onClick={() => onSort("instructorLastName")}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Họ tên</span>
                    {sortField === "instructorLastName" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200" 
                  onClick={() => onSort("totalRevenue")}
                >
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Tổng doanh thu</span>
                    {sortField === "totalRevenue" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200" 
                  onClick={() => onSort("instructorShare")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Phần chia GV</span>
                    {sortField === "instructorShare" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-200" 
                  onClick={() => onSort("ratingBonus")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Thưởng rating</span>
                    {sortField === "ratingBonus" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th className="py-4 px-6 text-center">Trạng thái TT</th>
                <th className="py-4 px-6 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {/* ✅ Loading state */}
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
                      <p className="text-gray-300 text-lg font-medium">Đang tải dữ liệu...</p>
                      <p className="text-gray-500 text-sm">
                        Đang lấy dữ liệu cho {getMonthName(selectedMonth)} {selectedYear}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : instructorRevenues.length > 0 ? (
                instructorRevenues.map((revenue, index) => (
                  <motion.tr 
                    key={revenue.id || `revenue-${index}`} 
                    className="bg-gray-800/30 hover:bg-gray-700/40 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-4 px-6 font-medium text-gray-200">
                      {revenue.instructorId || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium mr-3 shadow-lg">
                          {revenue.instructorFirstName?.[0] || 'N'}{revenue.instructorLastName?.[0] || 'A'}
                        </div>
                        <div>
                          <span className="text-white font-medium block">
                            {revenue.instructorFirstName} {revenue.instructorLastName}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {revenue.instructorEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-emerald-400 font-semibold">
                        {formatCurrency(revenue.totalRevenue || 0)}
                      </div>
                      <div className="text-xs text-gray-400">
                        GV: {formatCurrency(revenue.instructorReferredRevenue || 0)} | 
                        NT: {formatCurrency(revenue.platformReferredRevenue || 0)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-blue-300 font-medium">
                        {formatCurrency(revenue.instructorShare || 0)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {revenue.totalRevenue > 0 ? formatPercent(((revenue.instructorShare || 0) / revenue.totalRevenue) * 100) : '0%'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-yellow-400 font-medium">
                        {formatCurrency(revenue.ratingBonus || 0)}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getPaymentStatusBadge(revenue.paymentStatus)}
                      {revenue.remainingAmount > 0 && (
                        <div className="text-xs text-orange-400 mt-1">
                          Còn: {formatCurrency(revenue.remainingAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => onInstructorSelect(revenue.instructorId)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                        title="Xem chi tiết"
                      >
                        <ExternalLink size={16} className="mr-1.5" />
                        Chi tiết
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                        <Search size={32} className="text-gray-500" />
                      </div>
                      <p className="text-lg">Không tìm thấy dữ liệu doanh thu.</p>
                      <p className="text-sm text-gray-500">
                        {searchTerm 
                          ? `Không có kết quả cho "${searchTerm}"` 
                          : `Chưa có dữ liệu cho ${getMonthName(selectedMonth)} ${selectedYear}`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Enhanced Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl border border-gray-600/50 shadow-lg">
          <div className="flex space-x-3">
            <button
              className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <ChevronLeft size={18} className="mr-1" />
              Trước
            </button>

            <button
              className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              Tiếp
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>

          <div className="flex items-center space-x-2 justify-center">
            {getPaginationItems()}
          </div>

          <div className="text-gray-300 font-medium text-sm">
            {itemCount > 0 ? (
              <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {itemCount} phần tử
                </span>
                <span className="hidden sm:inline text-gray-500">|</span>
                <span>Trang {currentPage} / {totalPages}</span>
              </div>
            ) : (
              <span>Không có dữ liệu</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorRevenueList;