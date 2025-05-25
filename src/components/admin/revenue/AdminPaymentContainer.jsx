import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, DollarSign, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import PaymentList from "./PaymentList";
import PaymentFormModal from "./PaymentFormModal";  
import PaymentDetailModal from "./PaymentDetailModal";
import BatchPaymentModal from "./BatchPaymentModal";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg my-4">
          <h2 className="text-lg font-bold">Đã xảy ra lỗi</h2>
          <p className="text-sm">{this.state.error?.message || 'Không thể hiển thị component này'}</p>
          <button 
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component wrapper with error boundary
const AdminPaymentContainerWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminPaymentContainer />
    </ErrorBoundary>
  );
};

// Safe fetch helper
const safeFetch = async (url, options = {}) => {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);
    
    let responseText = await response.text();
    let data;
    
    try {
      if (responseText && responseText.trim()) {
        data = JSON.parse(responseText);
      } else {
        data = null;
      }
    } catch (e) {
      console.error("Invalid JSON response:", responseText);
      throw new Error("Server returned invalid JSON. Please try again.");
    }
    
    return { 
      ok: response.ok, 
      status: response.status, 
      data,
      headers: response.headers
    };
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

// Main container component
const AdminPaymentContainer = () => {
  // States
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Modal states
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showBatchPayment, setShowBatchPayment] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 20;
  
  // Summary data
  const [paymentSummary, setPaymentSummary] = useState(null);

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Auth headers creator
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Initial data load
  useEffect(() => {
    fetchPayments();
    fetchPaymentSummary();
  }, [selectedMonth, selectedYear, statusFilter, currentPage]);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch payments list
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      const queryParams = new URLSearchParams({
        page: currentPage - 1,
        size: itemsPerPage,
        month: selectedMonth,
        year: selectedYear,
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm && { searchTerm })
      });

      const url = `${baseUrl}/api/admin/payments?${queryParams}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Failed to fetch payments: ${result.status}`);
      }

      const data = result.data;
      
      if (data && data.content) {
        setPayments(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment summary
  const fetchPaymentSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const url = `${baseUrl}/api/admin/payments/summary?month=${selectedMonth}&year=${selectedYear}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (result.ok && result.data) {
        setPaymentSummary(result.data);
      }
    } catch (error) {
      console.error("Error fetching payment summary:", error);
    }
  };

  // Create payment
  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      
      const url = `${baseUrl}/api/admin/payments`;
      const result = await safeFetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(paymentData)
      });
      
      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to create payment");
      }

      showToast("success", "Thanh toán đã được tạo thành công");
      setShowPaymentForm(false);
      fetchPayments();
      fetchPaymentSummary();
    } catch (error) {
      console.error("Error creating payment:", error);
      showToast("error", `Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (paymentId, transactionId, note) => {
    try {
      setLoading(true);
      
      const url = `${baseUrl}/api/admin/payments/${paymentId}/process`;
      const result = await safeFetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ transactionId, note })
      });
      
      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to process payment");
      }

      showToast("success", "Thanh toán đã được xử lý thành công");
      setShowPaymentDetail(false);
      fetchPayments();
      fetchPaymentSummary();
    } catch (error) {
      console.error("Error processing payment:", error);
      showToast("error", `Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId, status, note) => {
    try {
      setLoading(true);
      
      const url = `${baseUrl}/api/admin/payments/${paymentId}/status`;
      const result = await safeFetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note })
      });
      
      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to update payment status");
      }

      showToast("success", "Trạng thái thanh toán đã được cập nhật");
      fetchPayments();
      fetchPaymentSummary();
    } catch (error) {
      console.error("Error updating payment status:", error);
      showToast("error", `Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create batch payments
  const createBatchPayments = async (batchData) => {
    try {
      setLoading(true);
      
      const url = `${baseUrl}/api/admin/payments/batch`;
      const result = await safeFetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(batchData)
      });
      
      if (!result.ok) {
        throw new Error(result.data?.message || "Failed to create batch payments");
      }

      const response = result.data;
      if (response.success) {
        showToast("success", `Đã tạo ${response.createdCount} thanh toán thành công`);
      } else {
        showToast("warning", response.message || "Một số thanh toán không thể tạo");
      }
      
      setShowBatchPayment(false);
      fetchPayments();
      fetchPaymentSummary();
    } catch (error) {
      console.error("Error creating batch payments:", error);
      showToast("error", `Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment selection
  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'PENDING':
        return <Clock className="text-yellow-500" size={20} />;
      case 'PROCESSING':
        return <Clock className="text-blue-500" size={20} />;
      case 'FAILED':
        return <XCircle className="text-red-500" size={20} />;
      case 'CANCELLED':
        return <XCircle className="text-gray-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  // Loading state
  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <DollarSign className="mr-2" size={24} />
          Quản lý thanh toán
        </h2>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowBatchPayment(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Thanh toán hàng loạt
          </button>
          
          <button
            onClick={() => {
              setSelectedPayment(null);
              setFormMode("create");
              setShowPaymentForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Tạo thanh toán
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {paymentSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-white">
              {paymentSummary.totalPaymentCount || 0}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Tổng số tiền</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(paymentSummary.totalPaymentAmount || 0)}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Đang chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-400">
              {paymentSummary.paymentCountByStatus?.PENDING || 0}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Hoàn thành</p>
            <p className="text-2xl font-bold text-green-400">
              {paymentSummary.paymentCountByStatus?.COMPLETED || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          {Array.from({length: 12}, (_, i) => i + 1).map(month => (
            <option key={month} value={month}>
              {getMonthName(month)}
            </option>
          ))}
        </select>
        
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-md"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="FAILED">Thất bại</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
        
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded-md flex-1"
        />
      </div>

      {/* Payment List */}
      <PaymentList
        payments={payments}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onPaymentSelect={handlePaymentSelect}
        onStatusUpdate={updatePaymentStatus}
        formatCurrency={formatCurrency}
        getStatusIcon={getStatusIcon}
      />

      {/* Modals */}
      {showPaymentForm && (
        <PaymentFormModal
          isOpen={showPaymentForm}
          onClose={() => setShowPaymentForm(false)}
          payment={selectedPayment}
          formMode={formMode}
          onSubmit={createPayment}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

      {showPaymentDetail && selectedPayment && (
        <PaymentDetailModal
          isOpen={showPaymentDetail}
          onClose={() => setShowPaymentDetail(false)}
          payment={selectedPayment}
          onProcess={processPayment}
          onStatusUpdate={updatePaymentStatus}
          formatCurrency={formatCurrency}
          getStatusIcon={getStatusIcon}
        />
      )}

      {showBatchPayment && (
        <BatchPaymentModal
          isOpen={showBatchPayment}
          onClose={() => setShowBatchPayment(false)}
          onSubmit={createBatchPayments}
          month={selectedMonth}
          year={selectedYear}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 ${
          toast.type === "success" ? "bg-green-500" : 
          toast.type === "error" ? "bg-red-500" :
          "bg-yellow-500"
        } text-white p-4 rounded-lg shadow-lg z-50 max-w-md`}>
          <p>{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPaymentContainerWithErrorBoundary;