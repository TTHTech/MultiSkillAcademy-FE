import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  Inbox,
  X,
  Search,
  RefreshCw,
  Calendar,
  MessageSquare,
  AlertTriangle,
  AlertCircle,
  Users
} from "lucide-react";
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

// ============= NotificationHeader Component =============
const NotificationHeader = ({ notificationCount, showFilters, setShowFilters, searchTerm, setSearchTerm, onRefresh }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-purple-500" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Thông báo quản trị viên</h2>
            <p className="text-sm text-gray-400 mt-1">
              {notificationCount > 0 ? `Tổng ${notificationCount} thông báo` : 'Không có thông báo'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-[#252a3b] rounded-lg transition-colors duration-200"
            title="Làm mới"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-gray-300" />
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 ${showFilters ? 'bg-purple-900/40 text-purple-400' : 'hover:bg-[#252a3b] text-gray-400 hover:text-gray-300'} rounded-lg transition-colors duration-200`}
            title="Bộ lọc"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm thông báo..."
          className="w-full h-10 pl-10 pr-10 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5"
          >
            <X className="w-5 h-5 text-gray-500 hover:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============= NotificationFilters Component =============
const NotificationFilters = ({ showFilters, dateRange, setDateRange }) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="p-4 bg-[#252a3b] border border-gray-700 rounded-lg mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Bộ lọc nâng cao</h3>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Khoảng thời gian</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                    className="w-full h-9 pl-8 bg-[#1E2432] border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Calendar className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
                </div>
                <span className="text-gray-400 flex items-center">—</span>
                <div className="relative flex-1">
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                    className="w-full h-9 pl-8 bg-[#1E2432] border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <Calendar className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDateRange({ from: '', to: '' })}
                className="px-4 py-2 text-xs text-gray-300 border border-gray-700 rounded-lg hover:bg-[#1E2432] transition-colors duration-200"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============= NotificationStats Component =============
const NotificationStats = ({ stats, activeFilter, setActiveFilter }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {stats.map((stat, index) => (
        <button
          key={index}
          onClick={() => setActiveFilter(stat.id)}
          className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
            activeFilter === stat.id
              ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 text-white border border-purple-700/50'
              : 'bg-[#252a3b] text-gray-400 hover:bg-[#2a3044] border border-transparent'
          }`}
        >
          <stat.icon className={`w-4 h-4 ${activeFilter === stat.id ? 'text-purple-400' : ''}`} />
          <span className="text-sm">{stat.label}</span>
          <span className={`min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-xs ${
            activeFilter === stat.id 
            ? 'bg-purple-500/30 text-purple-300' 
            : 'bg-[#1E2432] text-gray-400'
          }`}>
            {stat.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// ============= NotificationItem Component =============
const NotificationItem = ({
  id,
  title,
  message,
  time,
  targetType,
  onDelete
}) => {
  const getTypeIcon = () => {
    switch (targetType) {
      case 'STUDENT':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'INSTRUCTOR':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'ALL':
        return <Bell className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-300" />;
    }
  };

  const getPriorityColor = () => {
    switch (targetType) {
      case 'STUDENT':
        return 'border-l-blue-500';
      case 'INSTRUCTOR':
        return 'border-l-amber-500';
      case 'ALL':
        return 'border-l-purple-500';
      default:
        return 'border-l-transparent';
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case 'STUDENT':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
            Học viên
          </span>
        );
      case 'INSTRUCTOR':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full">
            Giảng viên
          </span>
        );
      case 'ALL':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full">
            Tất cả
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-[#1E2432]/80 
        hover:bg-[#252a3b] 
        rounded-lg border-l-4 ${getPriorityColor()}
        p-4 mb-3 transition-all duration-200
      `}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-medium text-white truncate">
                {title}
              </h4>
              {getTargetLabel()}
            </div>
            <button 
              onClick={() => onDelete(id)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Xóa thông báo"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
          </div>

          <p className="mt-1 text-sm text-gray-300 line-clamp-2">{message}</p>

          <div className="mt-3 flex items-center">
            <span className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              {time}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============= DeleteConfirmModal Component =============
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting = false, title = "Xác nhận xóa" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1E2432] rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6">
          Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-lg hover:bg-[#252a3b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============= Pagination Component =============
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const pageNumbers = [];
  
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-700">
      <div className="text-sm text-gray-400 mb-4 sm:mb-0">
        Hiển thị <span className="font-medium text-gray-300">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong <span className="font-medium text-gray-300">{totalItems}</span> thông báo
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 1 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-[#252a3b]'
          }`}
          title="Trang đầu"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 1 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-[#252a3b]'
          }`}
          title="Trang trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              currentPage === number 
                ? 'bg-purple-700 text-white' 
                : 'text-gray-400 hover:bg-[#252a3b]'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === totalPages 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-[#252a3b]'
          }`}
          title="Trang sau"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === totalPages 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-[#252a3b]'
          }`}
          title="Trang cuối"
        >
          <ChevronRight className="w-4 h-4 mr-1" />
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============= EmptyState Component =============
const EmptyState = ({ filterActive, onClearFilter }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-[#252a3b] rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-300 mb-2">Không tìm thấy thông báo</h3>
      {filterActive ? (
        <>
          <p className="text-gray-400 text-center max-w-md mb-4">
            Không có thông báo nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc của bạn để tìm kiếm thêm kết quả.
          </p>
          <button
            onClick={onClearFilter}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </>
      ) : (
        <p className="text-gray-400 text-center max-w-md">
          Bạn chưa có thông báo nào. Các thông báo mới sẽ xuất hiện ở đây khi được tạo.
        </p>
      )}
    </div>
  );
};

// ============= LoadingSpinner Component =============
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p className="text-gray-400">Đang tải thông báo...</p>
    </div>
  );
};

// ============= ErrorState Component =============
const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-red-400 mb-2">Lỗi tải dữ liệu</h3>
      <p className="text-gray-400 text-center max-w-md mb-4">
        {error || "Đã xảy ra lỗi khi tải thông báo. Vui lòng thử lại sau."}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
};

// ============= Main NotificationList Component =============
const ITEMS_PER_PAGE = 5;

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // Delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm, dateRange]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }

      const response = await fetch(`${baseUrl}/api/admin/notifications`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Không thể tải thông báo");
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error(err.message);
    }
  };

  const handleRefresh = () => {
    fetchNotifications();
    toast.success("Đã làm mới danh sách thông báo");
  };

  const handleDeleteNotification = async (id) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseUrl}/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể xóa thông báo");
      }

      // Chỉ xóa khỏi state khi API thành công
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      toast.success("Đã xóa thông báo thành công");
      setDeleteModal({ isOpen: false, id: null });
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast.error(err.message || "Có lỗi xảy ra khi xóa thông báo");
      setDeleteModal({ isOpen: false, id: null });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (dateInput) => {
    let date;
    if (Array.isArray(dateInput)) {
      const [
        year = 1970,
        month = 1,
        day = 1,
        hour = 0,
        minute = 0,
        second = 0,
        nanoseconds = 0,
      ] = dateInput;
        const ms = Math.floor(nanoseconds / 1e6);
        date = new Date(year, month - 1, day, hour, minute, second, ms);
    } else {
      date = new Date(dateInput);
    }
  
    if (isNaN(date)) {
      return "—";
    }
  
    const now = new Date();
    const diffMs = now - date;
    const diffInMinutes = Math.floor(diffMs / (1000 * 60));
  
    if (diffInMinutes < 1) {
      return "vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      const h = Math.floor(diffInMinutes / 60);
      return `${h} giờ trước`;
    } else {
      const d = Math.floor(diffInMinutes / 1440);
      return `${d} ngày trước`;
    }
  };

  const handleClearFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
    setShowFilters(false);
  };

  // Build stats for the stats component
  const stats = [
    { id: 'all', label: 'Tất cả', count: notifications.length, icon: Inbox },
    { id: 'students', label: 'Học viên', count: notifications.filter(n => n.targetType === 'STUDENT').length, icon: Users },
    { id: 'instructors', label: 'Giảng viên', count: notifications.filter(n => n.targetType === 'INSTRUCTOR').length, icon: AlertCircle }
  ];

  // Apply all filters
  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      // Filter by category (all, students, instructors)
      if (activeFilter === 'students' && notification.targetType !== 'STUDENT') return false;
      if (activeFilter === 'instructors' && notification.targetType !== 'INSTRUCTOR') return false;
      
      // Filter by search term
      if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        const notificationDate = new Date(notification.createdAt);
        if (notificationDate < fromDate) return false;
      }
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of the day
        const notificationDate = new Date(notification.createdAt);
        if (notificationDate > toDate) return false;
      }
      
      return true;
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Check if any filters are active
  const isFilterActive = searchTerm || dateRange.from || dateRange.to || activeFilter !== 'all';

  // Render loading state
  if (loading) {
    return (
      <div className="bg-[#1E2432] rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
          </div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-[#1E2432] rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <NotificationHeader 
            notificationCount={0}
            showFilters={false}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handleRefresh}
          />
        </div>
        <ErrorState error={error} onRetry={fetchNotifications} />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1E2432] rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700">
          <NotificationHeader 
            notificationCount={notifications.length}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handleRefresh}
          />
          <NotificationStats 
            stats={stats}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <NotificationFilters 
            showFilters={showFilters}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </div>

        {/* Notifications Container */}
        <div className="divide-y divide-gray-700/30">
          {paginatedNotifications.length > 0 ? (
            <div className="p-6 space-y-1">
              {paginatedNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  message={notification.message}
                  time={formatTime(notification.createdAt)}
                  targetType={notification.targetType}
                  onDelete={(id) => setDeleteModal({ isOpen: true, id })}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              filterActive={isFilterActive} 
              onClearFilter={handleClearFilters} 
            />
          )}
        </div>

        {/* Pagination */}
        {filteredNotifications.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredNotifications.length}
          />
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => handleDeleteNotification(deleteModal.id)}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default NotificationList;