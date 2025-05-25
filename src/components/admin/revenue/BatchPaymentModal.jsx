import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Users, Calendar, CreditCard, FileText, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import ModalPortal from "./ModalPortal";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const BatchPaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  month,
  year
}) => {
  const [formData, setFormData] = useState({
    month: month,
    year: year,
    paymentMethod: 'BANK_TRANSFER',
    paymentNote: '',
    instructorIds: null // null means all instructors with remaining balance
  });

  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectAll, setSelectAll] = useState(true);

  // Payment methods
  const paymentMethods = [
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng' },
    { value: 'VNPAY', label: 'VNPay' },
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'OTHER', label: 'Khác' }
  ];

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Fetch instructors with remaining balance
  useEffect(() => {
    if (isOpen) {
      fetchInstructorsWithBalance();
    }
  }, [isOpen, formData.month, formData.year]);

  // Fetch instructors with remaining balance
  const fetchInstructorsWithBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues?month=${formData.month}&year=${formData.year}&paymentStatus=PENDING,PARTIAL&size=100`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to fetch instructors');

      const data = await response.json();
      const instructorsWithBalance = (data.content || []).filter(
        instructor => instructor.remainingAmount && instructor.remainingAmount > 0
      );
      
      setInstructors(instructorsWithBalance);
      
      // Calculate summary
      const totalInstructors = instructorsWithBalance.length;
      const totalAmount = instructorsWithBalance.reduce(
        (sum, instructor) => sum + (instructor.remainingAmount || 0), 0
      );
      
      setSummary({
        totalInstructors,
        totalAmount,
        selectedCount: selectAll ? totalInstructors : selectedInstructors.length,
        selectedAmount: selectAll ? totalAmount : instructorsWithBalance
          .filter(i => selectedInstructors.includes(i.instructorId))
          .reduce((sum, i) => sum + (i.remainingAmount || 0), 0)
      });
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setError('Lỗi khi tải danh sách giảng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle instructor selection
  const handleInstructorToggle = (instructorId) => {
    setSelectAll(false);
    setSelectedInstructors(prev => {
      if (prev.includes(instructorId)) {
        return prev.filter(id => id !== instructorId);
      } else {
        return [...prev, instructorId];
      }
    });
  };

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedInstructors([]);
    } else {
      setSelectedInstructors(instructors.map(i => i.instructorId));
    }
  };

  // Update summary when selection changes
  useEffect(() => {
    if (summary && instructors.length > 0) {
      const selectedCount = selectAll ? instructors.length : selectedInstructors.length;
      const selectedAmount = selectAll 
        ? instructors.reduce((sum, i) => sum + (i.remainingAmount || 0), 0)
        : instructors
            .filter(i => selectedInstructors.includes(i.instructorId))
            .reduce((sum, i) => sum + (i.remainingAmount || 0), 0);
      
      setSummary(prev => ({
        ...prev,
        selectedCount,
        selectedAmount
      }));
    }
  }, [selectedInstructors, selectAll]);

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectAll && selectedInstructors.length === 0) {
      alert('Vui lòng chọn ít nhất một giảng viên');
      return;
    }
    
    const batchData = {
      ...formData,
      instructorIds: selectAll ? null : selectedInstructors
    };
    
    onSubmit(batchData);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
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
          maxWidth: '800px',
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Users className="mr-2" />
            Thanh toán hàng loạt
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <DollarSign className="mr-2" size={18} />
              Tổng quan thanh toán
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Tổng giảng viên</p>
                <p className="text-white font-bold text-lg">{summary.totalInstructors}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tổng số tiền</p>
                <p className="text-green-400 font-bold text-lg">{formatCurrency(summary.totalAmount)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Đã chọn</p>
                <p className="text-blue-400 font-bold text-lg">{summary.selectedCount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Số tiền đã chọn</p>
                <p className="text-yellow-400 font-bold text-lg">{formatCurrency(summary.selectedAmount)}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Month/Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Tháng
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                className="bg-gray-700 text-white w-full p-3 rounded-lg"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Năm
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="bg-gray-700 text-white w-full p-3 rounded-lg"
              >
                {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-300 mb-2">
              <CreditCard className="inline mr-2" size={16} />
              Phương thức thanh toán
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="bg-gray-700 text-white w-full p-3 rounded-lg"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-300">
                <Users className="inline mr-2" size={16} />
                Chọn giảng viên
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllToggle}
                  className="mr-2 h-4 w-4"
                />
                Chọn tất cả
              </label>
            </div>
            
            <div className="bg-gray-700 rounded-lg max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Đang tải...</div>
              ) : instructors.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  Không có giảng viên nào có số dư cần thanh toán
                </div>
              ) : (
                <div className="divide-y divide-gray-600">
                  {instructors.map(instructor => (
                    <label
                      key={instructor.instructorId}
                      className="flex items-center p-3 hover:bg-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectAll || selectedInstructors.includes(instructor.instructorId)}
                        onChange={() => handleInstructorToggle(instructor.instructorId)}
                        className="mr-3 h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="text-white">
                          {instructor.instructorFirstName} {instructor.instructorLastName}
                        </p>
                        <p className="text-sm text-gray-400">{instructor.instructorEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-semibold">
                          {formatCurrency(instructor.remainingAmount || 0)}
                        </p>
                        <p className="text-xs text-gray-400">Còn lại</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Note */}
          <div>
            <label className="block text-gray-300 mb-2">
              <FileText className="inline mr-2" size={16} />
              Ghi chú chung
            </label>
            <textarea
              value={formData.paymentNote}
              onChange={(e) => setFormData({...formData, paymentNote: e.target.value})}
              placeholder="Nhập ghi chú cho tất cả thanh toán..."
              className="bg-gray-700 text-white w-full p-3 rounded-lg"
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || (summary && summary.selectedCount === 0)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <CheckCircle className="mr-2" size={20} />
              Tạo {summary ? summary.selectedCount : 0} thanh toán
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return (
    <ModalPortal isOpen={isOpen}>
      {modalContent}
    </ModalPortal>
  );
};

export default BatchPaymentModal;