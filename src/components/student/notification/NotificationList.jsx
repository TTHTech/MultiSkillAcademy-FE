import React from "react";
import { Link } from "react-router-dom";

const NotificationList = ({ isOpen }) => {
  if (!isOpen) return null;

  // Dữ liệu mẫu thông báo
  const mockNotifications = [
    {
      id: 1,
      message: "Khóa học A đã được cập nhật.",
      time: "2 giờ trước",
      isRead: false
    },
    {
      id: 2,
      message: "Bạn có bài tập mới cần hoàn thành.",
      time: "3 giờ trước",
      isRead: true
    },
    {
      id: 3, 
      message: "Thông báo hệ thống: Bảo trì lúc 10:00 AM.",
      time: "5 giờ trước",
      isRead: false
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <i className="fas fa-bell text-blue-500"></i>
          <h3 className="text-gray-700 font-medium text-sm">Thông báo</h3>
        </div>
        <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">
          Đánh dấu đã đọc
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
        {mockNotifications.map((notification) => (
          <Link
            to="/notification"
            key={notification.id}
            className="block hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors duration-200"
          >
            <div className="px-4 py-3 flex items-start gap-3 relative">
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
              {!notification.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-100">
        <Link 
          to="/notifications"
          className="block text-center text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
};

export default NotificationList;