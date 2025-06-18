import React, { useState } from "react";
import Swal from "sweetalert2";
import { 
  Trash2, Star, StarHalf, User, Book, MessageSquare, Calendar, 
  Search, Filter, ChevronDown, ChevronUp, AlertTriangle
} from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const TableReview = ({ reviews, onDeleteReview, triggerRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle delete action
  const handleDelete = async (review) => {
    const token = localStorage.getItem("token");
    
    const result = await Swal.fire({
      title: "Xác nhận xóa bình luận",
      html: `Bạn có chắc chắn muốn xóa bình luận của <b>${review.username}</b> với nội dung:<br><br><i>"${review.comment}"</i>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa bình luận",
      cancelButtonText: "Hủy bỏ",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      reverseButtons: true,
      focusCancel: true
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        
        const response = await fetch(
          `${baseUrl}/api/admin/reviews/${review.reviewId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Error deleting review");
        }
        
        onDeleteReview(review.reviewId);
        
        Swal.fire({
          title: "Xóa thành công!",
          text: "Bình luận đã được xóa thành công.",
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        
        triggerRefresh();
      } catch (error) {
        console.error("Delete error:", error);
        
        Swal.fire({
          title: "Lỗi!",
          text: "Có lỗi xảy ra khi xóa bình luận.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Render stars for rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-400 fill-yellow-400" />);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={16} className="text-yellow-400 fill-yellow-400" />);
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-400" />);
    }
    
    return (
      <div className="flex items-center gap-0.5">
        {stars}
        <span className="ml-1 text-sm font-medium text-white">{rating}</span>
      </div>
    );
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (review.username && review.username.toLowerCase().includes(searchLower)) ||
        (review.comment && review.comment.toLowerCase().includes(searchLower)) ||
        (review.courseTitle && review.courseTitle.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        comparison = (a[sortField] || '').localeCompare(b[sortField] || '');
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Render column header with sort functionality
  const renderColumnHeader = (field, label, icon) => {
    const isSorted = sortField === field;
    
    return (
      <th 
        className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider cursor-pointer"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center space-x-1">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span>{label}</span>
          <div className="flex flex-col ml-1">
            <ChevronUp 
              size={12} 
              className={`-mb-1 ${isSorted && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}`}
            />
            <ChevronDown 
              size={12} 
              className={isSorted && sortDirection === 'desc' ? 'text-blue-400' : 'text-gray-500'}
            />
          </div>
        </div>
      </th>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Search and filter header */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          
         
        </div>
        
       
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {renderColumnHeader("username", "Người dùng", <User size={14} />)}
              {renderColumnHeader("comment", "Bình luận", <MessageSquare size={14} />)}
              {renderColumnHeader("courseTitle", "Khóa học", <Book size={14} />)}
              {renderColumnHeader("rating", "Đánh giá")}
              {renderColumnHeader("createdAt", "Ngày tạo", <Calendar size={14} />)}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {currentItems.length > 0 ? (
              currentItems.map((review, index) => (
                <tr 
                  key={`${review.id || review.username}-${index}`}
                  className={`
                    ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} 
                    hover:bg-gray-700 transition-colors duration-150
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-3 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {review.username ? review.username.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {review.username}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-300 line-clamp-2">
                      {review.comment}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Book size={14} className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-200">
                        {review.courseTitle}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderRating(review.rating)}
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {formatDate(review.createdAt)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => !isLoading && handleDelete(review)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Delete review"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : searchTerm ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <AlertTriangle size={40} className="mb-2" />
                    <p className="text-lg font-medium">Không tìm thấy bình luận nào phù hợp</p>
                    <p className="mt-1">Vui lòng thử tìm kiếm với từ khóa khác</p>
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={40} className="mb-2" />
                    <p className="text-lg font-medium">Chưa có bình luận nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredReviews.length > itemsPerPage && (
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredReviews.length)}
                </span>{" "}
                trong tổng số <span className="font-medium">{filteredReviews.length}</span> bình luận
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`
                      relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${currentPage === i + 1
                        ? 'z-10 bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-700'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReview;