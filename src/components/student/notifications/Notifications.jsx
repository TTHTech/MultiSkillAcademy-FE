import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";

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

      const { data } = await axios.get(`${baseUrl}/api/student/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageToFetch - 1, size },
      });

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
        `${baseUrl}/api/student/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Không thể đánh dấu thông báo đã đọc");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/student/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
  const renderSlots = () =>
    Array.from({ length: size }).map((_, idx) => {
      if (isLoading) {
        return (
          <div
            key={idx}
            className="h-24 bg-gray-100 animate-pulse rounded-lg"
          ></div>
        );
      }
      if (idx < notifications.length) {
        const n = notifications[idx];
        return (
          <div
            key={n.id}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col justify-between group"
          >
            {n.sender?.role === "ROLE_ADMIN" && (
              <span className="absolute top-4 right-4 bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                Admin
              </span>
            )}

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

            <div className="flex items-center justify-between mt-4">
              <span
                className="text-xs text-gray-400"
                title={new Date(n.createdAt).toLocaleString()}
              >
                {formatTime(n.createdAt)}
              </span>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors duration-150"
                  title="Đánh dấu đã đọc"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      }
      return <div key={`empty-${idx}`} className="p-4 h-24 invisible"></div>;
    });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <a
          href="/student/home"
          className="hover:text-blue-600 transition-colors duration-200 mt-[50px]"
        >
          Trang chủ
        </a>
        <ChevronRight className="w-4 h-4 mt-[50px]" />
        <span className="text-gray-700 font-medium mt-[50px]">Thông báo</span>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Tất cả thông báo
        </h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          onClick={handleMarkAllAsRead}
          disabled={notifications.every((n) => n.read)}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSlots()}
      </div>

      {/* Only show pagination if more than one page */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default AllNotificationsPage;
