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

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const itemsPerPage = 10;

  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedYear, setSelectedYear] = useState(2025);

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Initial data load
  useEffect(() => {
    fetchInstructorRevenues();
  }, []);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues?page=${apiPage}&size=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch instructor revenues: ${response.status}`);
      }

      const data = await response.json();
      console.log("Instructor revenues data:", data);
      
      // Format data for display
      if (Array.isArray(data)) {
        setInstructorRevenues(data);
        setItemCount(data.length);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else if (data.content && Array.isArray(data.content)) {
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
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      // Sử dụng month và year từ API
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/calculate?month=${currentMonth}&year=${selectedYear}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to calculate revenues: ${response.status}`);
      }

      const result = await response.json();
      showToast("success", result.message || "Doanh thu đã được tính toán thành công");
      
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
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/${instructorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch instructor details: ${response.status}`);
      }

      const data = await response.json();
      setInstructorDetails(data);
      
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
      
      const response = await fetch(
        `${baseUrl}/api/admin/instructor-revenues/${instructorId}/monthly?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          throw new Error("Session expired. Please login again.");
        }
        
        throw new Error(`Failed to fetch monthly revenue: ${response.status}`);
      }

      const data = await response.json();
      console.log("Monthly revenue data:", data);
      
      // Format data for chart display
      const formattedData = data.map(item => ({
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
    setSelectedYear(year);
    
    // Refresh data based on new year
    if (selectedInstructorId) {
      fetchInstructorMonthlyRevenue(selectedInstructorId);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchInstructorRevenues(page);
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
        <button 
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded"
          onClick={() => {
            setError(null);
            fetchInstructorRevenues();
          }}
        >
          Thử lại
        </button>
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
      </div>

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
        <div className={`fixed bottom-4 right-4 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"} text-white p-4 rounded-lg shadow-lg z-50`}>
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