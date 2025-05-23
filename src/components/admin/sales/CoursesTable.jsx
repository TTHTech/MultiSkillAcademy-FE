import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, FileText, RefreshCcw, Filter, ChevronDown, ChevronLeft, 
  ChevronRight, X, AlertCircle, FileSpreadsheet, BookOpen, DollarSign, 
  Star, ShoppingCart, Activity, ListFilter, SortAsc, SortDesc
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const SalesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8; // Changed to 8 for better spacing
  const [totalPages, setTotalPages] = useState(1);

  // Advanced filters with state management
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    category: "",
    revenue: "",
    review: "",
    sales: "",
    status: ""
  });
  
  // Sorting management
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  const [exportOption, setExportOption] = useState("currentPage");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Available categories (derived from data for real apps)
  const categories = [
    "Phát triển",
    "Kinh doanh",
    "Tài chính & Kế toán",
    "CNTT & Phần mềm",
    "Năng suất văn phòng",
    "Thiết kế đồ họa"
  ];

  // Sort request handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      key = null;
      direction = null;
    }
    
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ListFilter size={14} className="ml-1 text-slate-400" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <SortAsc size={14} className="ml-1 text-blue-400" /> 
      : <SortDesc size={14} className="ml-1 text-blue-400" />;
  };

  // Apply sorting and filtering to data
  const sortedCourses = useMemo(() => {
    let sortableItems = [...filteredCourses];
    
    if (sortConfig.key && sortConfig.direction) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [filteredCourses, sortConfig]);

  // Fetch data
  const fetchSalesData = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch(`${baseUrl}/api/admin/sales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add cache busting
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sales data.");
      }

      const data = await response.json();

      // Add a short delay to ensure loading state is visible
      setTimeout(() => {
        const updatedData = data.map((course) => ({
          ...course,
          totalRevenue: course.totalRevenue || 0,
          averageReviews: course.averageReviews || 0,
          reviewCount: course.reviewCount || 0,
          totalSales: course.totalSales || 0,
          courseStatus: course.courseStatus || "Inactive",
        }));

        setCourses(updatedData);
        setFilteredCourses(updatedData);

        const totalPages = Math.ceil(updatedData.length / coursesPerPage);
        setTotalPages(totalPages);
        
        setLoading(false);
        setRefreshing(false);
      }, 600);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching sales data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Apply all filters
  useEffect(() => {
    let filtered = [...courses];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.courseId.toLowerCase().includes(term) ||
          course.title.toLowerCase().includes(term)
      );
    }
    
    // Category filter
    if (advancedFilters.category) {
      filtered = filtered.filter((course) => course.categoryName === advancedFilters.category);
    }

    // Revenue filter
    if (advancedFilters.revenue) {
      filtered = advancedFilters.revenue === "low"
        ? filtered.sort((a, b) => a.totalRevenue - b.totalRevenue)
        : filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    // Review filter
    if (advancedFilters.review) {
      filtered = advancedFilters.review === "low"
        ? filtered.sort((a, b) => a.averageReviews - b.averageReviews)
        : filtered.sort((a, b) => b.averageReviews - a.averageReviews);
    }

    // Sales filter
    if (advancedFilters.sales) {
      filtered = advancedFilters.sales === "low"
        ? filtered.sort((a, b) => a.totalSales - b.totalSales)
        : filtered.sort((a, b) => b.totalSales - a.totalSales);
    }

    // Status filter
    if (advancedFilters.status) {
      filtered = filtered.filter((course) => course.courseStatus === advancedFilters.status);
    }

    setFilteredCourses(filtered);
    setTotalPages(Math.ceil(filtered.length / coursesPerPage));
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, courses, advancedFilters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: null });
    setAdvancedFilters({
      category: "",
      revenue: "",
      review: "",
      sales: "",
      status: ""
    });
    setFiltersOpen(false);
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumns = [
      { header: "ID", dataKey: "courseId" },
      { header: "Title", dataKey: "title" },
      { header: "Revenue", dataKey: "totalRevenue" },
      { header: "Avg Review", dataKey: "averageReviews" },
      { header: "Reviews", dataKey: "reviewCount" },
      { header: "Sales", dataKey: "totalSales" },
      { header: "Status", dataKey: "courseStatus" },
    ];
    
    let tableData = [];

    if (exportOption === "all") {
      tableData = sortedCourses.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        totalRevenue: course.totalRevenue.toLocaleString(),
        averageReviews: course.averageReviews.toFixed(1),
        reviewCount: course.reviewCount,
        totalSales: course.totalSales,
        courseStatus: course.courseStatus,
      }));
    } else {
      tableData = currentCourses.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        totalRevenue: course.totalRevenue.toLocaleString(),
        averageReviews: course.averageReviews.toFixed(1),
        reviewCount: course.reviewCount,
        totalSales: course.totalSales,
        courseStatus: course.courseStatus,
      }));
    }

    doc.autoTable({
      columns: tableColumns,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [33, 41, 60], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      margin: { top: 20 },
    });

    // Add title
    doc.setFontSize(16);
    doc.text("Course Sales Report", 14, 15);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("course_sales_report.pdf");
    setExportDropdownOpen(false);
  };

  const handleExportExcel = () => {
    const fileName = "course_sales_report.xlsx";
    const tableData =
      exportOption === "all"
        ? sortedCourses.map((course) => ({
            "Course ID": course.courseId,
            "Title": course.title,
            "Revenue": course.totalRevenue,
            "Average Review": course.averageReviews.toFixed(1),
            "Review Count": course.reviewCount,
            "Total Sales": course.totalSales,
            "Status": course.courseStatus,
            "Export Date": new Date().toLocaleDateString(),
          }))
        : currentCourses.map((course) => ({
            "Course ID": course.courseId,
            "Title": course.title,
            "Revenue": course.totalRevenue,
            "Average Review": course.averageReviews.toFixed(1),
            "Review Count": course.reviewCount,
            "Total Sales": course.totalSales,
            "Status": course.courseStatus,
            "Export Date": new Date().toLocaleDateString(),
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Course Sales");

    // Add some styling to the Excel file
    const cols = [
      { wch: 10 }, // Course ID
      { wch: 40 }, // Title
      { wch: 12 }, // Revenue
      { wch: 15 }, // Average Review
      { wch: 15 }, // Review Count
      { wch: 12 }, // Total Sales
      { wch: 10 }, // Status
      { wch: 15 }, // Export Date
    ];
    worksheet['!cols'] = cols;

    XLSX.writeFile(workbook, fileName);
    setExportDropdownOpen(false);
  };

  // Component for loading state
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4">
        <RefreshCcw size={40} className="text-blue-400 animate-spin" />
      </div>
      <h3 className="text-slate-300 text-lg font-medium">Loading course data...</h3>
      <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest information</p>
    </div>
  );

  // Component for error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 p-3 bg-red-500/20 rounded-full">
        <AlertCircle size={40} className="text-red-400" />
      </div>
      <h3 className="text-red-300 text-lg font-medium">Failed to load course data</h3>
      <p className="text-slate-400 text-sm mt-2 mb-4">{error}</p>
      <button
        onClick={() => fetchSalesData(true)}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <RefreshCcw size={16} /> Try Again
      </button>
    </div>
  );

  // Component for empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 p-3 bg-slate-800 rounded-full">
        <BookOpen size={40} className="text-slate-400" />
      </div>
      <h3 className="text-slate-300 text-lg font-medium">No courses found</h3>
      <p className="text-slate-400 text-sm mt-2 mb-4">
        {searchTerm 
          ? `No results matching "${searchTerm}"`
          : "Try adjusting your filters to see more results"}
      </p>
      <button
        onClick={resetFilters}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <RefreshCcw size={16} /> Reset Filters
      </button>
    </div>
  );

  // Pagination component
  const PaginationControls = () => {
    // Logic to determine which page buttons to show
    const getPageButtons = () => {
      const buttons = [];
      const maxButtonsToShow = 7; // Show at most 7 page buttons
      
      // If we have fewer pages than max buttons, show all
      if (totalPages <= maxButtonsToShow) {
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // Always include first page
        buttons.push(1);
        
        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);
        
        // Adjust if we're near the start
        if (currentPage <= 4) {
          endPage = Math.min(maxButtonsToShow - 1, totalPages - 1);
        }
        
        // Adjust if we're near the end
        if (currentPage > totalPages - 4) {
          startPage = Math.max(2, totalPages - maxButtonsToShow + 2);
        }
        
        // Add ellipsis after first page if needed
        if (startPage > 2) {
          buttons.push("ellipsis1");
        }
        
        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
          buttons.push(i);
        }
        
        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
          buttons.push("ellipsis2");
        }
        
        // Always include last page
        buttons.push(totalPages);
      }
      
      return buttons;
    };
    
    const pageButtons = getPageButtons();
    
    return (
      <div className="flex items-center justify-center mt-6 gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-slate-500 cursor-not-allowed"
              : "text-slate-300 hover:bg-slate-700"
          }`}
          title="First Page"
        >
          <ChevronLeft size={16} className="inline" />
          <ChevronLeft size={16} className="inline -ml-1" />
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "text-slate-500 cursor-not-allowed"
              : "text-slate-300 hover:bg-slate-700"
          }`}
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center px-2">
          {pageButtons.map((page, index) => (
            page === "ellipsis1" || page === "ellipsis2" ? (
              <span key={page} className="px-2 text-slate-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`min-w-[36px] h-9 px-2 mx-0.5 rounded-md flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-slate-500 cursor-not-allowed"
              : "text-slate-300 hover:bg-slate-700"
          }`}
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-slate-500 cursor-not-allowed"
              : "text-slate-300 hover:bg-slate-700"
          }`}
          title="Last Page"
        >
          <ChevronRight size={16} className="inline" />
          <ChevronRight size={16} className="inline -ml-1" />
        </button>
      </div>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      "Active": "bg-green-500/20 text-green-400 border-green-500/30",
      "Inactive": "bg-red-500/20 text-red-400 border-red-500/30",
      "Pending": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Draft": "bg-slate-500/20 text-slate-400 border-slate-500/30"
    };
    
    const badgeClass = colors[status] || colors["Draft"];
    
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
        {status}
      </span>
    );
  };

  return (
    <motion.div
      className="bg-slate-800/90 backdrop-blur-md shadow-xl rounded-xl border border-blue-900/30 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      {/* Header Area */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="text-blue-400" size={20} />
            Course Sales
          </h2>
          
          <div className="relative">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border border-slate-600"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                Object.values(advancedFilters).some(val => val !== "")
                ? "bg-blue-600/70 text-white hover:bg-blue-600"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Filter size={16} />
              {Object.values(advancedFilters).some(val => val !== "")
                ? "Filters Applied"
                : "Filters"}
            </button>
            
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Download size={16} />
                Export
                <ChevronDown size={14} className={`transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {exportDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 z-10 border border-slate-700">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-slate-400 border-b border-slate-700">
                      Export Options
                    </div>
                    
                    <div className="p-2">
                      <select
                        value={exportOption}
                        onChange={(e) => setExportOption(e.target.value)}
                        className="w-full bg-slate-700 text-slate-200 text-sm rounded-md py-1.5 px-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="currentPage">Current Page ({currentCourses.length} records)</option>
                        <option value="all">All Data ({filteredCourses.length} records)</option>
                      </select>
                    </div>
                    
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                      onClick={handleExportPDF}
                    >
                      <FileText size={16} className="mr-2 text-red-400" />
                      Export as PDF
                    </button>
                    
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet size={16} className="mr-2 text-green-400" />
                      Export as Excel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => fetchSalesData(true)}
              disabled={refreshing}
              className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCcw size={18} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters Dropdown */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Filter size={16} className="text-blue-400" />
                    Advanced Filters
                  </h3>
                  
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 py-1 px-2 bg-slate-700 rounded-md transition-colors"
                  >
                    <RefreshCcw size={12} />
                    Reset All Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Category</label>
                    <select
                      value={advancedFilters.category}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, category: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Revenue</label>
                    <select
                      value={advancedFilters.revenue}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, revenue: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">No Filter</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Reviews</label>
                    <select
                      value={advancedFilters.review}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, review: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">No Filter</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Sales</label>
                    <select
                      value={advancedFilters.sales}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, sales: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">No Filter</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Status</label>
                    <select
                      value={advancedFilters.status}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, status: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Table Body */}
      <div className="p-0">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : filteredCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-medium uppercase bg-slate-700 text-slate-300 tracking-wider">
                  <tr>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('courseId')}
                    >
                      <div className="flex items-center">
                        Course ID {getSortIcon('courseId')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('title')}
                    >
                      <div className="flex items-center">
                        <BookOpen size={14} className="mr-1.5" />
                        Title {getSortIcon('title')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('totalRevenue')}
                    >
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1.5" />
                        Revenue {getSortIcon('totalRevenue')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('averageReviews')}
                    >
                      <div className="flex items-center">
                        <Star size={14} className="mr-1.5" />
                        Avg. Review {getSortIcon('averageReviews')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('reviewCount')}
                    >
                      <div className="flex items-center">
                        Review Count {getSortIcon('reviewCount')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('totalSales')}
                    >
                      <div className="flex items-center">
                        <ShoppingCart size={14} className="mr-1.5" />
                        Sales {getSortIcon('totalSales')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('courseStatus')}
                    >
                      <div className="flex items-center">
                        <Activity size={14} className="mr-1.5" />
                        Status {getSortIcon('courseStatus')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentCourses.map((course) => (
                    <tr 
                      key={course.courseId} 
                      className="border-b border-slate-700 hover:bg-slate-700/40 transition-colors"
                    >
                      <td className="py-4 px-6 font-mono text-slate-400">
                        {course.courseId}
                      </td>
                      <td className="py-4 px-6 font-medium text-white">
                        {course.title}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                          maximumFractionDigits: 0
                        }).format(course.totalRevenue)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className="text-white font-medium">{course.averageReviews.toFixed(1)}</span>
                          <Star size={14} className="ml-1 text-yellow-400" />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {course.reviewCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {course.totalSales.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={course.courseStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Pagination */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/40">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-slate-400 mb-4 sm:mb-0">
                  Showing <span className="font-medium text-slate-300">{indexOfFirstCourse + 1}</span> to{" "}
                  <span className="font-medium text-slate-300">
                    {Math.min(indexOfLastCourse, filteredCourses.length)}
                  </span>{" "}
                  of <span className="font-medium text-slate-300">{filteredCourses.length}</span> courses
                </div>
                <PaginationControls />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Export Options at Bottom */}
      {!loading && !error && filteredCourses.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/70 flex justify-end">
          <div className="flex items-center gap-4">
            <select
              value={exportOption}
              onChange={(e) => setExportOption(e.target.value)}
              className="bg-slate-700 text-slate-200 text-sm rounded-lg py-2 px-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="currentPage">Export Current Page</option>
              <option value="all">Export All ({filteredCourses.length} records)</option>
            </select>

            <button
              onClick={handleExportPDF}
              className="bg-red-600/80 hover:bg-red-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              PDF
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-green-600/80 hover:bg-green-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SalesTable;