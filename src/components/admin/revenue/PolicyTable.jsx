import React from "react";
import { Edit, Trash, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

const PolicyTable = ({ 
  policies, 
  sortField, 
  sortDirection, 
  onSort, 
  onEdit, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  policyCount
}) => {
  // Derived values with safety checks
  const currentPolicies = policies && Array.isArray(policies) ? policies : [];
  
  // Function to render pagination buttons
  const renderPaginationButtons = () => {
    if (currentPolicies.length === 0) {
      return <span className="text-gray-400">Không có dữ liệu</span>;
    }
    
    const pages = [];
    
    if (totalPages <= 7) {
      // Hiển thị tất cả các trang nếu tổng số trang <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1.5 mx-1 rounded-md transition-colors duration-200 ${
              currentPage === i 
                ? "bg-indigo-600 text-white font-medium shadow-sm" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-3 py-1.5 mx-1 rounded-md transition-colors duration-200 ${
            currentPage === 1 
              ? "bg-indigo-600 text-white font-medium shadow-sm" 
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          1
        </button>
      );
      
      // Calculate range to display
      let startPage, endPage;
      if (currentPage <= 4) {
        startPage = 2;
        endPage = 5;
      } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - 4;
        endPage = totalPages - 1;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
      
      // Add first ellipsis if needed
      if (startPage > 2) {
        pages.push(<span key="dots-start" className="px-2 py-1.5 mx-1 text-gray-400">...</span>);
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1.5 mx-1 rounded-md transition-colors duration-200 ${
              currentPage === i 
                ? "bg-indigo-600 text-white font-medium shadow-sm" 
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {i}
          </button>
        );
      }
      
      // Add last ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots-end" className="px-2 py-1.5 mx-1 text-gray-400">...</span>);
      }
      
      // Always show last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1.5 mx-1 rounded-md transition-colors duration-200 ${
            currentPage === totalPages 
              ? "bg-indigo-600 text-white font-medium shadow-sm" 
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden shadow-lg">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          Danh sách chính sách
        </h3>
        <div className="text-sm text-gray-400">
          {policyCount > 0 ? (
            <span className="flex items-center">
              <span className="bg-gray-700 px-2 py-1 rounded-md mr-2">{policyCount}</span>
              chính sách
            </span>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-800 text-gray-400 tracking-wider">
            <tr>
              <th 
                className="py-3.5 px-6 cursor-pointer hover:text-white transition-colors duration-200" 
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">
                  <span>ID</span>
                  {sortField === "id" ? (
                    sortDirection === "asc" 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1 opacity-40" />
                  )}
                </div>
              </th>
              <th 
                className="py-3.5 px-6 cursor-pointer hover:text-white transition-colors duration-200" 
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  <span>Tên chính sách</span>
                  {sortField === "name" ? (
                    sortDirection === "asc" 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-6">
                <div className="flex items-center">
                  <span>Tỷ lệ giảng viên</span>
                </div>
              </th>
              <th className="py-3.5 px-6">
                <div className="flex items-center">
                  <span>Tỷ lệ nền tảng</span>
                </div>
              </th>
              <th 
                className="py-3.5 px-6 cursor-pointer hover:text-white transition-colors duration-200" 
                onClick={() => onSort("active")}
              >
                <div className="flex items-center">
                  <span>Trạng thái</span>
                  {sortField === "active" ? (
                    sortDirection === "asc" 
                      ? <ChevronUp size={16} className="ml-1" /> 
                      : <ChevronDown size={16} className="ml-1" />
                  ) : (
                    <ChevronDown size={16} className="ml-1 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-6">
                <div className="flex items-center">
                  <span>Thao tác</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {currentPolicies.length > 0 ? (
              currentPolicies.map((policy, index) => (
                <tr 
                  key={policy.id || `policy-${Math.random()}`} 
                  className={`hover:bg-gray-700 transition-colors duration-150 ${index % 2 === 0 ? 'bg-gray-800 bg-opacity-40' : ''}`}
                >
                  <td className="py-4 px-6 font-mono">{policy.id || 'N/A'}</td>
                  <td className="py-4 px-6 font-medium text-white">{policy.name || 'Chưa đặt tên'}</td>
                  <td className="py-4 px-6">
                    {policy.instructorReferredRate?.default 
                      ? <span className="font-semibold text-emerald-400">{(policy.instructorReferredRate.default * 100).toFixed(1)}%</span>
                      : <span className="text-gray-500 italic">N/A</span>}
                  </td>
                  <td className="py-4 px-6">
                    {policy.platformReferredRate 
                      ? <span className="font-semibold text-sky-400">{(policy.platformReferredRate["50000000-infinity"] * 100).toFixed(1)}%</span>
                      : <span className="text-gray-500 italic">N/A</span>}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        policy.active
                          ? "bg-emerald-500 bg-opacity-20 text-emerald-400 border border-emerald-500"
                          : "bg-gray-600 bg-opacity-20 text-gray-400 border border-gray-600"
                      }`}
                    >
                      {policy.active ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(policy)}
                        className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 p-1 rounded-md hover:bg-indigo-900 hover:bg-opacity-20"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(policy)}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-md hover:bg-red-900 hover:bg-opacity-20"
                        title="Xóa"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle size={40} className="text-gray-600 mb-3" />
                    <span className="text-lg">Không tìm thấy chính sách nào</span>
                    <span className="text-sm text-gray-500 mt-1">Tạo mới để bắt đầu</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Luôn hiển thị */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-1 justify-start">
            <button
              className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-900 bg-opacity-30 text-indigo-400 border border-indigo-800 hover:bg-opacity-40 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Trước
            </button>
          </div>

          <div className="flex items-center justify-center flex-wrap">
            {renderPaginationButtons()}
          </div>

          <div className="flex flex-1 justify-end">
            <button
              className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-900 bg-opacity-30 text-indigo-400 border border-indigo-800 hover:bg-opacity-40 disabled:opacity-50 disabled:pointer-events-none transition-colors duration-200"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
            >
              Tiếp
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyTable;