import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

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
const AdminInstructorSalesWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminInstructorSales />
    </ErrorBoundary>
  );
};

// Main component
const AdminInstructorSales = () => {
  // States for instructor sales
  const [instructorSales, setInstructorSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Hiển thị 10 phần tử mỗi trang

  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("totalRevenue");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Initial data load
  useEffect(() => {
    fetchInstructorSales();
  }, []);

  // Error handling function
  const handleAuthError = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch instructor sales data
  const fetchInstructorSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        handleAuthError();
        throw new Error("No token found, please login again.");
      }
      
      const response = await fetch(
        "http://localhost:8080/api/admin/instructor-sales",
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
        
        throw new Error(`Failed to fetch instructor sales: ${response.status}`);
      }

      const data = await response.json();
      
      // Sort by default - highest revenue first
      const sortedData = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);
      setInstructorSales(sortedData);
      setCurrentPage(1); // Reset to page 1 when loading new data
    } catch (error) {
      console.error("Error fetching instructor sales:", error);
      setError(error.message);
      showToast("error", `Lỗi khi tải dữ liệu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    // Reset to page 1 when searching
    setCurrentPage(1);
    
    // Re-fetch data if search is cleared
    if (term === "") {
      fetchInstructorSales();
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    
    // Sort the current data
    const sorted = [...instructorSales].sort((a, b) => {
      if (a[field] === undefined) return newDirection === "asc" ? -1 : 1;
      if (b[field] === undefined) return newDirection === "asc" ? 1 : -1;
      
      return newDirection === "asc"
        ? a[field] > b[field] ? 1 : -1
        : a[field] < b[field] ? 1 : -1;
    });
    
    setInstructorSales(sorted);
    setCurrentPage(1); // Reset to page 1 when sorting
  };

  // Handle filter type change
  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    
    // Apply filters based on selection
    if (type === "all") {
      // Reset to original sorted list
      fetchInstructorSales();
    } else if (type === "topSales") {
      // Sort by highest revenue
      const sorted = [...instructorSales].sort((a, b) => b.totalRevenue - a.totalRevenue);
      setInstructorSales(sorted);
    } else if (type === "topStudents") {
      // Sort by most students
      const sorted = [...instructorSales].sort((a, b) => b.studentCount - a.studentCount);
      setInstructorSales(sorted);
    }
    
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get filtered sales data
  const getFilteredSales = () => {
    if (!searchTerm) return instructorSales;
    
    return instructorSales.filter(instructor => 
      (instructor.firstName && instructor.firstName.toLowerCase().includes(searchTerm)) || 
      (instructor.lastName && instructor.lastName.toLowerCase().includes(searchTerm))
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Loading state
  if (loading && instructorSales.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white">Đang tải...</div>
      </div>
    );
  }

  // Error state
  if (error && instructorSales.length === 0) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <p>Lỗi: {error}</p>
        <button 
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded"
          onClick={() => {
            setError(null);
            fetchInstructorSales();
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Get filtered and paginated data
  const filteredSales = getFilteredSales();
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Doanh số giảng viên</h2>
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
            value={filterType} 
            onChange={handleFilterTypeChange}
            className="bg-gray-700 text-white rounded-lg p-2"
          >
            <option value="all">Tất cả giảng viên</option>
            <option value="topSales">Doanh thu cao nhất</option>
            <option value="topStudents">Học viên nhiều nhất</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white">
            <thead className="text-xs uppercase bg-gray-700 text-white">
              <tr>
                <th 
                  className="py-3 px-4 cursor-pointer" 
                  onClick={() => handleSort("lastName")}
                >
                  Giảng viên
                  {sortField === "lastName" && (
                    sortDirection === "asc" 
                      ? <ChevronUp size={14} className="inline ml-1" /> 
                      : <ChevronDown size={14} className="inline ml-1" />
                  )}
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer" 
                  onClick={() => handleSort("studentCount")}
                >
                  Số học viên
                  {sortField === "studentCount" && (
                    sortDirection === "asc" 
                      ? <ChevronUp size={14} className="inline ml-1" /> 
                      : <ChevronDown size={14} className="inline ml-1" />
                  )}
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer" 
                  onClick={() => handleSort("courseCount")}
                >
                  Số khóa học
                  {sortField === "courseCount" && (
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
                  onClick={() => handleSort("revenuePerCourse")}
                >
                  Doanh thu/khóa học
                  {sortField === "revenuePerCourse" && (
                    sortDirection === "asc" 
                      ? <ChevronUp size={14} className="inline ml-1" /> 
                      : <ChevronDown size={14} className="inline ml-1" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((instructor, index) => (
                  <tr key={`instructor-sale-${index}`} className="border-b border-gray-600">
                    <td className="py-3 px-4">{instructor.firstName} {instructor.lastName}</td>
                    <td className="py-3 px-4">{instructor.studentCount}</td>
                    <td className="py-3 px-4">{instructor.courseCount}</td>
                    <td className="py-3 px-4">{formatCurrency(instructor.totalRevenue)}</td>
                    <td className="py-3 px-4">{formatCurrency(instructor.revenuePerCourse)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    Không tìm thấy dữ liệu bán hàng. Kiểm tra lại các bộ lọc hoặc tải lại trang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredSales.length > 0 && (
          <div className="flex justify-between mt-4 items-center">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-600 disabled:text-gray-400"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>

            <div className="flex items-center">
              {filteredSales.length > 0 && (
                <span className="text-gray-400 text-sm mr-4">
                  {filteredSales.length} phần tử
                </span>
              )}
              
              {(() => {
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
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Tiếp
            </button>
          </div>
        )}
        
        {/* Results summary */}
        <div className="text-right text-sm text-gray-400">
          Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSales.length)} của {filteredSales.length} kết quả
          {searchTerm ? ` cho tìm kiếm "${searchTerm}"` : ''}
        </div>
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

export default AdminInstructorSalesWithErrorBoundary;
