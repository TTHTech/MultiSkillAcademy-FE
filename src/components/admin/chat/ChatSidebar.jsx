import React, { useState, useEffect } from "react";
import { Search, MoreHorizontal, Edit, Filter } from "lucide-react";
import { toast } from "react-toastify";

const ChatSidebar = ({ onUserSelect }) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [activeUserId, setActiveUserId] = useState(null);

  // Fetch chat users on component mount
  useEffect(() => {
    fetchChatUsers();
  }, []);

  const fetchChatUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      const response = await fetch("http://localhost:8080/api/admin/chat/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
      }
      
      const data = await response.json();
      setChatUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      setActiveUserId(user.userId);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `http://localhost:8080/api/admin/chat/one-to-one/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải cuộc trò chuyện");
      }

      const chatData = await response.json();
      onUserSelect({ user, chat: chatData });

    } catch (err) {
      console.error("Error selecting user:", err);
      toast.error(err.message);
    }
};

  const getFilteredUsers = () => {
    return chatUsers.filter((user) => {
      const searchMatch =
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "ALL") return searchMatch;
      return searchMatch && user.role === filter;
    });
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="w-[360px] bg-white border-r flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm trên Messenger"
            className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "ALL"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("INSTRUCTOR")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "INSTRUCTOR"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Instructor
          </button>
          <button
            onClick={() => setFilter("STUDENT")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "STUDENT"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Student
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Không có người dùng nào</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.userId}
              className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                activeUserId === user.userId ? "bg-gray-100" : ""
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain"}
                  alt={user.firstName}
                  className="w-14 h-14 rounded-full"
                />
                <span
                  className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    user.isOnline ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold truncate text-gray-900">
                    {`${user.firstName || ""} ${user.lastName || ""}`}
                  </h3>
                  {user.lastMessageTime && (
                    <span className="text-xs text-gray-500">
                      {new Date(user.lastMessageTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500">
                      {user.role === "INSTRUCTOR" ? "Giảng viên" : "Học viên"}
                    </p>
                    {user.lastMessageContent && (
                      <p className="text-sm text-gray-500 truncate">
                        {user.lastMessageContent}
                      </p>
                    )}
                  </div>
                  {user.unreadCount > 0 && (
                    <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;