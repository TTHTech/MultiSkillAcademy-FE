import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Download, FileText, RefreshCcw, Filter, ChevronDown, ChevronLeft, 
  ChevronRight, X, AlertCircle, FileSpreadsheet, MessageSquare, Star as StarIcon,
  Calendar, BookOpen, User, ListFilter, SortAsc, SortDesc, ChevronsDown, ChevronsUp
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ReviewTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8; // Changed to 8 for better spacing
  const [totalPages, setTotalPages] = useState(1);

  // Advanced filters with state management
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    course: "",
    rating: "",
    dateRange: "all" // all, thisWeek, thisMonth, last3Months
  });
  
  // Sorting management
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  const [expandedComments, setExpandedComments] = useState({});
  const [courses, setCourses] = useState([]);
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
  const sortedReviews = useMemo(() => {
    let sortableItems = [...filteredReviews];
    
    if (sortConfig.key && sortConfig.direction) {
      sortableItems.sort((a, b) => {
        // Special handling for dates
        if (sortConfig.key === 'createdAt') {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'asc' 
            ? dateA - dateB 
            : dateB - dateA;
        }
        
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
  }, [filteredReviews, sortConfig]);

  // Toggle comment expansion
  const toggleCommentExpansion = (id) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Fetch review data
  const fetchReviewData = async (showRefreshing = false) => {
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

      const response = await fetch("http://localhost:8080/api/admin/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add cache busting
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error("Failed to fetch review data.");
      }

      const data = await response.json();

      // Add a short delay to ensure loading state is visible
      setTimeout(() => {
        setReviews(data);
        setFilteredReviews(data);

        const totalPages = Math.ceil(data.length / reviewsPerPage);
        setTotalPages(totalPages);
        
        setLoading(false);
        setRefreshing(false);
      }, 600);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching review data:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch course data
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login again.");
      }

      const response = await fetch("http://localhost:8080/api/admin/courses/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch course data.");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    fetchReviewData();
    fetchCourses();
  }, []);

  // Apply all filters
  useEffect(() => {
    let filtered = [...reviews];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (review) =>
          review.username.toLowerCase().includes(term) ||
          review.courseTitle.toLowerCase().includes(term) ||
          review.comment.toLowerCase().includes(term) ||
          review.instructorName.toLowerCase().includes(term)
      );
    }
    
    // Course filter
    if (advancedFilters.course) {
      filtered = filtered.filter((review) => review.courseTitle === advancedFilters.course);
    }

    // Rating filter
    if (advancedFilters.rating) {
      filtered = filtered.filter((review) => review.rating === parseInt(advancedFilters.rating, 10));
    }
    
    // Date range filter
    if (advancedFilters.dateRange !== 'all') {
      const now = new Date();
      let compareDate;
      
      switch(advancedFilters.dateRange) {
        case 'thisWeek':
          compareDate = new Date(now);
          compareDate.setDate(now.getDate() - 7);
          break;
        case 'thisMonth':
          compareDate = new Date(now);
          compareDate.setMonth(now.getMonth() - 1);
          break;
        case 'last3Months':
          compareDate = new Date(now);
          compareDate.setMonth(now.getMonth() - 3);
          break;
        default:
          compareDate = null;
      }
      
      if (compareDate) {
        filtered = filtered.filter(review => {
          const reviewDate = new Date(review.createdAt);
          return reviewDate >= compareDate;
        });
      }
    }

    setFilteredReviews(filtered);
    setTotalPages(Math.ceil(filtered.length / reviewsPerPage));
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, reviews, advancedFilters]);

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
      course: "",
      rating: "",
      dateRange: "all"
    });
    setFiltersOpen(false);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumns = [
      { header: "Username", dataKey: "username" },
      { header: "Course", dataKey: "courseTitle" },
      { header: "Rating", dataKey: "rating" },
      { header: "Comment", dataKey: "comment" },
      { header: "Date", dataKey: "createdAt" },
      { header: "Instructor", dataKey: "instructorName" }
    ];
    
    let tableData = [];

    if (exportOption === "all") {
      tableData = sortedReviews.map((review) => ({
        username: review.username,
        courseTitle: review.courseTitle,
        rating: `${review.rating}/5`,
        comment: review.comment,
        createdAt: new Date(review.createdAt).toLocaleDateString(),
        instructorName: review.instructorName,
      }));
    } else {
      tableData = currentReviews.map((review) => ({
        username: review.username,
        courseTitle: review.courseTitle,
        rating: `${review.rating}/5`,
        comment: review.comment,
        createdAt: new Date(review.createdAt).toLocaleDateString(),
        instructorName: review.instructorName,
      }));
    }

    doc.autoTable({
      columns: tableColumns,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [33, 41, 60], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [244, 246, 249] },
      margin: { top: 20 },
      columnStyles: {
        comment: { cellWidth: 50 }
      },
      styles: { overflow: 'linebreak', cellPadding: 4 },
    });

    // Add title
    doc.setFontSize(16);
    doc.text("Course Reviews Report", 14, 15);

    // Add export date
    doc.setFontSize(10);
    doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("course_reviews_report.pdf");
    setExportDropdownOpen(false);
  };

  const handleExportExcel = () => {
    const fileName = "course_reviews_report.xlsx";
    const tableData =
      exportOption === "all"
        ? sortedReviews.map((review) => ({
            "Username": review.username,
            "Course": review.courseTitle,
            "Rating": review.rating,
            "Comment": review.comment,
            "Date": new Date(review.createdAt).toLocaleDateString(),
            "Instructor": review.instructorName,
            "Export Date": new Date().toLocaleDateString(),
          }))
        : currentReviews.map((review) => ({
            "Username": review.username,
            "Course": review.courseTitle,
            "Rating": review.rating,
            "Comment": review.comment,
            "Date": new Date(review.createdAt).toLocaleDateString(),
            "Instructor": review.instructorName,
            "Export Date": new Date().toLocaleDateString(),
          }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Course Reviews");

    // Add some styling to the Excel file
    const cols = [
      { wch: 20 }, // Username
      { wch: 30 }, // Course
      { wch: 10 }, // Rating
      { wch: 60 }, // Comment
      { wch: 15 }, // Date
      { wch: 20 }, // Instructor
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
      <h3 className="text-slate-300 text-lg font-medium">Loading review data...</h3>
      <p className="text-slate-400 text-sm mt-2">Please wait while we fetch the latest information</p>
    </div>
  );

  // Component for error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 p-3 bg-red-500/20 rounded-full">
        <AlertCircle size={40} className="text-red-400" />
      </div>
      <h3 className="text-red-300 text-lg font-medium">Failed to load review data</h3>
      <p className="text-slate-400 text-sm mt-2 mb-4">{error}</p>
      <button
        onClick={() => fetchReviewData(true)}
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
        <MessageSquare size={40} className="text-slate-400" />
      </div>
      <h3 className="text-slate-300 text-lg font-medium">No reviews found</h3>
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

  // Star Rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}
          />
        ))}
        <span className="ml-2 text-white font-medium">{rating}/5</span>
      </div>
    );
  };
  
  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

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
            <MessageSquare className="text-blue-400" size={20} />
            Course Reviews
          </h2>
          
          <div className="relative">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search reviews..."
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
                        <option value="currentPage">Current Page ({currentReviews.length} records)</option>
                        <option value="all">All Data ({filteredReviews.length} records)</option>
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
              onClick={() => fetchReviewData(true)}
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
                    Review Filters
                  </h3>
                  
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 py-1 px-2 bg-slate-700 rounded-md transition-colors"
                  >
                    <RefreshCcw size={12} />
                    Reset All Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Course</label>
                    <select
                      value={advancedFilters.course}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, course: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.title}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 text-sm text-slate-400">Rating</label>
                    <select
                      value={advancedFilters.rating}
                      onChange={(e) => setAdvancedFilters({...advancedFilters, rating: e.target.value})}
                      className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                    >
                      <option value="">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
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
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
                      <option value="last3Months">Last 3 Months</option>
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
        ) : filteredReviews.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs font-medium uppercase bg-slate-700 text-slate-300 tracking-wider">
                  <tr>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('username')}
                    >
                      <div className="flex items-center">
                        <User size={14} className="mr-1.5" />
                        Username {getSortIcon('username')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('comment')}
                    >
                      <div className="flex items-center">
                        <MessageSquare size={14} className="mr-1.5" />
                        Comment {getSortIcon('comment')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('rating')}
                    >
                      <div className="flex items-center">
                        <StarIcon size={14} className="mr-1.5" />
                        Rating {getSortIcon('rating')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('createdAt')}
                    >
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5" />
                        Date {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('courseTitle')}
                    >
                      <div className="flex items-center">
                        <BookOpen size={14} className="mr-1.5" />
                        Course {getSortIcon('courseTitle')}
                      </div>
                    </th>
                    <th 
                      className="py-3.5 px-6 cursor-pointer hover:bg-slate-600 transition-colors"
                      onClick={() => requestSort('instructorName')}
                    >
                      <div className="flex items-center">
                        <User size={14} className="mr-1.5" />
                        Instructor {getSortIcon('instructorName')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviews.map((review, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-slate-700 hover:bg-slate-700/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="py-4 px-6 font-medium text-white">
                        {review.username}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {review.comment && review.comment.length > 100 ? (
                          <div>
                            {expandedComments[idx] 
                              ? review.comment
                              : `${review.comment.substring(0, 100)}...`
                            }
                            <button
                              onClick={() => toggleCommentExpansion(idx)}
                              className="ml-2 text-blue-400 hover:text-blue-300 text-xs font-medium"
                            >
                              {expandedComments[idx] ? (
                                <span className="flex items-center gap-1">
                                  <ChevronsUp size={14} /> Show Less
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <ChevronsDown size={14} /> Show More
                                </span>
                              )}
                            </button>
                          </div>
                        ) : (
                          review.comment
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        <div className="max-w-[200px] truncate" title={review.courseTitle}>
                          {review.courseTitle}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {review.instructorName}
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
                  Showing <span className="font-medium text-slate-300">{indexOfFirstReview + 1}</span> to{" "}
                  <span className="font-medium text-slate-300">
                    {Math.min(indexOfLastReview, filteredReviews.length)}
                  </span>{" "}
                  of <span className="font-medium text-slate-300">{filteredReviews.length}</span> reviews
                </div>
                <PaginationControls />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Export Options at Bottom */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/70 flex justify-end">
          <div className="flex items-center gap-4">
            <select
              value={exportOption}
              onChange={(e) => setExportOption(e.target.value)}
              className="bg-slate-700 text-slate-200 text-sm rounded-lg py-2 px-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="currentPage">Export Current Page</option>
              <option value="all">Export All ({filteredReviews.length} records)</option>
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

export default ReviewTable;