// src/components/admin/revenue/AdminInstructorSales.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Download, 
  RefreshCw, 
  DollarSign,
  Users,
  BarChart2,
  TrendingUp,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Toast from "./Toast";
import ErrorBoundary from "./ErrorBoundary";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// Main component
const AdminInstructorSales = () => {
  // States for instructor sales
  const [instructorSales, setInstructorSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [itemsPerPage] = useState(15);

  // States for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("totalRevenue");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  
  // Advanced filter states
  const [showFilters, setShowFilters] = useState(false);
  const [revenueRange, setRevenueRange] = useState({ min: '', max: '' });
  const [studentCountRange, setStudentCountRange] = useState({ min: '', max: '' });
  const [courseCountRange, setCourseCountRange] = useState({ min: '', max: '' });

  // Toast notification helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
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
      setItemCount(sortedData.length);
      setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
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
    setItemCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
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
    csvContent += "Giảng viên,Số học viên,Số khóa học,Tổng doanh thu,Doanh thu/khóa học,Đánh giá TB\n";
    
    // Add data rows
    filteredSales.forEach(instructor => {
      csvContent += `"${instructor.firstName} ${instructor.lastName}",`;
      csvContent += `${instructor.studentCount},`;
      csvContent += `${instructor.courseCount},`;
      csvContent += `${instructor.totalRevenue},`;
      csvContent += `${instructor.revenuePerCourse},`;
      csvContent += `${instructor.averageRating || 0}\n`;
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

  // Get performance badge
  const getPerformanceBadge = (instructor) => {
    const avgRevenuePerCourse = instructor.revenuePerCourse || 0;
    if (avgRevenuePerCourse > 50000000) { // > 50M
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-500/30">Xuất sắc</span>;
    } else if (avgRevenuePerCourse > 20000000) { // > 20M
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-500/30">Tốt</span>;
    } else if (avgRevenuePerCourse > 5000000) { // > 5M
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300 border border-yellow-500/30">Trung bình</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300 border border-red-500/30">Cần cải thiện</span>;
    }
  };

  // Loading state with animation
  if (loading && instructorSales.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 h-12 w-12 mb-4 flex items-center justify-center">
            <BarChart2 className="animate-bounce h-6 w-6 text-white" />
          </div>
          <div className="text-purple-400 text-lg font-medium">Đang tải dữ liệu bán hàng...</div>
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
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-400">Lỗi khi tải dữ liệu bán hàng</h3>
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
  const totalFilteredPages = Math.ceil(filteredSales.length / itemsPerPage);
  
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-gray-700/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header section with gradient background */}
      <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-sm px-6 py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="mr-3 h-7 w-7 text-indigo-400" />
              Báo Cáo Doanh Số Giảng Viên
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Quản lý và phân tích hiệu suất bán hàng của giảng viên</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={exportToCSV}
              className="bg-gray-800/80 text-purple-300 hover:bg-gray-700/80 px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-600/50 backdrop-blur-sm"
            >
              <Download size={16} className="mr-2" />
              Xuất CSV
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-purple-700 text-white' : 'bg-gray-800/80 text-purple-300 hover:bg-gray-700/80'} px-4 py-2 rounded-lg shadow-md flex items-center transition duration-200 text-sm font-medium border border-gray-600/50 backdrop-blur-sm`}
            >
              <Filter size={16} className="mr-2" />
              Bộ lọc nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Advanced filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700/50 p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Doanh thu (VNĐ)</label>
                <div className="flex items-center space-x-3">
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={revenueRange.min}
                      onChange={(e) => setRevenueRange({...revenueRange, min: e.target.value})}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối đa"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={revenueRange.max}
                      onChange={(e) => setRevenueRange({...revenueRange, max: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số học viên</label>
                <div className="flex items-center space-x-3">
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={studentCountRange.min}
                      onChange={(e) => setStudentCountRange({...studentCountRange, min: e.target.value})}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối đa"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={studentCountRange.max}
                      onChange={(e) => setStudentCountRange({...studentCountRange, max: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số khóa học</label>
                <div className="flex items-center space-x-3">
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={courseCountRange.min}
                      onChange={(e) => setCourseCountRange({...courseCountRange, min: e.target.value})}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">-</span>
                  <div className="relative rounded-md shadow-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      type="number"
                      placeholder="Tối đa"
                      className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm bg-gray-700/80 border-gray-600/50 placeholder-gray-400 text-white rounded-lg backdrop-blur-sm"
                      value={courseCountRange.max}
                      onChange={(e) => setCourseCountRange({...courseCountRange, max: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={resetAllFilters}
                className="px-4 py-2 border border-gray-600/50 rounded-lg text-sm font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-200 backdrop-blur-sm"
              >
                Đặt lại
              </button>
              <button 
                onClick={applyAdvancedFilters}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition duration-200"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên giảng viên..."
                className="block w-full pl-12 pr-4 py-3 text-gray-200 bg-gray-800/80 border border-gray-600/50 rounded-xl focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 backdrop-blur-sm transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
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
              className="block w-full py-3 px-4 text-gray-200 bg-gray-800/80 border border-gray-600/50 rounded-xl focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm"
            >
              <option value="all">Tất cả giảng viên</option>
              <option value="topSales">Doanh thu cao nhất</option>
              <option value="topStudents">Học viên nhiều nhất</option>
              <option value="topCourses">Khóa học nhiều nhất</option>
              <option value="lowPerformance">Cần cải thiện</option>
            </select>
          </div>
        </div>
        
        {/* Stats summary */}
        {filteredSales.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-400 mr-3" />
                <div>
                  <p className="text-blue-300 text-sm font-medium">Tổng giảng viên</p>
                  <p className="text-blue-400 font-bold text-xl">{filteredSales.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-emerald-400 mr-3" />
                <div>
                  <p className="text-emerald-300 text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-emerald-400 font-bold text-xl">
                    {formatCurrency(filteredSales.reduce((sum, instructor) => sum + (instructor.totalRevenue || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/30 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-400 mr-3" />
                <div>
                  <p className="text-purple-300 text-sm font-medium">Tổng khóa học</p>
                  <p className="text-purple-400 font-bold text-xl">
                    {filteredSales.reduce((sum, instructor) => sum + (instructor.courseCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-400 mr-3" />
                <div>
                  <p className="text-yellow-300 text-sm font-medium">TB/khóa học</p>
                  <p className="text-yellow-400 font-bold text-xl">
                    {formatCurrency(filteredSales.reduce((sum, instructor) => sum + (instructor.revenuePerCourse || 0), 0) / Math.max(filteredSales.length, 1))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Table */}
        <div className="overflow-x-auto bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead>
              <tr className="bg-gray-900/60 backdrop-blur-sm">
                <th 
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group hover:bg-gray-700/30 transition-colors"
                  onClick={() => handleSort("lastName")}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Giảng viên</span>
                    <div className="ml-2">
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
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group hover:bg-gray-700/30 transition-colors"
                  onClick={() => handleSort("studentCount")}
                >
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Học viên</span>
                    <div className="ml-2">
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
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group hover:bg-gray-700/30 transition-colors"
                  onClick={() => handleSort("courseCount")}
                >
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Khóa học</span>
                    <div className="ml-2">
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
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group hover:bg-gray-700/30 transition-colors"
                  onClick={() => handleSort("totalRevenue")}
                >
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>Doanh thu</span>
                    <div className="ml-2">
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
                  className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group hover:bg-gray-700/30 transition-colors"
                  onClick={() => handleSort("revenuePerCourse")}
                >
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <span>TB/khóa học</span>
                    <div className="ml-2">
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
                <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Hiệu suất
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {currentItems.length > 0 ? (
                currentItems.map((instructor, index) => (
                  <motion.tr 
                    key={`instructor-sale-${index}`} 
                    className="transition duration-150 ease-in-out hover:bg-gray-700/30 bg-gray-800/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-lg font-medium shadow-lg">
                          {instructor.firstName?.charAt(0) || ''}{instructor.lastName?.charAt(0) || ''}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-200">{instructor.firstName} {instructor.lastName}</div>
                          <div className="text-sm text-gray-400">ID: {instructor.id || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-sm text-gray-300 font-medium">{instructor.studentCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm text-gray-300 font-medium">{instructor.courseCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-emerald-400">{formatCurrency(instructor.totalRevenue || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-purple-400 font-medium">{formatCurrency(instructor.revenuePerCourse || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getPerformanceBadge(instructor)}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <BarChart2 className="h-16 w-16 text-gray-500 mb-4" />
                      <span className="text-gray-400 text-lg font-medium">Không tìm thấy dữ liệu nào</span>
                      <p className="text-gray-500 text-sm mt-2">
                        {searchTerm 
                          ? `Không có kết quả cho "${searchTerm}"` 
                          : "Kiểm tra lại các bộ lọc hoặc tải lại trang"}
                      </p>
                      <button 
                        onClick={resetAllFilters}
                        className="mt-4 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition duration-200 text-sm font-medium flex items-center"
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
        {totalFilteredPages > 1 && (
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

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/80 border border-gray-600/50 rounded-l-lg hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={16} />
              </button>
              
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);
                
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-4 py-2 text-sm font-medium border transition-all ${
                        currentPage === i 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-lg" 
                          : "text-gray-300 bg-gray-800/80 border-gray-600/50 hover:bg-gray-700/80 backdrop-blur-sm"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }
                
                return pages;
              })()}
              
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalFilteredPages))}
                disabled={currentPage === totalFilteredPages}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/80 border border-gray-600/50 rounded-r-lg hover:bg-gray-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all backdrop-blur-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </motion.div>
  );
};

// Main component wrapper with error boundary
const AdminInstructorSalesWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <AdminInstructorSales />
    </ErrorBoundary>
  );
};

export default AdminInstructorSalesWithErrorBoundary;