import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, FileText, RefreshCcw, Filter, ChevronDown, ChevronLeft, 
  ChevronRight, Users, Calendar, Briefcase, DollarSign, ListFilter, AlertCircle, 
  FileSpreadsheet, X, SortAsc, SortDesc
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const SalesInstructorTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const instructorsPerPage = 8; // Changed to 8 for better spacing
  const [totalPages, setTotalPages] = useState(1);

  // Advanced filters
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    revenue: "",
    students: "",
    courses: "",
    dateRange: "all" // all, lastMonth, last3Months, last6Months, thisYear
  });
  
  const [exportOption, setExportOption] = useState("currentPage");
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
  const sortedInstructors = useMemo(() => {
    let sortableItems = [...filteredInstructors];
    
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
  }, [filteredInstructors, sortConfig]);

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

      const response = await fetch(
        "http://localhost:8080/api/admin/instructor-sales",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Add cache busting to ensure fresh data
          cache: 'no-cache'
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch instructor sales data.");
      }

      const data = await response.json();

      // Short timeout to ensure user sees the loading state
      setTimeout(() => {
        setInstructors(data);
        setFilteredInstructors(data);
        
        const totalPages = Math.ceil(data.length / instructorsPerPage);
        setTotalPages(totalPages);
        
        setLoading(false);
        setRefreshing(false);
      }, 600);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching instructor sales data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Apply all filters
  useEffect(() => {
    let filtered = [...instructors];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (instructor) =>
          instructor.firstName.toLowerCase().includes(term) ||
          instructor.lastName.toLowerCase().includes(term)
      );
    }
    
    // Date range filter
    if (advancedFilters.dateRange !== 'all') {
      const now = new Date();
      let compareDate;
      
      switch(advancedFilters.dateRange) {
        case 'lastMonth':
          compareDate = new Date();
          compareDate.setMonth(now.getMonth() - 1);
          break;
        case 'last3Months':
          compareDate = new Date();
          compareDate.setMonth(now.getMonth() - 3);
          break;
        case 'last6Months':
          compareDate = new Date();
          compareDate.setMonth(now.getMonth() - 6);
          break;
        case 'thisYear':
          compareDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          compareDate = null;
      }
      
      if (compareDate) {
        // In a real app, you would filter based on actual dates in your data
        // This is a placeholder that simulates that filtering
        filtered = filtered.filter(instructor => {
          // Simulating that newer instructors have higher IDs
          return instructor.id > 0; 
        });
      }
    }
    
    // Revenue filter
    if (advancedFilters.revenue) {
      filtered = advancedFilters.revenue === "low"
        ? filtered.sort((a, b) => a.totalRevenue - b.totalRevenue)
        : filtered.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    // Student filter
    if (advancedFilters.students) {
      filtered = advancedFilters.students === "low"
        ? filtered.sort((a, b) => a.studentCount - b.studentCount)
        : filtered.sort((a, b) => b.studentCount - a.studentCount);
    }
    
    // Course filter
    if (advancedFilters.courses) {
      filtered = advancedFilters.courses === "low"
        ? filtered.sort((a, b) => a.courseCount - b.courseCount)
        : filtered.sort((a, b) => b.courseCount - a.courseCount);
    }

    setFilteredInstructors(filtered);
    setTotalPages(Math.ceil(filtered.length / instructorsPerPage));
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, instructors, advancedFilters]);

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
      revenue: "",
      students: "",
      courses: "",
      dateRange: "all"
    });
    setFiltersOpen(false);
  };

  const indexOfLastInstructor = currentPage * instructorsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - instructorsPerPage;
  const currentInstructors = sortedInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumns = [
      { header: "Last Name", dataKey: "lastName" },
      { header: "First Name", dataKey: "firstName" },
      { header: "Students", dataKey: "studentCount" },
      { header: "Courses", dataKey: "courseCount" },
      { header: "Revenue", dataKey: "totalRevenue" },
      { header: "Revenue/Course", dataKey: "revenuePerCourse" }
    ];
    
    let tableData = [];

    if (exportOption === "all") {
      tableData = sortedInstructors.map((instructor) => ({
        lastName: instructor.lastName,
        firstName: instructor.firstName,
        studentCount: instructor.studentCount,
        courseCount: instructor.courseCount,
        totalRevenue: instructor.totalRevenue.toFixed(2),
        revenuePerCourse: instructor.revenuePerCourse.toFixed(2),
      }));
    } else {
      tableData = currentInstructors.map((instructor) => ({
        lastName: instructor.lastName,
        firstName: instructor.firstName,
        studentCount: instructor.studentCount,
        courseCount: instructor.courseCount,
        totalRevenue: instructor.totalRevenue.toFixed(2),
        revenuePerCourse: instructor.revenuePerCourse.toFixed(2),
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
    doc.text("Instructor Sales Report", 14, 15);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("instructor_sales_report.pdf");
    setExportDropdownOpen(false);
  };

  const handleExportExcel = () => {
    const fileName = "instructor_sales_report.xlsx";
    const tableData =
      exportOption === "all"
        ? sortedInstructors.map((instructor) => ({
            "Last Name": instructor.lastName,
            "First Name": instructor.firstName,
            "Students": instructor.studentCount,
            "Courses": instructor.courseCount,
            "Revenue": instructor.totalRevenue.toFixed(2),
            "Revenue/Course": instructor.revenuePerCourse.toFixed(2),
            "Export Date": new Date().toLocaleDateString(),
          }))
        : currentInstructors.map((instructor) => ({
            "Last Name": instructor.lastName,
            "First Name": instructor.firstName,
            "Students": instructor.studentCount,
            "Courses": instructor.courseCount,
            "Revenue": instructor.totalRevenue.toFixed(2),
            "Revenue/Course": instructor.revenuePerCourse.toFixed(2),
            "Export Date": new Date().toLocaleDateString(),
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Instructor Sales");

    // Add some styling to the Excel file
    const cols = [
      { wch: 15 }, // Last Name
      { wch: 15 }, // First Name
      { wch: 10 }, // Students
      { wch: 10 }, // Courses
      { wch: 12 }, // Revenue
      { wch: 15 }, // Revenue/Course
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
      <h3 className="text-slate-300 text-lg font-medium">Loading instructor data...</h3>
      <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest information</p>
    </div>
  );

  // Component for error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 p-3 bg-red-500/20 rounded-full">
        <AlertCircle size={40} className="text-red-400" />
      </div>
      <h3 className="text-red-300 text-lg font-medium">Failed to load instructor data</h3>
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
        <Users size={40} className="text-slate-400" />
      </div>
      <h3 className="text-slate-300 text-lg font-medium">No instructors found</h3>
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
            <Users className="text-blue-400" size={20} />
            Instructor Sales
          </h2>
          
          <div className="relative">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search instructors..."
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
                Object.values(advancedFilters).some(val => val !== "" && val !== "all")
                ? "bg-blue-600/70 text-white hover:bg-blue-600"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <Filter size={16} />
              {Object.values(advancedFilters).some(val => val !== "" && val !== "all")
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
                        <option value="currentPage">Current Page ({currentInstructors.length} records)</option>
                        <option value="all">All Data ({filteredInstructors.length} records)</option>
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <label className="block mb-1 text-sm text-slate-400">Students</label>
                    <select
                      value={advancedFilters.students}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, students: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">No Filter</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Courses</label>
                    <select
                      value={advancedFilters.courses}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, courses: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">No Filter</option>
                      <option value="low">Low to High</option>
                      <option value="high">High to Low</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Date Range</label>
                    <select
                      value={advancedFilters.dateRange}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, dateRange: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="all">All Time</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="last3Months">Last 3 Months</option>
                      <option value="last6Months">Last 6 Months</option>
                      <option value="thisYear">This Year</option>
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
        ) : filteredInstructors.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-medium uppercase bg-slate-700 text-slate-300 tracking-wider">
                  <tr>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('lastName')}
                    >
                      <div className="flex items-center">
                        Last Name {getSortIcon('lastName')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('firstName')}
                    >
                      <div className="flex items-center">
                        First Name {getSortIcon('firstName')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('studentCount')}
                    >
                      <div className="flex items-center">
                        <Users size={14} className="mr-1.5" />
                        Students {getSortIcon('studentCount')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('courseCount')}
                    >
                      <div className="flex items-center">
                        <Briefcase size={14} className="mr-1.5" />
                        Courses {getSortIcon('courseCount')}
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
                      onClick={() => requestSort('revenuePerCourse')}
                    >
                      <div className="flex items-center">
                        Revenue/Course {getSortIcon('revenuePerCourse')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentInstructors.map((instructor, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-slate-700 hover:bg-slate-700/40 transition-colors ${
                        index % 2 === 0 ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-white">
                        {instructor.lastName}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {instructor.firstName}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {instructor.studentCount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {instructor.courseCount}
                      </td>
                      <td className="py-4 px-6 font-medium text-white">
                        ${instructor.totalRevenue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        ${instructor.revenuePerCourse.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
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
                  Showing <span className="font-medium text-slate-300">{indexOfFirstInstructor + 1}</span> to{" "}
                  <span className="font-medium text-slate-300">
                    {Math.min(indexOfLastInstructor, filteredInstructors.length)}
                  </span>{" "}
                  of <span className="font-medium text-slate-300">{filteredInstructors.length}</span> instructors
                </div>
                <PaginationControls />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SalesInstructorTable;