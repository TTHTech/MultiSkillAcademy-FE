import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, DollarSign, AlertCircle, CheckCircle, Clock, XCircle, Search, Filter, RefreshCw } from "lucide-react";
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
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [showBatchPayment, setShowBatchPayment] = useState(false);
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Separate state for search input
  
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
  }, [selectedMonth, selectedYear, statusFilter, currentPage, searchTerm]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

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
        size: itemsPerPage
      });

      // Add filters
      if (selectedMonth) queryParams.append('month', selectedMonth);
      if (selectedYear) queryParams.append('year', selectedYear);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (searchTerm) queryParams.append('searchTerm', searchTerm);

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
        setCurrentPage(data.number + 1);
      } else {
        setPayments([]);
        setTotalPages(1);
        setTotalElements(0);
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
        console.log("Payment summary data:", result.data);
        setPaymentSummary(result.data);
      }
    } catch (error) {
      console.error("Error fetching payment summary:", error);
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
        
        // Add detailed success message
        if (response.errors && response.errors.length > 0) {
          console.warn("Some payments had issues:", response.errors);
          showToast("warning", `Tạo thành công ${response.createdCount} thanh toán. Một số lỗi: ${response.errors.slice(0, 2).join(", ")}`);
        }
      } else {
        const errorMessage = response.errors && response.errors.length > 0 
          ? response.errors.join(', ') 
          : "Một số thanh toán không thể tạo";
        showToast("warning", errorMessage);
      }
      
      setShowBatchPayment(false);
      
      // Force refresh data to prevent duplicate creation
      setTimeout(() => {
        fetchPayments();
        fetchPaymentSummary();
      }, 500);
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

  // Handle search
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Reset to first page when changing filters
    
    switch (filterType) {
      case 'month':
        setSelectedMonth(parseInt(value));
        break;
      case 'year':
        setSelectedYear(parseInt(value));
        break;
      case 'status':
        setStatusFilter(value);
        break;
      default:
        break;
    }
  };

  // Refresh data
  const refreshData = () => {
    fetchPayments();
    fetchPaymentSummary();
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
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <DollarSign className="mr-3 h-7 w-7 text-green-400" />
            Quản lý thanh toán
          </h2>
          <p className="text-gray-400">Quản lý thanh toán cho giảng viên</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={refreshData}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </button>
          
          <button
            onClick={() => setShowBatchPayment(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg"
          >
            <Plus size={20} className="mr-2" />
            Tạo thanh toán
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {paymentSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-400 mr-3" />
              <div>
                <p className="text-blue-300 text-sm font-medium">Tổng giảng viên</p>
                <p className="text-blue-400 font-bold text-xl">
                  {paymentSummary.totalInstructors || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-emerald-400 mr-3" />
              <div>
                <p className="text-emerald-300 text-sm font-medium">Tổng thu nhập</p>
                <p className="text-emerald-400 font-bold text-xl">
                  {formatCurrency(paymentSummary.totalEarnings || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-yellow-300 text-sm font-medium">Đã thanh toán</p>
                <p className="text-yellow-400 font-bold text-xl">
                  {formatCurrency(paymentSummary.totalPaid || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-600/20 to-pink-600/20 border border-red-500/30 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-400 mr-3" />
              <div>
                <p className="text-red-300 text-sm font-medium">Còn lại</p>
                <p className="text-red-400 font-bold text-xl">
                  {formatCurrency(paymentSummary.totalRemaining || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên giảng viên, email, mã thanh toán..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full bg-gray-700/80 border border-gray-600/50 text-white placeholder-gray-400 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <select 
              value={selectedMonth}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="bg-gray-700/80 border border-gray-600/50 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
            
            <select 
              value={selectedYear}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="bg-gray-700/80 border border-gray-600/50 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
            >
              {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="bg-gray-700/80 border border-gray-600/50 text-white rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 transition-all backdrop-blur-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="FAILED">Thất bại</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
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
        loading={loading}
      />

      {/* Modals */}
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
          <div className="flex items-center justify-between">
            <p>{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPaymentContainerWithErrorBoundary;