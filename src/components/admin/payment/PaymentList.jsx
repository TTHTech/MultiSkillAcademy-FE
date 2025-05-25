import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Search,
  DollarSign
} from "lucide-react";

const PaymentList = ({
  payments,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onPaymentSelect,
  onStatusUpdate,
  formatCurrency,
  getStatusIcon,
  loading = false
}) => {
  // Get status text
  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'COMPLETED': 'Hoàn thành',
      'FAILED': 'Thất bại',
      'CANCELLED': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
      'PROCESSING': 'text-blue-400 bg-blue-900/20 border-blue-500/30',
      'COMPLETED': 'text-green-400 bg-green-900/20 border-green-500/30',
      'FAILED': 'text-red-400 bg-red-900/20 border-red-500/30',
      'CANCELLED': 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    };
    return colorMap[status] || 'text-gray-400 bg-gray-900/20 border-gray-500/30';
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    const methodMap = {
      'BANK_TRANSFER': 'Chuyển khoản',
      'VNPAY': 'VNPay',
      'CASH': 'Tiền mặt',
      'OTHER': 'Khác'
    };
    return methodMap[method] || method;
  };

  // Format date
  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray)) return '-';
    try {
      const [year, month, day, hour = 0, minute = 0] = dateArray;
      const date = new Date(year, month - 1, day, hour, minute);
      return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '-';
    }
  };

  // Create pagination numbers
  const getPaginationItems = () => {
    if (totalPages <= 1) return [];
    
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
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pages;
  };

  return (
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
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Giảng viên</th>
              <th className="px-6 py-4">Tháng/Năm</th>
              <th className="px-6 py-4">Số tiền</th>
              <th className="px-6 py-4">Phương thức</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Ngày xử lý</th>
              <th className="px-6 py-4">Mã tham chiếu</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {loading ? (
              <tr>
                <td colSpan="9" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
                    <p className="text-gray-300 text-lg font-medium">Đang tải thanh toán...</p>
                  </div>
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((payment, index) => (
                <motion.tr 
                  key={payment.id} 
                  className="bg-gray-800/30 hover:bg-gray-700/40 transition-all duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 font-mono text-gray-200 font-medium">
                    #{payment.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium mr-3 shadow-lg">
                        {payment.instructorFirstName?.[0] || 'N'}{payment.instructorLastName?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {payment.instructorFirstName} {payment.instructorLastName}
                        </p>
                        <p className="text-xs text-gray-400">{payment.instructorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">
                      {payment.month}/{payment.year}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-emerald-400 font-semibold text-lg">
                      {formatCurrency(payment.amount)}
                    </div>
                    {payment.totalAmount && (
                      <div className="text-xs text-gray-400">
                        Tổng: {formatCurrency(payment.totalAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-300">
                    {payment.processedAt ? formatDate(payment.processedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-300">
                    {payment.referenceNumber || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onPaymentSelect(payment)}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/20 transition-all duration-200"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {payment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(payment.id, 'PROCESSING', 'Bắt đầu xử lý')}
                            className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-yellow-500/20 transition-all duration-200"
                            title="Xử lý thanh toán"
                          >
                            <Clock size={18} />
                          </button>
                          <button
                            onClick={() => onStatusUpdate(payment.id, 'CANCELLED', 'Hủy bởi admin')}
                            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200"
                            title="Hủy thanh toán"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      
                      {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (
                        <button
                          onClick={() => onPaymentSelect(payment)}
                          className="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-green-500/20 transition-all duration-200"
                          title="Hoàn thành thanh toán"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-16 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-gray-700/50 flex items-center justify-center">
                      <Search size={32} className="text-gray-500" />
                    </div>
                    <p className="text-lg">Không tìm thấy thanh toán nào</p>
                    <p className="text-sm text-gray-500">
                      Thử điều chỉnh bộ lọc hoặc thay đổi từ khóa tìm kiếm
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 border-t border-gray-600/50">
          <div className="flex space-x-3">
            <button
              className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} className="mr-1" />
              Trước
            </button>

            <button
              className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Tiếp
              <ChevronRight size={18} className="ml-1" />
            </button>
          </div>

          <div className="flex items-center space-x-2 justify-center">
            {getPaginationItems()}
          </div>

          <div className="text-gray-300 font-medium text-sm">
            {totalElements > 0 ? (
              <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
                <span className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {totalElements} thanh toán
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
    </motion.div>
  );
};

export default PaymentList;