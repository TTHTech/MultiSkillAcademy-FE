import React from "react";
import { Eye, Edit, CheckCircle, XCircle, Clock, MoreVertical } from "lucide-react";

const PaymentList = ({
  payments,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onPaymentSelect,
  onStatusUpdate,
  formatCurrency,
  getStatusIcon
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
      'PENDING': 'text-yellow-400',
      'PROCESSING': 'text-blue-400',
      'COMPLETED': 'text-green-400',
      'FAILED': 'text-red-400',
      'CANCELLED': 'text-gray-400'
    };
    return colorMap[status] || 'text-gray-400';
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

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 mx-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="px-2">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="px-2">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 mx-1 rounded bg-gray-700 text-white hover:bg-gray-600"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Giảng viên</th>
              <th className="px-6 py-3">Tháng/Năm</th>
              <th className="px-6 py-3">Số tiền</th>
              <th className="px-6 py-3">Phương thức</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Ngày xử lý</th>
              <th className="px-6 py-3">Mã tham chiếu</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-600 transition-colors">
                  <td className="px-6 py-4 font-mono">{payment.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">
                        {payment.instructorFirstName} {payment.instructorLastName}
                      </p>
                      <p className="text-xs text-gray-400">{payment.instructorEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.month}/{payment.year}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-400">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-600">
                      {getPaymentMethodText(payment.paymentMethod)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <span className={`ml-2 ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {payment.processedAt ? formatDate(payment.processedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {payment.referenceNumber || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onPaymentSelect(payment)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {payment.status === 'PENDING' && (
                        <button
                          onClick={() => onStatusUpdate(payment.id, 'PROCESSING', 'Bắt đầu xử lý')}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Xử lý thanh toán"
                        >
                          <Clock size={18} />
                        </button>
                      )}
                      
                      {(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (
                        <button
                          onClick={() => onPaymentSelect(payment)}
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Hoàn thành thanh toán"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {payment.status === 'PENDING' && (
                        <button
                          onClick={() => onStatusUpdate(payment.id, 'CANCELLED', 'Hủy bởi admin')}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Hủy thanh toán"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-400">
                  Không có thanh toán nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Hiển thị {payments.length} trong tổng số {totalElements} thanh toán
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {renderPagination()}
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentList;