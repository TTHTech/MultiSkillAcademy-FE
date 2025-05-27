import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Calendar, DollarSign, CreditCard, FileText, Clock, CheckCircle, AlertCircle, Hash } from "lucide-react";
import ModalPortal from "./ModalPortal";

const PaymentDetailModal = ({
  isOpen,
  onClose,
  payment,
  onProcess,
  onStatusUpdate,
  formatCurrency,
  getStatusIcon
}) => {
  const [processData, setProcessData] = useState({
    transactionId: '',
    note: ''
  });
  const [showProcessForm, setShowProcessForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!payment) return null;

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
      'PENDING': 'bg-yellow-500',
      'PROCESSING': 'bg-blue-500',
      'COMPLETED': 'bg-green-500',
      'FAILED': 'bg-red-500',
      'CANCELLED': 'bg-gray-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  // Get payment method text
  const getPaymentMethodText = (method) => {
    const methodMap = {
      'BANK_TRANSFER': 'Chuyển khoản ngân hàng',
      'VNPAY': 'VNPay',
      'CASH': 'Tiền mặt',
      'OTHER': 'Khác'
    };
    return methodMap[method] || method;
  };

  // ✅ FIXED: Format date - supports both array and string formats
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      // Handle both string and array formats
      let date;
      if (Array.isArray(dateString)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
        date = new Date(year, month - 1, day, hour, minute, second);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleDateString('vi-VN') + ' ' + 
             date.toLocaleTimeString('vi-VN', { 
               hour: '2-digit', 
               minute: '2-digit',
               second: '2-digit'
             });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  };

  // Handle process payment
  const handleProcessPayment = async () => {
    if (!processData.transactionId) {
      alert('Vui lòng nhập mã giao dịch');
      return;
    }

    setProcessing(true);
    try {
      await onProcess(payment.id, processData.transactionId, processData.note);
      setShowProcessForm(false);
      onClose();
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus, note) => {
    if (window.confirm(`Bạn có chắc muốn chuyển trạng thái thanh toán sang "${getStatusText(newStatus)}"?`)) {
      await onStatusUpdate(payment.id, newStatus, note);
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: '#1f2937',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #374151',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 1rem'
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <DollarSign className="mr-2" />
            Chi tiết thanh toán #{payment.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-center mb-6">
          <div className={`px-6 py-3 rounded-full ${getStatusColor(payment.status)} bg-opacity-20 border-2 border-current flex items-center`}>
            {getStatusIcon(payment.status)}
            <span className="ml-2 font-semibold">{getStatusText(payment.status)}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-6">
          {/* Instructor Info */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <User className="mr-2" size={18} />
              Thông tin giảng viên
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Họ tên</p>
                <p className="text-white font-medium">
                  {payment.instructorFirstName} {payment.instructorLastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{payment.instructorEmail}</p>
              </div>
            </div>
          </div>

          {/* Payment Period */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Calendar className="mr-2" size={18} />
              Kỳ thanh toán
            </h4>
            <p className="text-white text-lg">Tháng {payment.month}/{payment.year}</p>
          </div>

          {/* Amount Details */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <DollarSign className="mr-2" size={18} />
              Chi tiết số tiền
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tổng số tiền cần thanh toán:</span>
                <span className="text-white font-medium">{formatCurrency(payment.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Đã thanh toán trước đó:</span>
                <span className="text-green-400">{formatCurrency(payment.previouslyPaidAmount || 0)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-gray-400">Số tiền thanh toán lần này:</span>
                <span className="text-white font-bold text-lg">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Còn lại sau thanh toán:</span>
                <span className="text-yellow-400">{formatCurrency(payment.remainingAmountAfterPayment || 0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <CreditCard className="mr-2" size={18} />
              Phương thức thanh toán
            </h4>
            <div className="space-y-2">
              <p className="text-white">{getPaymentMethodText(payment.paymentMethod)}</p>
              {payment.bankName && (
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Ngân hàng</p>
                  <p className="text-white">{payment.bankName}</p>
                </div>
              )}
              {payment.bankAccountNumber && (
                <div className="mt-2">
                  <p className="text-gray-400 text-sm">Số tài khoản</p>
                  <p className="text-white font-mono">{payment.bankAccountNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reference Info */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Hash className="mr-2" size={18} />
              Thông tin tham chiếu
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Mã tham chiếu</p>
                <p className="text-white font-mono">{payment.referenceNumber || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Mã giao dịch</p>
                <p className="text-white font-mono">{payment.transactionId || '-'}</p>
              </div>
            </div>
          </div>

          {/* Processing Info */}
          {payment.processedAt && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Clock className="mr-2" size={18} />
                Thông tin xử lý
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Người xử lý</p>
                  <p className="text-white">{payment.processedByName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Thời gian xử lý</p>
                  <p className="text-white">{formatDate(payment.processedAt)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {payment.paymentNote && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <FileText className="mr-2" size={18} />
                Ghi chú
              </h4>
              <p className="text-white whitespace-pre-wrap">{payment.paymentNote}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <Clock className="mr-2" size={18} />
              Thời gian
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Ngày tạo</p>
                <p className="text-white">{formatDate(payment.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cập nhật lần cuối</p>
                <p className="text-white">{formatDate(payment.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Process Payment Form */}
        {showProcessForm && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Xử lý thanh toán</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Mã giao dịch *</label>
                <input
                  type="text"
                  value={processData.transactionId}
                  onChange={(e) => setProcessData({...processData, transactionId: e.target.value})}
                  placeholder="Nhập mã giao dịch ngân hàng..."
                  className="bg-gray-700 text-white w-full p-3 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Ghi chú</label>
                <textarea
                  value={processData.note}
                  onChange={(e) => setProcessData({...processData, note: e.target.value})}
                  placeholder="Nhập ghi chú..."
                  className="bg-gray-700 text-white w-full p-3 rounded-lg"
                  rows="2"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleProcessPayment}
                  disabled={processing}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {processing ? 'Đang xử lý...' : 'Xác nhận hoàn thành'}
                </button>
                <button
                  onClick={() => setShowProcessForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          {payment.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleStatusUpdate('PROCESSING', 'Bắt đầu xử lý thanh toán')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Bắt đầu xử lý
              </button>
              <button
                onClick={() => setShowProcessForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Hoàn thành thanh toán
              </button>
              <button
                onClick={() => handleStatusUpdate('CANCELLED', 'Hủy bởi admin')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Hủy thanh toán
              </button>
            </>
          )}
          
          {payment.status === 'PROCESSING' && (
            <>
              <button
                onClick={() => setShowProcessForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Hoàn thành thanh toán
              </button>
              <button
                onClick={() => handleStatusUpdate('FAILED', 'Thanh toán thất bại')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Đánh dấu thất bại
              </button>
            </>
          )}
          
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <ModalPortal isOpen={isOpen}>
      {modalContent}
    </ModalPortal>
  );
};

export default PaymentDetailModal;