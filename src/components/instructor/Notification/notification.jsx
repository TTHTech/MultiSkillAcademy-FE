import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronRight, Bell, BellOff, Check } from "lucide-react";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const AllNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 8;

  const fetchNotifications = async (pageToFetch = 1) => {
    try {
      setError(null);
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Thiếu thông tin xác thực");

      const { data } = await axios.get(
        `${baseUrl}/api/instructor/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: pageToFetch - 1, size },
        }
      );

      const items = Array.isArray(data) ? data : data.items || [];
      const total = data.totalItems ?? data.total ?? items.length;
      setNotifications(items);
      setTotalPages(Math.ceil(total / size));
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
      setError("Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/instructor/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Đã đánh dấu thông báo là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu thông báo đã đọc");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/instructor/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc");
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

  const renderNotificationItems = () => {
    if (notifications.length === 0 && !isLoading) {
      return (
        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 px-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 my-6 mx-auto w-full max-w-3xl">
          <div className="bg-gray-100 p-6 rounded-full mb-5 shadow-inner">
            <BellOff className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            Không có thông báo nào
          </h3>
          <p className="text-gray-500 text-center text-lg w-full max-w-xl">
            Bạn chưa nhận được thông báo nào. Khi có thông báo mới, chúng sẽ
            xuất hiện tại đây.
          </p>
        </div>
      );
    }

    return notifications.map((n) => (
      <div
        key={n.id}
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div
              className={`p-2 rounded-full mr-3 ${
                n.read ? "bg-gray-100" : "bg-blue-50"
              }`}
            >
              <Bell
                className={`h-5 w-5 ${
                  n.read ? "text-gray-400" : "text-blue-500"
                }`}
              />
            </div>
            {!n.read && (
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute -mt-1 ml-8"></span>
            )}
          </div>

          {n.sender?.role === "ROLE_ADMIN" && (
            <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded-md">
              Admin
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3
            className={`text-lg leading-snug ${
              n.read ? "text-gray-500" : "text-gray-900 font-semibold"
            }`}
          >
            {n.title || "Thông báo"}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all duration-150">
            {n.message}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span
            className="text-xs text-gray-400 flex items-center"
            title={new Date(n.createdAt).toLocaleString()}
          >
            <span className="mr-1 w-1 h-1 rounded-full bg-gray-300"></span>
            {formatTime(n.createdAt)}
          </span>

          {!n.read && (
            <button
              onClick={() => handleMarkAsRead(n.id)}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-full transition-colors duration-150 flex items-center"
              title="Đánh dấu đã đọc"
            >
              <Check className="h-3 w-3 mr-1" />
              Đánh dấu đã đọc
            </button>
          )}
        </div>
      </div>
    ));
  };

  const renderLoadingSkeletons = () => {
    return Array.from({ length: size }).map((_, idx) => (
      <div
        key={`skeleton-${idx}`}
        className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 ml-3"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex justify-between mt-4 pt-3">
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              Tất cả thông báo
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý tất cả thông báo của bạn tại một nơi
            </p>
          </div>
          <button
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
            onClick={handleMarkAllAsRead}
            disabled={
              isLoading ||
              notifications.length === 0 ||
              notifications.every((n) => n.read)
            }
          >
            <Check className="h-4 w-4 mr-2" />
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? renderLoadingSkeletons() : renderNotificationItems()}
        </div>

        {/* Only show pagination if more than one page */}
        {totalPages > 1 && !isLoading && notifications.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm font-medium text-gray-700 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Trước
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              // Show limited pagination numbers with ellipsis
              if (
                totalPages <= 7 ||
                idx === 0 ||
                idx === totalPages - 1 ||
                (idx >= page - 2 && idx <= page + 0)
              ) {
                return (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`min-w-[36px] h-9 rounded-md text-sm font-medium ${
                      page === idx + 1
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              } else if (
                (idx === 1 && page > 3) ||
                (idx === totalPages - 2 && page < totalPages - 2)
              ) {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-gray-500 flex items-center justify-center"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm font-medium text-gray-700 flex items-center"
            >
              Sau
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotificationsPage;
