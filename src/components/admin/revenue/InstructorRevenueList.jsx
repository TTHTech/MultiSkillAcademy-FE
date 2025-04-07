import React from "react";
import { Search, ChevronDown, ChevronUp, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

const InstructorRevenueList = ({
  instructorRevenues,
  currentPage,
  totalPages,
  itemCount,
  searchTerm,
  sortField,
  sortDirection,
  selectedYear,
  onSearch,
  onSort,
  onYearChange,
  onPageChange,
  onInstructorSelect
}) => {
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

  // Handle search input
  const handleSearchInput = (e) => {
    onSearch(e.target.value);
  };

  // Handle year change
  const handleYearChange = (e) => {
    onYearChange(parseInt(e.target.value));
  };

  // Create pagination numbers
  const getPaginationItems = () => {
    if (instructorRevenues.length === 0) {
      return <span className="text-gray-400 font-medium">Không có dữ liệu</span>;
    }
    
    const pages = [];
    
    // Logic xử lý phân trang được cải tiến
    if (totalPages <= 7) {
      // Hiển thị tất cả các trang nếu ít hơn 7 trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
              currentPage === i 
                ? "bg-blue-600 text-white font-semibold shadow-md" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </button>
        );
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === 1 
              ? "bg-blue-600 text-white font-semibold shadow-md" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          aria-current={currentPage === 1 ? "page" : undefined}
        >
          1
        </button>
      );

      // Xác định khoảng trang để hiển thị
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }

      // Thêm dấu ... nếu cần
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        );
      }

      // Thêm các trang giữa
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                currentPage === i 
                  ? "bg-blue-600 text-white font-semibold shadow-md" 
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              aria-current={currentPage === i ? "page" : undefined}
            >
              {i}
            </button>
          );
        }
      }

      // Thêm dấu ... cuối nếu cần
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="w-10 h-10 flex items-center justify-center text-gray-400">
            ...
          </span>
        );
      }

      // Luôn hiển thị trang cuối
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === totalPages 
              ? "bg-blue-600 text-white font-semibold shadow-md" 
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
          aria-current={currentPage === totalPages ? "page" : undefined}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Search and filter bar */}
      <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="relative flex items-center w-1/2 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all"
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-gray-300 font-medium">Năm:</span>
          <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="bg-gray-700 text-white rounded-lg p-2.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>
      
      {/* Data table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-900 text-gray-200 tracking-wider">
              <tr>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-gray-800 transition-colors" 
                  onClick={() => onSort("instructorId")}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    {sortField === "instructorId" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-gray-800 transition-colors" 
                  onClick={() => onSort("instructorLastName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Họ tên</span>
                    {sortField === "instructorLastName" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-gray-800 transition-colors" 
                  onClick={() => onSort("totalRevenue")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tổng doanh thu</span>
                    {sortField === "totalRevenue" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-gray-800 transition-colors" 
                  onClick={() => onSort("instructorShare")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Phần chia GV</span>
                    {sortField === "instructorShare" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-4 px-5 cursor-pointer hover:bg-gray-800 transition-colors" 
                  onClick={() => onSort("effectiveSharePercentage")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tỷ lệ hiệu quả</span>
                    {sortField === "effectiveSharePercentage" && (
                      sortDirection === "asc" 
                        ? <ChevronUp size={14} className="text-blue-400" /> 
                        : <ChevronDown size={14} className="text-blue-400" />
                    )}
                  </div>
                </th>
                <th className="py-4 px-5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {instructorRevenues.length > 0 ? (
                instructorRevenues.map((revenue, index) => (
                  <tr 
                    key={revenue.id || `revenue-${index}`} 
                    className="bg-gray-800 hover:bg-gray-750 transition-colors"
                  >
                    <td className="py-4 px-5 font-medium text-gray-200">{revenue.instructorId || 'N/A'}</td>
                    <td className="py-4 px-5 text-white font-medium">{revenue.instructorFirstName} {revenue.instructorLastName}</td>
                    <td className="py-4 px-5 text-green-400 font-semibold">{formatCurrency(revenue.totalRevenue)}</td>
                    <td className="py-4 px-5 text-blue-300">{formatCurrency(revenue.instructorShare)}</td>
                    <td className="py-4 px-5 text-yellow-300 font-medium">{formatPercent(revenue.effectiveSharePercentage || 0)}</td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => onInstructorSelect(revenue.instructorId)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium text-sm shadow-sm"
                        title="Xem chi tiết"
                      >
                        <ExternalLink size={16} className="mr-1.5" />
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search size={24} className="text-gray-500" />
                      <p>Không tìm thấy dữ liệu doanh thu.</p>
                      <p className="text-sm">Kiểm tra lại các bộ lọc hoặc tải lại trang.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Enhanced Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
        <div className="flex space-x-2">
          <button
            className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <ChevronLeft size={18} className="mr-1" />
            Trước
          </button>

          <button
            className="flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages || totalPages === 0}
          >
            Tiếp
            <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        <div className="flex items-center space-x-1 justify-center">
          {getPaginationItems()}
        </div>

        <div className="text-gray-300 font-medium text-sm">
          {itemCount > 0 ? (
            <div className="flex flex-col sm:flex-row sm:space-x-4 items-center">
              <span>{itemCount} phần tử</span>
              <span className="hidden sm:inline">|</span>
              <span>Trang {currentPage} / {totalPages}</span>
            </div>
          ) : (
            <span>Không có dữ liệu</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorRevenueList;