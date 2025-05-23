import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import InstructorRevenueList from "./InstructorRevenueList";
import InstructorRevenueDetail from "./InstructorRevenueDetail";
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
const AdminInstructorRevenueWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminInstructorRevenueContainer />
    </ErrorBoundary>
  );
};

// Safe fetch helper function
const safeFetch = async (url, options = {}) => {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, options);
    
    // Log response status for debugging
    console.log(`Response status: ${response.status}`);
    
    // Get the full response text
    let responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      // Only try to parse if there's actual content
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
  // States for instructor revenues data
  const [instructorRevenues, setInstructorRevenues] = useState([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [fetching, setFetching] = useState(false);

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const itemsPerPage = 100;

  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // State for calculation results
  const [calculationResult, setCalculationResult] = useState(null);
  const [showCalculationResult, setShowCalculationResult] = useState(false);

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
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

  // Initial data load
  useEffect(() => {
    fetchInstructorRevenues();
    fetchRevenueDetails(); // Fetch initial revenue details
  }, []);

  // Fetch revenue details when month or year changes
  useEffect(() => {
    if (!loading && !calculating) {
      fetchRevenueDetails();
    }
  }, [selectedMonth, selectedYear]);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // NEW: Fetch revenue details without calculating
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
        showToast("error", (result.data && result.data.message) || "Không thể tải thông tin doanh thu");
      }
    } catch (error) {
      console.error("Error fetching revenue details:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải thông tin doanh thu: ${error.message}`);
    } finally {
      setFetching(false);
    }
  };

  // Fetch instructor revenues list
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
      
      const url = `${baseUrl}/api/admin/instructor-revenues?page=${apiPage}&size=${itemsPerPage}`;
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
      
      // Format data for display
      if (Array.isArray(data)) {
        setInstructorRevenues(data);
        setItemCount(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else if (data && data.content && Array.isArray(data.content)) {
        // Spring Data Page format
        setInstructorRevenues(data.content);
        setItemCount(data.totalElements || data.content.length);
        setTotalPages(data.totalPages || Math.ceil(data.content.length / itemsPerPage));
      } else {
        setInstructorRevenues([]);
        setItemCount(0);
        setTotalPages(1);
      }
      
      setCurrentPage(page);
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
        
        throw new Error(`Failed to calculate revenues: ${result.status}`);
      }

      console.log("Calculation result:", result.data);
      
      setCalculationResult(result.data);
      setShowCalculationResult(true);
      showToast("success", (result.data && result.data.message) || "Doanh thu đã được tính toán thành công");
      
      // Tải lại dữ liệu
      fetchInstructorRevenues(1);
    } catch (error) {
      console.error("Error calculating revenues:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tính toán doanh thu: ${error.message}`);
    } finally {
      setCalculating(false);
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
      
      const url = `${baseUrl}/api/admin/instructor-revenues/${instructorId}`;
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
      
      // Fetch monthly revenue data for instructor
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
      setLoading(true);
      setError(null);
      
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
      
      // Format data for chart display
      const formattedData = result.data.map(item => ({
        ...item,
        name: getMonthName(item.month),
        totalRevenueMillions: item.totalRevenue / 1000000
      }));
      
      setMonthlyRevenue(formattedData);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
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

  // Utility functions for formatting
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };
  
  // Format currency
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
    
    if (term === "") {
      // If search term is cleared, reset to page 1 and fetch from API
      setCurrentPage(1);
      fetchInstructorRevenues(1);
    } else {
      // Filter the current data
      const filtered = instructorRevenues.filter(instructor => 
        (instructor.instructorFirstName && instructor.instructorFirstName.toLowerCase().includes(term.toLowerCase())) || 
        (instructor.instructorLastName && instructor.instructorLastName.toLowerCase().includes(term.toLowerCase()))
      );
      
      // Update pagination for filtered results
      setItemCount(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
      setCurrentPage(1);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Sort the current data
    const sorted = [...instructorRevenues].sort((a, b) => {
      if (a[field] === undefined) return newDirection === "asc" ? -1 : 1;
      if (b[field] === undefined) return newDirection === "asc" ? 1 : -1;
      
      return newDirection === "asc"
        ? a[field] > b[field] ? 1 : -1
        : a[field] < b[field] ? 1 : -1;
    });
    
    setInstructorRevenues(sorted);
  };

  // Handle year change
  const handleYearChange = (year) => {
    setSelectedYear(parseInt(year));
    
    // Refresh data based on new year
    if (selectedInstructorId) {
      fetchInstructorMonthlyRevenue(selectedInstructorId);
    }
  };
  
  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(parseInt(month));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchInstructorRevenues(page);
  };

  // Handle view report
  const viewCurrentMonthReport = () => {
    fetchRevenueDetails();
  };

  // Test API connection explicitly
  const testConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      // Simple GET endpoint to test connection
      const testUrl = `${baseUrl}/api/admin/instructor-revenues/revenue-details?month=${selectedMonth}&year=${selectedYear}`;
      
      // Use the browser's fetch API directly
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      // Log all info about the response
      console.log('Test connection status:', response.status);
      console.log('Test connection headers:', [...response.headers.entries()]);
      
      // Get the response as text to see exactly what's returned
      const text = await response.text();
      console.log('Test connection raw response:', text);
      
      // Display results to user
      if (response.ok) {
        showToast("success", "Kết nối API thành công!");
      } else {
        showToast("error", `Lỗi kết nối API: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Test connection error:", error);
      showToast("error", `Lỗi kết nối: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && instructorRevenues.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  // Error state
  if (error && instructorRevenues.length === 0) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <p>Lỗi: {error}</p>
        <div className="flex space-x-3 mt-2">
          <button 
            className="bg-white text-red-500 px-3 py-1 rounded"
            onClick={() => {
              setError(null);
              fetchInstructorRevenues();
            }}
          >
            Thử lại
          </button>
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={testConnection}
          >
            Kiểm tra kết nối
          </button>
        </div>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Doanh thu giảng viên</h2>
        
        <div className="flex space-x-3 items-center">
          {/* Month selector */}
          <select 
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md"
          >
            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
          
          {/* Year selector */}
          <select 
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded-md"
          >
            {Array.from({length: 6}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {/* View Report button */}
          <button
            onClick={viewCurrentMonthReport}
            disabled={fetching}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {fetching ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </>
            ) : (
              <>Xem báo cáo</>
            )}
          </button>
          
          {/* Calculate button */}
          <button
            onClick={calculateRevenues}
            disabled={calculating}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            {calculating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tính toán...
              </>
            ) : (
              <>Tính toán doanh thu</>
            )}
          </button>
          
          {/* Test Connection button */}
          <button
            onClick={testConnection}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Kiểm tra kết nối
          </button>
        </div>
      </div>

      {/* Calculation Result Panel */}
      {showCalculationResult && calculationResult && (
        <motion.div 
          className="bg-gray-700 p-4 rounded-lg mb-6 border border-gray-600"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Kết quả doanh thu {getMonthName(calculationResult.month)}/{calculationResult.year}</h3>
            <button 
              onClick={() => setShowCalculationResult(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Tổng doanh thu</p>
              <p className="text-green-400 font-bold text-lg">
                {calculationResult.totalRevenue ? formatCurrency(calculationResult.totalRevenue) : "0 ₫"}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Phần chia giảng viên</p>
              <p className="text-blue-400 font-bold text-lg">
                {calculationResult.totalInstructorShare ? formatCurrency(calculationResult.totalInstructorShare) : "0 ₫"}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Phần chia nền tảng</p>
              <p className="text-purple-400 font-bold text-lg">
                {calculationResult.totalPlatformShare ? formatCurrency(calculationResult.totalPlatformShare) : "0 ₫"}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Tổng thưởng đánh giá</p>
              <p className="text-yellow-400 font-bold text-lg">
                {calculationResult.totalRatingBonus ? formatCurrency(calculationResult.totalRatingBonus) : "0 ₫"}
              </p>
            </div>
          </div>
          
          {/* Top Instructors Table */}
          {calculationResult.topInstructors && calculationResult.topInstructors.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-2">Giảng viên có doanh thu cao nhất</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-left text-gray-400">Giảng viên</th>
                      <th className="py-2 px-4 text-right text-gray-400">Doanh thu</th>
                      <th className="py-2 px-4 text-right text-gray-400">Tỷ lệ</th>
                      <th className="py-2 px-4 text-right text-gray-400">Phần chia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResult.topInstructors.map((instructor, index) => (
                      <tr key={index} className="border-t border-gray-700 hover:bg-gray-700">
                        <td className="py-2 px-4 text-white">
                          <button 
                            className="hover:text-blue-400"
                            onClick={() => handleInstructorSelect(instructor.instructorId)}
                          >
                            {instructor.instructorName}
                          </button>
                        </td>
                        <td className="py-2 px-4 text-right text-green-400">
                          {formatCurrency(instructor.totalRevenue)}
                        </td>
                        <td className="py-2 px-4 text-right text-blue-400">
                          {instructor.effectiveSharePercentage.toFixed(1)}%
                        </td>
                        <td className="py-2 px-4 text-right text-white">
                          {formatCurrency(instructor.instructorShare + (instructor.ratingBonus || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="space-y-6">
        {selectedInstructorId && instructorDetails ? (
          <InstructorRevenueDetail 
            instructorDetails={instructorDetails}
            monthlyRevenue={monthlyRevenue}
            selectedYear={selectedYear}
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
            onSearch={handleSearch}
            onSort={handleSort}
            onYearChange={handleYearChange}
            onPageChange={handlePageChange}
            onInstructorSelect={handleInstructorSelect}
          />
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white p-4 rounded-lg shadow-lg z-50 max-w-md`}>
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

export default AdminInstructorRevenueWithErrorBoundary;