import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationList = ({ isOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy thông báo từ API khi dropdown được mở
  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("Thiếu thông tin xác thực");
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/student/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        setError("Không thể tải thông báo");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  // Đánh dấu thông báo đã đọc
  const handleMarkAsRead = async (id, event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của Link
    event.stopPropagation(); // Ngăn chặn sự kiện lan truyền
    
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `http://localhost:8080/api/student/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật trạng thái trong state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const unreadNotifications = notifications.filter(n => !n.read);
      
      if (unreadNotifications.length === 0) {
        return;
      }
      
      // Gọi API để đánh dấu từng thông báo đã đọc
      await Promise.all(
        unreadNotifications.map(notification => 
          axios.post(
            `http://localhost:8080/api/student/notifications/${notification.id}/read`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      // Cập nhật trạng thái tất cả thông báo là đã đọc
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  };

  // Định dạng thời gian
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    
    const date = new Date(dateTimeString);
    const now = new Date();
    
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <i className="fas fa-bell text-blue-500"></i>
          <h3 className="text-gray-700 font-medium text-sm">Thông báo</h3>
        </div>
        <button 
          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
          onClick={handleMarkAllAsRead}
        >
          Đánh dấu đã đọc
        </button>
      </div>

      {/* Trạng thái loading */}
      {isLoading && (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Trạng thái lỗi */}
      {error && !isLoading && (
        <div className="py-6 px-4 text-center text-gray-500">
          <p>{error}</p>
        </div>
      )}

      {/* Trạng thái không có thông báo */}
      {!isLoading && !error && notifications.length === 0 && (
        <div className="py-6 px-4 text-center text-gray-500">
          <p>Không có thông báo nào</p>
        </div>
      )}

      {/* Danh sách thông báo */}
      {!isLoading && !error && notifications.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
          {notifications.map((notification) => (
            <Link
              to={`/student/notifications/${notification.id}`}
              key={notification.id}
              className="block hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors duration-200"
            >
              <div className="px-4 py-3 flex items-start gap-3 relative">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                    {notification.title || "Thông báo"}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                    className="absolute top-3 right-3 w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                    title="Đánh dấu đã đọc"
                  >
                    <i className="fas fa-check text-xs text-blue-600"></i>
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <Link
          to="/student/notifications"
          className="block text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};

export default NotificationList;