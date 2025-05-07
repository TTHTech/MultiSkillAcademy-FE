import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  DollarSign,
  Users,
  BarChart2
} from "lucide-react";
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
        <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-500 text-red-400 p-4 rounded-lg my-4 shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-red-400">Đã xảy ra lỗi</h2>
              <p className="text-sm mt-1 font-medium text-red-300">{this.state.error?.message || 'Không thể hiển thị component này'}</p>
              <button 
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out shadow-sm font-medium text-sm flex items-center"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} className="mr-2" />
                Tải lại trang
              </button>
            </div>
          </div>
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
  const [itemsPerPage] = useState(10);

  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("totalRevenue");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  
  // New filter states
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });
  const [revenueRange, setRevenueRange] = useState({
    min: '',
    max: ''
  });
  const [studentCountRange, setStudentCountRange] = useState({
    min: '',
    max: ''
  });
  const [courseCountRange, setCourseCountRange] = useState({
    min: '',
    max: ''
  });

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
        `${baseUrl}/api/admin/instructor-sales`,
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
      setCurrentPage(1);
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
    setCurrentPage(1);
    
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
    setCurrentPage(1);
  };

  // Handle filter type change
  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    
    // Apply filters based on selection
    if (type === "all") {
      fetchInstructorSales();
    } else if (type === "topSales") {
      const sorted = [...instructorSales].sort((a, b) => b.totalRevenue - a.totalRevenue);
      setInstructorSales(sorted);
    } else if (type === "topStudents") {
      const sorted = [...instructorSales].sort((a, b) => b.studentCount - a.studentCount);
      setInstructorSales(sorted);
    } else if (type === "topCourses") {
      const sorted = [...instructorSales].sort((a, b) => b.courseCount - a.courseCount);
      setInstructorSales(sorted);
    } else if (type === "lowPerformance") {
      const sorted = [...instructorSales].sort((a, b) => a.totalRevenue - b.totalRevenue);
      setInstructorSales(sorted);
    }
    
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setDateRange({ from: '', to: '' });
    setRevenueRange({ min: '', max: '' });
    setStudentCountRange({ min: '', max: '' });
    setCourseCountRange({ min: '', max: '' });
    fetchInstructorSales();
  };

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    let filtered = [...instructorSales];
    
    // Apply revenue range filter
    if (revenueRange.min !== '') {
      filtered = filtered.filter(instructor => 
        instructor.totalRevenue >= parseFloat(revenueRange.min)
      );
    }
    
    if (revenueRange.max !== '') {
      filtered = filtered.filter(instructor => 
        instructor.totalRevenue <= parseFloat(revenueRange.max)
      );
    }
    
    // Apply student count range filter
    if (studentCountRange.min !== '') {
      filtered = filtered.filter(instructor => 
        instructor.studentCount >= parseInt(studentCountRange.min)
      );
    }
    
    if (studentCountRange.max !== '') {
      filtered = filtered.filter(instructor => 
        instructor.studentCount <= parseInt(studentCountRange.max)
      );
    }
    
    // Apply course count range filter
    if (courseCountRange.min !== '') {
      filtered = filtered.filter(instructor => 
        instructor.courseCount >= parseInt(courseCountRange.min)
      );
    }
    
    if (courseCountRange.max !== '') {
      filtered = filtered.filter(instructor => 
        instructor.courseCount <= parseInt(courseCountRange.max)
      );
    }
    
    setInstructorSales(filtered);
    setCurrentPage(1);
    setShowFilters(false);
    
    // Show toast notification about applied filters
    const appliedFilters = [];
    if (revenueRange.min !== '' || revenueRange.max !== '') appliedFilters.push("doanh thu");
    if (studentCountRange.min !== '' || studentCountRange.max !== '') appliedFilters.push("số học viên");
    if (courseCountRange.min !== '' || courseCountRange.max !== '') appliedFilters.push("số khóa học");
    
    if (appliedFilters.length > 0) {
      showToast("success", `Đã áp dụng bộ lọc: ${appliedFilters.join(", ")}`);
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    const filteredSales = getFilteredSales();
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Giảng viên,Số học viên,Số khóa học,Tổng doanh thu,Doanh thu/khóa học\n";
    
    // Add data rows
    filteredSales.forEach(instructor => {
      csvContent += `"${instructor.firstName} ${instructor.lastName}",`;
      csvContent += `${instructor.studentCount},`;
      csvContent += `${instructor.courseCount},`;
      csvContent += `${instructor.totalRevenue},`;
      csvContent += `${instructor.revenuePerCourse}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao-cao-doanh-so-giang-vien_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    showToast("success", "Đã xuất dữ liệu thành công");
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

  // Loading state with animation
  if (loading && instructorSales.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 h-12 w-12 mb-4 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="text-purple-400 text-lg font-medium">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Error state with improved styling
  if (error && instructorSales.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-red-800">
        <div className="p-6">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 text-white mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400">Lỗi khi tải dữ liệu</h3>
              <p className="text-red-300 mt-1">{error}</p>
            </div>
          </div>
          <button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 shadow-sm font-medium flex items-center"
            onClick={() => {
              setError(null);
              fetchInstructorSales();
            }}
          >
            <RefreshCw size={16} className="mr-2" />
            Thử lại
          </button>
        </div>
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
      className="bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Báo Cáo Doanh Số Giảng Viên</h2>
            <p className="text-indigo-200 text-sm mt-1">Quản lý và phân tích hiệu suất của giảng viên</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={exportToCSV}
              className="bg-gray-800 text-purple-300 hover:bg-gray-700 px-3 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-700"
            >
              <Download size={16} className="mr-2" />
              Xuất CSV
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-purple-700 text-white' : 'bg-gray-800 text-purple-300 hover:bg-gray-700'} px-3 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-700`}
            >
              <Filter size={16} className="mr-2" />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <motion.div 
          className="bg-gray-800 border-b border-gray-700 p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Doanh thu</label>
              <div className="flex items-center space-x-2">
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={revenueRange.min}
                    onChange={(e) => setRevenueRange({...revenueRange, min: e.target.value})}
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối đa"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={revenueRange.max}
                    onChange={(e) => setRevenueRange({...revenueRange, max: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Số học viên</label>
              <div className="flex items-center space-x-2">
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={studentCountRange.min}
                    onChange={(e) => setStudentCountRange({...studentCountRange, min: e.target.value})}
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối đa"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={studentCountRange.max}
                    onChange={(e) => setStudentCountRange({...studentCountRange, max: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Số khóa học</label>
              <div className="flex items-center space-x-2">
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối thiểu"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={courseCountRange.min}
                    onChange={(e) => setCourseCountRange({...courseCountRange, min: e.target.value})}
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    placeholder="Tối đa"
                    className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2 sm:text-sm bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md"
                    value={courseCountRange.max}
                    onChange={(e) => setCourseCountRange({...courseCountRange, max: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button 
              onClick={resetAllFilters}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-200"
            >
              Đặt lại
            </button>
            <button 
              onClick={applyAdvancedFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-200"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </motion.div>
      )}

      <div className="p-6 bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên giảng viên..."
                className="block w-full pl-10 pr-4 py-2.5 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="text-gray-400 hover:text-gray-200" size={18} />
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 md:ml-4">
            <select 
              value={filterType} 
              onChange={handleFilterTypeChange}
              className="block w-full py-2.5 px-4 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Tất cả giảng viên</option>
              <option value="topSales">Doanh thu cao nhất</option>
              <option value="topStudents">Học viên nhiều nhất</option>
              <option value="topCourses">Khóa học nhiều nhất</option>
              <option value="lowPerformance">Doanh thu thấp nhất</option>
            </select>
          </div>
        </div>
        
        {/* Active filters display */}
        {(searchTerm || filterType !== "all" || revenueRange.min || revenueRange.max || studentCountRange.min || studentCountRange.max || courseCountRange.min || courseCountRange.max) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200 border border-indigo-700">
                Tìm kiếm: {searchTerm}
                <button 
                  className="ml-1 text-indigo-300 hover:text-indigo-100"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {filterType !== "all" && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-200 border border-blue-700">
                {filterType === "topSales" && "Doanh thu cao nhất"}
                {filterType === "topStudents" && "Học viên nhiều nhất"}
                {filterType === "topCourses" && "Khóa học nhiều nhất"}
                {filterType === "lowPerformance" && "Doanh thu thấp nhất"}
                <button 
                  className="ml-1 text-blue-300 hover:text-blue-100"
                  onClick={() => setFilterType("all")}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {(revenueRange.min || revenueRange.max) && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900 text-emerald-200 border border-emerald-700">
                Doanh thu: {revenueRange.min ? formatCurrency(revenueRange.min) : "0đ"} - {revenueRange.max ? formatCurrency(revenueRange.max) : "không giới hạn"}
                <button 
                  className="ml-1 text-emerald-300 hover:text-emerald-100"
                  onClick={() => setRevenueRange({min: '', max: ''})}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {(studentCountRange.min || studentCountRange.max) && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-900 text-amber-200 border border-amber-700">
                Học viên: {studentCountRange.min || "0"} - {studentCountRange.max || "không giới hạn"}
                <button 
                  className="ml-1 text-amber-300 hover:text-amber-100"
                  onClick={() => setStudentCountRange({min: '', max: ''})}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {(courseCountRange.min || courseCountRange.max) && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900 text-purple-200 border border-purple-700">
                Khóa học: {courseCountRange.min || "0"} - {courseCountRange.max || "không giới hạn"}
                <button 
                  className="ml-1 text-purple-300 hover:text-purple-100"
                  onClick={() => setCourseCountRange({min: '', max: ''})}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {(searchTerm || filterType !== "all" || revenueRange.min || revenueRange.max || studentCountRange.min || studentCountRange.max || courseCountRange.min || courseCountRange.max) && (
              <button 
                onClick={resetAllFilters}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-200 hover:bg-red-800 transition duration-200 border border-red-700"
              >
                Xóa tất cả bộ lọc
                <X size={14} className="ml-1" />
              </button>
            )}
          </div>
        )}
        
        {/* Table */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-900 bg-opacity-60">
                <th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort("lastName")}
                >
                  <div className="flex items-center">
                    <span>Giảng viên</span>
                    <div className="ml-1">
                      {sortField === "lastName" ? (
                        sortDirection === "asc" 
                          ? <ChevronUp size={14} className="text-purple-400" /> 
                          : <ChevronDown size={14} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort("studentCount")}
                >
                  <div className="flex items-center">
                    <span>Số học viên</span>
                    <div className="ml-1">
                      {sortField === "studentCount" ? (
                        sortDirection === "asc" 
                          ? <ChevronUp size={14} className="text-purple-400" /> 
                          : <ChevronDown size={14} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort("courseCount")}
                >
                  <div className="flex items-center">
                    <span>Số khóa học</span>
                    <div className="ml-1">
                      {sortField === "courseCount" ? (
                        sortDirection === "asc" 
                          ? <ChevronUp size={14} className="text-purple-400" /> 
                          : <ChevronDown size={14} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort("totalRevenue")}
                >
                  <div className="flex items-center">
                    <span>Tổng doanh thu</span>
                    <div className="ml-1">
                      {sortField === "totalRevenue" ? (
                        sortDirection === "asc" 
                          ? <ChevronUp size={14} className="text-purple-400" /> 
                          : <ChevronDown size={14} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </th>
                <th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                  onClick={() => handleSort("revenuePerCourse")}
                >
                  <div className="flex items-center">
                    <span>Doanh thu/khóa học</span>
                    <div className="ml-1">
                      {sortField === "revenuePerCourse" ? (
                        sortDirection === "asc" 
                          ? <ChevronUp size={14} className="text-purple-400" /> 
                          : <ChevronDown size={14} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((instructor, index) => (
                  <tr 
                    key={`instructor-sale-${index}`} 
                    className={`transition duration-150 ease-in-out hover:bg-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-lg font-medium shadow-lg">
                          {instructor.firstName?.charAt(0) || ''}
                          {instructor.lastName?.charAt(0) || ''}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-200">{instructor.firstName} {instructor.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{instructor.studentCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{instructor.courseCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-200">{formatCurrency(instructor.totalRevenue)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatCurrency(instructor.revenuePerCourse)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-400 text-lg">Không tìm thấy dữ liệu nào</span>
                      <p className="text-gray-500 text-sm mt-1">Kiểm tra lại các bộ lọc hoặc tải lại trang</p>
                      <button 
                        onClick={resetAllFilters}
                        className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition duration-200 text-sm font-medium flex items-center"
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredSales.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <span>Hiển thị </span>
              <span className="font-medium text-gray-300">{indexOfFirstItem + 1}</span>
              <span> - </span>
              <span className="font-medium text-gray-300">{Math.min(indexOfLastItem, filteredSales.length)}</span>
              <span> trong tổng số </span>
              <span className="font-medium text-gray-300">{filteredSales.length}</span>
              <span> kết quả</span>
              {searchTerm && <span className="font-medium text-gray-300"> cho tìm kiếm "{searchTerm}"</span>}
            </div>

            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-l-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
              >
                Trước
              </button>
              
              {(() => {
                const pages = [];
                
                if (totalPages <= 7) {
                  // Hiển thị tất cả các trang nếu tổng số trang <= 7
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 text-sm font-medium border ${
                          currentPage === i 
                            ? "bg-purple-700 text-white border-purple-600" 
                            : "text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  // Hiển thị logic phân trang phức tạp hơn
                  let startPage = Math.max(1, currentPage - 2);
                  let endPage = Math.min(totalPages, startPage + 4);
                  
                  if (endPage - startPage < 4) {
                    startPage = Math.max(1, endPage - 4);
                  }
                  
                  // Trang đầu
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600"
                      >
                        1
                      </button>
                    );
                    
                    if (startPage > 2) {
                      pages.push(
                        <span key="dots-start" className="px-4 py-2 text-gray-400 border border-gray-600 bg-gray-700">...</span>
                      );
                    }
                  }
                  
                  // Các trang ở giữa
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-2 text-sm font-medium border ${
                          currentPage === i 
                            ? "bg-purple-700 text-white border-purple-600" 
                            : "text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Trang cuối
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="dots-end" className="px-4 py-2 text-gray-400 border border-gray-600 bg-gray-700">...</span>
                      );
                    }
                    
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                }
                
                return pages;
              })()}
              
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-r-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-700"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <motion.div 
          className={`fixed bottom-4 right-4 ${
            toast.type === "success" ? "bg-green-700" : "bg-red-700"
          } text-white p-4 rounded-lg shadow-xl z-50 max-w-md border ${
            toast.type === "success" ? "border-green-600" : "border-red-600"
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {toast.type === "success" ? (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminInstructorSalesWithErrorBoundary;