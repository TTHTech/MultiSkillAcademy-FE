import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Search, DollarSign, User, Calendar, CreditCard, FileText } from "lucide-react";
import ModalPortal from "./ModalPortal";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PaymentFormModal = ({
  isOpen,
  onClose,
  payment,
  formMode,
  onSubmit,
  month,
  year
}) => {
  const [formData, setFormData] = useState({
    instructorId: '',
    month: month,
    year: year,
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    bankAccountNumber: '',
    bankName: '',
    paymentNote: ''
  });

  const [instructorSearch, setInstructorSearch] = useState('');
  const [instructorRevenue, setInstructorRevenue] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validation, setValidation] = useState({});

  // Payment methods
  const paymentMethods = [
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng' },
    { value: 'VNPAY', label: 'VNPay' },
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'OTHER', label: 'Khác' }
  ];

  // Banks list
  const banks = [
    'Vietcombank',
    'Techcombank',
    'BIDV',
    'VietinBank',
    'ACB',
    'Sacombank',
    'MB Bank',
    'VPBank',
    'TPBank',
    'SHB',
    'SeABank',
    'HDBank',
    'OCB',
    'NCB',
    'Khác'
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Update form data when payment changes
  useEffect(() => {
    if (payment && formMode === 'edit') {
      setFormData({
        ...payment,
        month: payment.month || month,
        year: payment.year || year
      });
    }
  }, [payment, formMode, month, year]);

  // Search instructors
  const searchInstructors = async () => {
    if (!instructorSearch.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructors?search=${encodeURIComponent(instructorSearch)}&size=10`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to search instructors');

      const data = await response.json();
      setSearchResults(data.content || []);
    } catch (error) {
      console.error('Error searching instructors:', error);
      setError('Lỗi khi tìm kiếm giảng viên');
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (instructorSearch) {
        searchInstructors();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [instructorSearch]);

  // Fetch instructor revenue
  const fetchInstructorRevenue = async (instructorId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/${instructorId}?month=${formData.month}&year=${formData.year}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) throw new Error('Failed to fetch instructor revenue');

      const data = await response.json();
      setInstructorRevenue(data);
      
      // Auto-fill remaining amount
      if (data.remainingAmount) {
        setFormData(prev => ({
          ...prev,
          amount: data.remainingAmount
        }));
      }
    } catch (error) {
      console.error('Error fetching instructor revenue:', error);
      setError('Lỗi khi tải thông tin doanh thu');
    } finally {
      setLoading(false);
    }
  };

  // Handle instructor selection
  const handleInstructorSelect = (instructor) => {
    setFormData(prev => ({
      ...prev,
      instructorId: instructor.id
    }));
    setInstructorSearch(`${instructor.firstName} ${instructor.lastName}`);
    setSearchResults([]);
    fetchInstructorRevenue(instructor.id);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validation[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.instructorId) {
      errors.instructorId = 'Vui lòng chọn giảng viên';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Số tiền phải lớn hơn 0';
    }
    
    if (instructorRevenue && parseFloat(formData.amount) > instructorRevenue.remainingAmount) {
      errors.amount = `Số tiền không được vượt quá ${formatCurrency(instructorRevenue.remainingAmount)}`;
    }
    
    if (formData.paymentMethod === 'BANK_TRANSFER') {
      if (!formData.bankAccountNumber) {
        errors.bankAccountNumber = 'Vui lòng nhập số tài khoản';
      }
      if (!formData.bankName) {
        errors.bankName = 'Vui lòng chọn ngân hàng';
      }
    }
    
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    onSubmit(paymentData);
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
          maxWidth: '600px',
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
            <DollarSign className="mr-2" />
            {formMode === "create" ? "Tạo thanh toán mới" : "Chỉnh sửa thanh toán"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instructor Search */}
          <div>
            <label className="block text-gray-300 mb-2">
              <User className="inline mr-2" size={16} />
              Giảng viên
            </label>
            <div className="relative">
              <input
                type="text"
                value={instructorSearch}
                onChange={(e) => setInstructorSearch(e.target.value)}
                placeholder="Tìm kiếm giảng viên..."
                className={`bg-gray-700 text-white w-full p-3 rounded-lg pr-10 ${
                  validation.instructorId ? 'border-2 border-red-500' : ''
                }`}
                disabled={formMode === 'edit'}
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            {validation.instructorId && (
              <p className="text-red-400 text-sm mt-1">{validation.instructorId}</p>
            )}
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto">
                {searchResults.map((instructor) => (
                  <div
                    key={instructor.id}
                    onClick={() => handleInstructorSelect(instructor)}
                    className="p-3 hover:bg-gray-700 cursor-pointer"
                  >
                    <p className="text-white">{instructor.firstName} {instructor.lastName}</p>
                    <p className="text-sm text-gray-400">{instructor.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revenue Info */}
          {instructorRevenue && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <h4 className="text-white font-semibold mb-2">Thông tin doanh thu</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Tổng thu nhập:</span>
                  <p className="text-white font-semibold">
                    {formatCurrency(instructorRevenue.totalEarnings || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Đã thanh toán:</span>
                  <p className="text-green-400 font-semibold">
                    {formatCurrency(instructorRevenue.paidAmount || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Còn lại:</span>
                  <p className="text-yellow-400 font-semibold">
                    {formatCurrency(instructorRevenue.remainingAmount || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Trạng thái:</span>
                  <p className="text-white">
                    {instructorRevenue.paymentStatus || 'PENDING'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Month/Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Tháng
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="bg-gray-700 text-white w-full p-3 rounded-lg"
                disabled={formMode === 'edit'}
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
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="bg-gray-700 text-white w-full p-3 rounded-lg"
                disabled={formMode === 'edit'}
              >
                {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-300 mb-2">
              <DollarSign className="inline mr-2" size={16} />
              Số tiền thanh toán
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Nhập số tiền..."
              className={`bg-gray-700 text-white w-full p-3 rounded-lg ${
                validation.amount ? 'border-2 border-red-500' : ''
              }`}
              step="1000"
              min="0"
            />
            {validation.amount && (
              <p className="text-red-400 text-sm mt-1">{validation.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-300 mb-2">
              <CreditCard className="inline mr-2" size={16} />
              Phương thức thanh toán
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="bg-gray-700 text-white w-full p-3 rounded-lg"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Bank Details */}
          {formData.paymentMethod === 'BANK_TRANSFER' && (
            <>
              <div>
                <label className="block text-gray-300 mb-2">
                  Ngân hàng
                </label>
                <select
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className={`bg-gray-700 text-white w-full p-3 rounded-lg ${
                    validation.bankName ? 'border-2 border-red-500' : ''
                  }`}
                >
                  <option value="">Chọn ngân hàng...</option>
                  {banks.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
                {validation.bankName && (
                  <p className="text-red-400 text-sm mt-1">{validation.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  placeholder="Nhập số tài khoản..."
                  className={`bg-gray-700 text-white w-full p-3 rounded-lg ${
                    validation.bankAccountNumber ? 'border-2 border-red-500' : ''
                  }`}
                />
                {validation.bankAccountNumber && (
                  <p className="text-red-400 text-sm mt-1">{validation.bankAccountNumber}</p>
                )}
              </div>
            </>
          )}

          {/* Payment Note */}
          <div>
            <label className="block text-gray-300 mb-2">
              <FileText className="inline mr-2" size={16} />
              Ghi chú
            </label>
            <textarea
              name="paymentNote"
              value={formData.paymentNote}
              onChange={handleInputChange}
              placeholder="Nhập ghi chú..."
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
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : formMode === 'create' ? 'Tạo thanh toán' : 'Cập nhật'}
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

export default PaymentFormModal;