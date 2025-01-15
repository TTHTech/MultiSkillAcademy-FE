import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Settings, 
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Mail,
  Inbox
} from "lucide-react";
import { toast } from 'react-toastify';

// ============= NotificationHeader Component =============
const NotificationHeader = ({ notificationCount, showFilters, setShowFilters }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <Bell className="w-6 h-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">Admin Notifications</h2>
          <p className="text-sm text-gray-400 mt-1">
            Total {notificationCount} notifications
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Filter className="w-5 h-5 text-gray-400 hover:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-400 hover:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

// ============= NotificationStats Component =============
const NotificationStats = ({ stats, activeFilter, setActiveFilter }) => {
  return (
    <div className="flex items-center justify-between">
      {stats.map((stat, index) => (
        <button
          key={index}
          onClick={() => setActiveFilter(stat.label.toLowerCase())}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeFilter === stat.label.toLowerCase()
              ? 'bg-blue-500/10 text-blue-400'
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <stat.icon className="w-4 h-4" />
          <span>{stat.label}</span>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
            {stat.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// ============= NotificationItem Component =============
const NotificationItem = ({ title, message, time, type, priority, isRead }) => {
  const getIcon = () => {
    switch (type) {
      case 'message':
        return <Mail className="w-5 h-5 text-blue-400" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-purple-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <div className={`p-4 rounded-lg transition-colors ${
      isRead ? 'bg-transparent' : 'bg-blue-500/5'
    } hover:bg-white/5`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="text-sm text-gray-400 mt-1">{message}</p>
          <p className="text-xs text-gray-500 mt-2">{time}</p>
        </div>
      </div>
    </div>
  );
};

// ============= Pagination Component =============
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
      <div className="flex items-center">
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 1 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === totalPages 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:bg-white/5'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// ============= Main NotificationList Component =============
const ITEMS_PER_PAGE = 5;

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [activeFilter]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://localhost:8080/api/admin/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
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

  const transformNotification = (notification) => ({
    title: notification.title,
    message: notification.message,
    time: formatTime(notification.createdAt),
    type: getNotificationType(notification.targetType),
    priority: 'normal',
    isRead: true
  });

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
  };

  const getNotificationType = (targetType) => {
    switch (targetType) {
      case 'STUDENT':
        return 'message';
      case 'INSTRUCTOR':
        return 'system';
      case 'ALL':
        return 'reminder';
      default:
        return 'default';
    }
  };

  const stats = [
    { label: 'All', count: notifications.length, icon: Inbox },
    { label: 'Students', count: notifications.filter(n => n.targetType === 'STUDENT').length, icon: Mail },
    { label: 'Instructors', count: notifications.filter(n => n.targetType === 'INSTRUCTOR').length, icon: AlertCircle }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'students') return notification.targetType === 'STUDENT';
    if (activeFilter === 'instructors') return notification.targetType === 'INSTRUCTOR';
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return <div className="text-center text-gray-400 p-8">Loading notifications...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 p-8">{error}</div>;
  }

  return (
    <div className="bg-[#1E2432] rounded-lg shadow-2xl">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-700">
        <NotificationHeader 
          notificationCount={notifications.length}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <NotificationStats 
          stats={stats}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      {/* Notifications Container */}
      <div className="divide-y divide-gray-700/50">
        {paginatedNotifications.length > 0 ? (
          <div className="p-6 space-y-4">
            {paginatedNotifications.map((notification, index) => (
              <NotificationItem
                key={notification.id || index}
                {...transformNotification(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Inbox className="w-12 h-12 text-gray-600" />
              <p className="text-gray-400">No notifications found</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default NotificationList;