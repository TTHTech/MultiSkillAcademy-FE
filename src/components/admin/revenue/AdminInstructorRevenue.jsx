import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

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
      <AdminInstructorRevenue />
    </ErrorBoundary>
  );
};

// Main component
const AdminInstructorRevenue = () => {
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
        `http://localhost:8080/api/admin/instructor-revenues?page=${apiPage}&size=${itemsPerPage}`,
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
        `http://localhost:8080/api/admin/instructor-revenues/calculate?month=${currentMonth}&year=${selectedYear}`,
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
        `http://localhost:8080/api/admin/instructor-revenues/${instructorId}`,
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
        `http://localhost:8080/api/admin/instructor-revenues/${instructorId}/monthly?year=${selectedYear}`,
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

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchInstructorRevenues(page);
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
      // If search term is cleared, reset to page 1 and fetch from API
      setCurrentPage(1);
      fetchInstructorRevenues(1);
    } else {
      // Filter the current data
      const filtered = instructorRevenues.filter(instructor => 
        (instructor.instructorFirstName && instructor.instructorFirstName.toLowerCase().includes(term)) || 
        (instructor.instructorLastName && instructor.instructorLastName.toLowerCase().includes(term))
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

  // Handle year selection
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    
    // Refresh data based on new year
    if (selectedInstructorId) {
      fetchInstructorMonthlyRevenue(selectedInstructorId);
    }
  };

  // Handle instructor selection
  const handleInstructorSelect = (instructorId) => {
    setSelectedInstructorId(instructorId);
    fetchInstructorDetails(instructorId);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return value.toFixed(1) + "%";
  };

  // Get month name
  const getMonthName = (monthNumber) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[monthNumber - 1] || `Tháng ${monthNumber}`;
  };

  // Render instructor details
  const renderInstructorDetails = () => {
    if (!instructorDetails) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <button
            onClick={() => {
              setSelectedInstructorId(null);
              setInstructorDetails(null);
            }}
            className="text-gray-400 hover:text-white flex items-center"
          >
            ← Quay lại danh sách
          </button>
          
          <span className="text-gray-400">
            Năm: {selectedYear}
          </span>
        </div>
        
        {/* Instructor header */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">
            {instructorDetails.instructorFirstName} {instructorDetails.instructorLastName}
          </h2>
          <div className="flex flex-wrap gap-4 text-gray-300">
            <div>
              <span className="text-gray-400">ID: </span>
              {instructorDetails.instructorId}
            </div>
            <div>
              <span className="text-gray-400">Tổng doanh thu: </span>
              {formatCurrency(instructorDetails.totalRevenue)}
            </div>
            <div>
              <span className="text-gray-400">Phần chia GV: </span>
              {formatCurrency(instructorDetails.instructorShare)} ({formatPercent(instructorDetails.effectiveSharePercentage || 0)})
            </div>
          </div>
        </div>
        
        {/* Monthly revenue chart */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Doanh thu theo tháng (Triệu VNĐ)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip 
                  formatter={(value) => [`${value} Triệu VNĐ`, "Doanh thu"]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenueMillions" 
                  name="Doanh thu"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="instructorShare" 
                  name="Phần chia GV" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Revenue sources */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Phân bổ doanh thu theo nguồn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-300 mb-2">Nguồn</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span>Giảng viên giới thiệu</span>
                  <span className="font-bold">{formatPercent(instructorDetails.instructorReferredPercentage || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span>Nền tảng giới thiệu</span>
                  <span className="font-bold">
                    {formatPercent(100 - (instructorDetails.instructorReferredPercentage || 0))}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { 
                        name: "Giảng viên giới thiệu", 
                        value: instructorDetails.instructorReferredPercentage || 0 
                      },
                      { 
                        name: "Nền tảng giới thiệu", 
                        value: 100 - (instructorDetails.instructorReferredPercentage || 0) 
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${(value).toFixed(1)}%`, "Phần trăm"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
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
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm giảng viên..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="bg-gray-700 text-white rounded-lg p-2"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        
        {selectedInstructorId && instructorDetails ? (
          renderInstructorDetails()
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-white">
              <thead className="text-xs uppercase bg-gray-700 text-white">
                <tr>
                  <th 
                    className="py-3 px-4 cursor-pointer" 
                    onClick={() => handleSort("instructorId")}
                  >
                    ID
                    {sortField === "instructorId" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="inline ml-1" /> 
                        : <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer" 
                    onClick={() => handleSort("instructorLastName")}
                  >
                    Họ tên
                    {sortField === "instructorLastName" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="inline ml-1" /> 
                        : <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer" 
                    onClick={() => handleSort("totalRevenue")}
                  >
                    Tổng doanh thu
                    {sortField === "totalRevenue" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="inline ml-1" /> 
                        : <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer" 
                    onClick={() => handleSort("instructorShare")}
                  >
                    Phần chia GV
                    {sortField === "instructorShare" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="inline ml-1" /> 
                        : <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th 
                    className="py-3 px-4 cursor-pointer" 
                    onClick={() => handleSort("effectiveSharePercentage")}
                  >
                    Tỷ lệ hiệu quả
                    {sortField === "effectiveSharePercentage" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="inline ml-1" /> 
                        : <ChevronDown size={14} className="inline ml-1" />
                    )}
                  </th>
                  <th className="py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {instructorRevenues.length > 0 ? (
                  instructorRevenues.map((revenue) => (
                    <tr key={revenue.id || `revenue-${Math.random()}`} className="border-b border-gray-600">
                      <td className="py-3 px-4">{revenue.instructorId || 'N/A'}</td>
                      <td className="py-3 px-4">{revenue.instructorFirstName} {revenue.instructorLastName}</td>
                      <td className="py-3 px-4">{formatCurrency(revenue.totalRevenue)}</td>
                      <td className="py-3 px-4">{formatCurrency(revenue.instructorShare)}</td>
                      <td className="py-3 px-4">{formatPercent(revenue.effectiveSharePercentage || 0)}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleInstructorSelect(revenue.instructorId)}
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                          title="Xem chi tiết"
                        >
                          <ExternalLink size={18} className="mr-1" />
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      Không tìm thấy dữ liệu doanh thu. Kiểm tra lại các bộ lọc hoặc tải lại trang.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!selectedInstructorId && (
          <div className="flex justify-between mt-4 items-center">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              Trước
            </button>

            <div className="flex items-center">
              {itemCount > 0 && (
                <span className="text-gray-400 text-sm mr-4">
                  {itemCount} phần tử | Trang {currentPage} / {totalPages}
                </span>
              )}
              
              {(() => {
                if (instructorRevenues.length === 0 && !loading) {
                  return <span className="text-gray-400">Không có dữ liệu</span>;
                }
                
                const pages = [];
                
                if (totalPages <= 13) {
                  // Hiển thị tất cả các trang nếu tổng số trang <= 13
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 mx-1 rounded-lg ${
                          currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  // Hiển thị 10 trang đầu và 3 trang cuối, với logic động
                  if (currentPage <= 10) {
                    for (let i = 1; i <= 10; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    pages.push(<span key="dots-end" className="px-4 py-2">...</span>);
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else if (currentPage > 10 && currentPage <= totalPages - 10) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={`px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300`}
                      >
                        1
                      </button>
                    );
                    pages.push(<span key="dots-start" className="px-4 py-2">...</span>);
                
                    for (let i = currentPage - 4; i <= currentPage + 4; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                
                    pages.push(<span key="dots-end" className="px-4 py-2">...</span>);
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  } else {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={`px-4 py-2 mx-1 rounded-lg bg-gray-700 text-gray-300`}
                      >
                        1
                      </button>
                    );
                    pages.push(<span key="dots-start" className="px-4 py-2">...</span>);
                
                    for (let i = totalPages - 12; i <= totalPages; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                  }
                }
                
                return pages;
              })()}
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              Tiếp
            </button>
          </div>
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