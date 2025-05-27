// src/components/admin/revenue/AdminInstructorRevenueContainer.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, BarChart3, TrendingUp, AlertCircle, Loader2, CheckCircle2, Lock, Unlock } from "lucide-react";
import InstructorRevenueList from "./InstructorRevenueList";
import InstructorRevenueDetail from "./InstructorRevenueDetail";
import Toast from "./Toast";
import ErrorBoundary from "./ErrorBoundary";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Safe fetch helper function
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
const AdminInstructorRevenueContainer = () => {
  // States
  const [instructorRevenues, setInstructorRevenues] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [locking, setLocking] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const itemsPerPage = 10;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("totalRevenue");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Calculation result states
  const [calculationResult, setCalculationResult] = useState(null);
  const [showCalculationResult, setShowCalculationResult] = useState(false);
  const [isMonthLocked, setIsMonthLocked] = useState(false);

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth headers creator helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  };

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Initial data load
  useEffect(() => {
    fetchInstructorRevenues();
    fetchRevenueDetails();
    checkMonthLockStatus();
  }, []);

  // ✅ FIX: Fetch revenues when month or year changes
  useEffect(() => {
    if (!loading && !calculating) {
      fetchInstructorRevenues(1); // Reset to page 1 when month/year changes
      fetchRevenueDetails();
      checkMonthLockStatus();
    }
  }, [selectedMonth, selectedYear]);

  // ✅ FIX: Fetch revenues when pagination params change
  useEffect(() => {
    if (!loading && !calculating) {
      fetchInstructorRevenues(currentPage);
    }
  }, [currentPage, searchTerm, sortField, sortDirection]);

  // Check month lock status
  const checkMonthLockStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        return;
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues/lock-status?month=${selectedMonth}&year=${selectedYear}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (result.ok && result.data) {
        setIsMonthLocked(result.data.locked || false);
      } else {
        setIsMonthLocked(false);
      }
    } catch (error) {
      console.error("Error checking lock status:", error);
      setIsMonthLocked(false);
    }
  };

  // Fetch revenue details without calculating
  const fetchRevenueDetails = async () => {
    try {
      setFetching(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues/revenue-details?month=${selectedMonth}&year=${selectedYear}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        console.error("API Error Response:", result.data);
        
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch revenue details: ${result.status}`);
      }

      console.log("Revenue details:", result.data);
      
      if (result.data && result.data.success) {
        setCalculationResult(result.data);
        setShowCalculationResult(true);
      } else {
        setShowCalculationResult(false);
        if (result.data && result.data.message && !result.data.message.includes("Không có dữ liệu")) {
          showToast("error", result.data.message || "Không thể tải thông tin doanh thu");
        }
      }
    } catch (error) {
      console.error("Error fetching revenue details:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải thông tin doanh thu: ${error.message}`);
    } finally {
      setFetching(false);
    }
  };

  // ✅ FIX: Fetch instructor revenues list with proper filtering by month/year
  const fetchInstructorRevenues = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }

      const apiPage = Math.max(0, page - 1);
      const queryParams = new URLSearchParams({
        page: apiPage,
        size: itemsPerPage,
        month: selectedMonth,
        year: selectedYear,
        sortBy: sortField,
        sortDirection: sortDirection
      });

      if (searchTerm) {
        queryParams.append('searchTerm', searchTerm);
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues?${queryParams}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        console.error("API Error Response:", result.data);
        
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch instructor revenues: ${result.status}`);
      }

      console.log("Instructor revenues data:", result.data);
      const data = result.data;
      
      if (data && data.content && Array.isArray(data.content)) {
        setInstructorRevenues(data.content);
        setItemCount(data.totalElements || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.number + 1);
      } else if (Array.isArray(data)) {
        setInstructorRevenues(data);
        setItemCount(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        setInstructorRevenues([]);
        setItemCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching instructor revenues:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate revenues for instructors
  const calculateRevenues = async () => {
    try {
      setCalculating(true);
      setError(null);
      setShowCalculationResult(false);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues/calculate?month=${selectedMonth}&year=${selectedYear}`;
      const result = await safeFetch(url, {
        method: "POST",
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        console.error("API Error Response:", result.data);
        
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        if (result.status === 400 && result.data && result.data.message) {
          throw new Error(result.data.message);
        }
        
        throw new Error(`Failed to calculate revenues: ${result.status}`);
      }

      console.log("Calculation result:", result.data);
      
      setCalculationResult(result.data);
      setShowCalculationResult(true);
      showToast("success", (result.data && result.data.message) || "Doanh thu đã được tính toán thành công");
      
      // Refresh the list
      fetchInstructorRevenues(1);
    } catch (error) {
      console.error("Error calculating revenues:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tính toán doanh thu: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  };

  // Lock/Unlock monthly revenue
  const toggleLockRevenue = async () => {
    try {
      setLocking(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const endpoint = isMonthLocked ? 'unlock' : 'lock';
      const reasonParam = isMonthLocked ? '&reason=Admin%20unlock' : '';
      const url = `${baseUrl}/api/admin/instructor-revenues/${endpoint}?month=${selectedMonth}&year=${selectedYear}${reasonParam}`;
      
      const result = await safeFetch(url, {
        method: "POST",
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        throw new Error(`Failed to ${endpoint} revenue: ${result.status}`);
      }

      setIsMonthLocked(!isMonthLocked);
      showToast("success", `Đã ${isMonthLocked ? 'mở khóa' : 'khóa'} doanh thu tháng ${selectedMonth}/${selectedYear}`);
      
      fetchInstructorRevenues(currentPage);
      checkMonthLockStatus();
      
    } catch (error) {
      console.error("Error toggling lock:", error);
      showToast("error", `Lỗi khi ${isMonthLocked ? 'mở khóa' : 'khóa'}: ${error.message}`);
    } finally {
      setLocking(false);
    }
  };

  // Fetch instructor details
  const fetchInstructorDetails = async (instructorId) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues/${instructorId}?month=${selectedMonth}&year=${selectedYear}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        console.error("API Error Response:", result.data);
        
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch instructor details: ${result.status}`);
      }

      setInstructorDetails(result.data);
      fetchInstructorMonthlyRevenue(instructorId);
    } catch (error) {
      console.error("Error fetching instructor details:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch monthly revenue for an instructor
  const fetchInstructorMonthlyRevenue = async (instructorId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const url = `${baseUrl}/api/admin/instructor-revenues/${instructorId}/monthly?year=${selectedYear}`;
      const result = await safeFetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!result.ok) {
        console.error("API Error Response:", result.data);
        
        if (result.status === 401 || result.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch monthly revenue: ${result.status}`);
      }

      console.log("Monthly revenue data:", result.data);
      
      const formattedData = result.data.map(item => ({
        ...item,
        name: getMonthName(item.month),
        totalRevenueMillions: item.totalRevenue / 1000000
      }));
      
      setMonthlyRevenue(formattedData);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      showToast("error", `Lỗi khi tải dữ liệu monthly: ${error.message}`);
    }
  };

  // Handle instructor selection
  const handleInstructorSelect = (instructorId) => {
    setSelectedInstructorId(instructorId);
    fetchInstructorDetails(instructorId);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedInstructorId(null);
    setInstructorDetails(null);
  };

  // Utility functions
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
    setCurrentPage(1);
    
    if (selectedInstructorId) {
      fetchInstructorMonthlyRevenue(selectedInstructorId);
    }
  };
  
  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(parseInt(month));
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Loading state
  if (loading && instructorRevenues.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
            <Loader2 className="animate-spin h-8 w-8 text-white" />
          </div>
          <div className="text-gray-300 text-lg font-medium">Đang tải dữ liệu...</div>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error && instructorRevenues.length === 0) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/30 text-red-400 p-6 rounded-xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <p className="font-semibold">Lỗi: {error}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
            onClick={() => {
              setError(null);
              fetchInstructorRevenues();
            }}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Thử lại
          </button>
        </div>
      </motion.div>
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <BarChart3 className="mr-3 h-7 w-7 text-blue-400" />
            Doanh thu giảng viên
          </h2>
          <p className="text-gray-400">Quản lý và theo dõi doanh thu của các giảng viên</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Month selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select 
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Year selector */}
          <select 
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {/* View Report button */}
          <button
            onClick={fetchRevenueDetails}
            disabled={fetching}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {fetching ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Đang tải...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Xem báo cáo
              </>
            )}
          </button>
          
          {/* Calculate button */}
          <button
            onClick={calculateRevenues}
            disabled={calculating || isMonthLocked}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {calculating ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Đang tính toán...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Tính toán doanh thu
              </>
            )}
          </button>

          {/* Lock/Unlock button */}
          <button
            onClick={toggleLockRevenue}
            disabled={locking}
            className={`${
              isMonthLocked 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
            } text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200 shadow-lg disabled:opacity-50`}
          >
            {locking ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {isMonthLocked ? 'Đang mở khóa...' : 'Đang khóa...'}
              </>
            ) : (
              <>
                {isMonthLocked ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                {isMonthLocked ? 'Mở khóa' : 'Khóa'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Calculation Result Panel - Only show summary, remove detailed table */}
      <AnimatePresence>
        {showCalculationResult && calculationResult && (
          <motion.div 
            className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-sm p-6 rounded-xl mb-8 border border-gray-600/50 shadow-lg"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-blue-400" />
                Kết quả doanh thu {getMonthName(calculationResult.month)}/{calculationResult.year}
              </h3>
              <button 
                onClick={() => setShowCalculationResult(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/50"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-emerald-300 text-sm font-medium mb-1">Tổng doanh thu</p>
                <p className="text-emerald-400 font-bold text-xl">
                  {calculationResult.totalRevenue ? formatCurrency(calculationResult.totalRevenue) : "0 ₫"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-blue-300 text-sm font-medium mb-1">Phần chia giảng viên</p>
                <p className="text-blue-400 font-bold text-xl">
                  {calculationResult.totalInstructorShare ? formatCurrency(calculationResult.totalInstructorShare) : "0 ₫"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-purple-300 text-sm font-medium mb-1">Phần chia nền tảng</p>
                <p className="text-purple-400 font-bold text-xl">
                  {calculationResult.totalPlatformShare ? formatCurrency(calculationResult.totalPlatformShare) : "0 ₫"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-yellow-300 text-sm font-medium mb-1">Tổng thưởng đánh giá</p>
                <p className="text-yellow-400 font-bold text-xl">
                  {calculationResult.totalRatingBonus ? formatCurrency(calculationResult.totalRatingBonus) : "0 ₫"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="space-y-6">
        {selectedInstructorId && instructorDetails ? (
          <InstructorRevenueDetail 
            instructorDetails={instructorDetails}
            monthlyRevenue={monthlyRevenue}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onBackClick={handleBackToList}
          />
        ) : (
          <InstructorRevenueList 
            instructorRevenues={instructorRevenues}
            currentPage={currentPage}
            totalPages={totalPages}
            itemCount={itemCount}
            searchTerm={searchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onSearch={handleSearch}
            onSort={handleSort}
            onYearChange={handleYearChange}
            onPageChange={handlePageChange}
            onInstructorSelect={handleInstructorSelect}
            isMonthLocked={isMonthLocked}
            loading={loading}
          />
        )}
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  );
};

// Main component wrapper with error boundary
const AdminInstructorRevenueWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminInstructorRevenueContainer />
    </ErrorBoundary>
  );
};

export default AdminInstructorRevenueWithErrorBoundary;