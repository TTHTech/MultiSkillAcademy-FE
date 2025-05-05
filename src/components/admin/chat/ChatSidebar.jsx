import React, { useState, useEffect, useCallback } from "react";
import { Search, MoreHorizontal, Edit, Filter, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatSidebar = ({ onUserSelect }) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchModalTerm, setSearchModalTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [searchFilter, setSearchFilter] = useState("ALL");
  const [activeUserId, setActiveUserId] = useState(null);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [avatars, setAvatars] = useState({});

  // Fetch user avatar
  const fetchUserAvatar = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      const response = await fetch(`${baseUrl}/api/admin/chat/users/${userId}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Không thể tải ảnh cho người dùng ${userId}`);
        return null;
      }
      
      const data = await response.json();
      return data.avatarUrl;
    } catch (err) {
      console.error(`Error fetching avatar for user ${userId}:`, err);
      return null;
    }
  }, []);

  // Fetch avatars for all users
  const fetchAvatarsForUsers = useCallback(async (users) => {
    const newAvatars = {...avatars};
    
    for (const user of users) {
      if (!avatars[user.userId]) {
        const avatarUrl = await fetchUserAvatar(user.userId);
        if (avatarUrl) {
          newAvatars[user.userId] = avatarUrl;
        }
      }
    }
    
    setAvatars(newAvatars);
  }, [avatars, fetchUserAvatar]);

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

      const response = await fetch(`${baseUrl}/api/admin/chat/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
      }
      
      const data = await response.json();
      setChatUsers(data);
      
      // Fetch avatars for users
      fetchAvatarsForUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // API tìm kiếm người dùng mới
  const searchAllUsers = async (keyword = "", role = "ALL") => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      // Chuẩn bị URL với các tham số tìm kiếm
      const url = new URL(`${baseUrl}/api/admin/chat/search-users`);
      if (keyword) url.searchParams.append("keyword", keyword);
      if (role && role !== "ALL") url.searchParams.append("role", role);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm người dùng");
      }
      
      const data = await response.json();
      setSearchUsers(data);
      
      // Fetch avatars for search results
      fetchAvatarsForUsers(data);
    } catch (err) {
      console.error("Error searching users:", err);
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      setActiveUserId(user.userId);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/one-to-one/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Nếu không tìm thấy chat, tự động tạo mới
        if (response.status === 404) {
          await createNewChat(user.userId);
          return;
        }
        throw new Error("Không thể tải cuộc trò chuyện");
      }

      const chatData = await response.json();
      onUserSelect({ user, chat: chatData });
      setShowUserSearchModal(false);

    } catch (err) {
      console.error("Error selecting user:", err);
      toast.error(err.message);
    }
  };
  
  // Tạo chat mới
  const createNewChat = async (recipientId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");
      
      const chatRequest = {
        chatType: "INDIVIDUAL",
        recipientId: recipientId,
        initialMessage: "Xin chào! Tôi là Admin."
      };
      
      const response = await fetch(`${baseUrl}/api/admin/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(chatRequest)
      });
      
      if (!response.ok) {
        throw new Error("Không thể tạo cuộc trò chuyện mới");
      }
      
      const chatData = await response.json();
      
      // Tìm thông tin người dùng từ danh sách tìm kiếm
      const user = searchUsers.find(user => user.userId === recipientId);
      
      if (user) {
        onUserSelect({ user, chat: chatData });
        // Reload danh sách chat sau khi tạo chat mới
        fetchChatUsers();
      } else {
        throw new Error("Không tìm thấy thông tin người dùng");
      }
      
    } catch (err) {
      console.error("Error creating new chat:", err);
      toast.error(err.message);
    }
  };
  
  // Xử lý khi người dùng mở modal tìm kiếm
  const handleOpenUserSearch = () => {
    setShowUserSearchModal(true);
    setSearchModalTerm("");
    setSearchFilter("ALL");
    searchAllUsers("", "ALL");  // Tìm kiếm ban đầu không có điều kiện
  };

  // Xử lý khi người dùng thay đổi từ khóa tìm kiếm trong modal
  const handleSearchTermChange = (term) => {
    setSearchModalTerm(term);
    searchAllUsers(term, searchFilter);
  };

  // Xử lý khi người dùng thay đổi bộ lọc trong modal
  const handleSearchFilterChange = (filterValue) => {
    setSearchFilter(filterValue);
    searchAllUsers(searchModalTerm, filterValue);
  };

  // Lọc danh sách chat hiện tại
  const getFilteredUsers = () => {
    return chatUsers.filter((user) => {
      const searchMatch =
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filter === "ALL") return searchMatch;
      
      const userRole = user.role.replace("ROLE_", "");
      return searchMatch && userRole === filter;
    });
  };

  // Tạo Avatar fallback với chữ cái đầu
  const AvatarFallback = ({ user }) => {
    const firstLetter = user.firstName ? user.firstName.charAt(0).toUpperCase() : "?";
    const bgColors = {
      ROLE_STUDENT: "bg-blue-500",
      ROLE_INSTRUCTOR: "bg-purple-500",
      ADMIN: "bg-red-500"
    };
    const bgColor = bgColors[user.role] || "bg-gray-500";
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center ${bgColor} text-white font-bold text-xl`}>
        {firstLetter}
      </div>
    );
  };

  // Hiển thị vai trò người dùng
  const displayRole = (role) => {
    if (role === "ROLE_STUDENT") return "Học viên";
    if (role === "ROLE_INSTRUCTOR") return "Giảng viên";
    if (role === "ADMIN") return "Quản trị viên";
    return role;
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
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={handleOpenUserSearch}
            title="Tạo chat mới"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>
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
            Giảng viên
          </button>
          <button
            onClick={() => setFilter("STUDENT")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "STUDENT"
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            Học viên
          </button>
        </div>
      </div>

      {/* User Search Modal */}
      {showUserSearchModal && (
        <div className="absolute left-0 top-0 w-[360px] h-screen bg-white z-10 border-r overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-bold">Tìm kiếm người dùng</h3>
            <button 
              onClick={() => setShowUserSearchModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              &times;
            </button>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchModalTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                placeholder="Tìm kiếm người dùng"
                className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleSearchFilterChange("ALL")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  searchFilter === "ALL"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Tất cả
              </button>
             
              <button
                onClick={() => handleSearchFilterChange("ROLE_INSTRUCTOR")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  searchFilter === "ROLE_INSTRUCTOR"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Giảng viên
              </button>
              <button
                onClick={() => handleSearchFilterChange("ROLE_STUDENT")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  searchFilter === "ROLE_STUDENT"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Học viên
              </button>
            </div>
            
            {searchLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            ) : searchUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Không tìm thấy người dùng nào
              </div>
            ) : (
              searchUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative flex-shrink-0 w-12 h-12">
                    {avatars[user.userId] || user.avatar ? (
                      <img
                        src={avatars[user.userId] || user.avatar}
                        alt={user.firstName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback user={user} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate text-gray-900">
                      {`${user.firstName || ""} ${user.lastName || ""}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {displayRole(user.role)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

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
              <div className="relative flex-shrink-0 w-14 h-14">
                {avatars[user.userId] || user.avatar ? (
                  <img
                    src={avatars[user.userId] || user.avatar}
                    alt={user.firstName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback user={user} />
                )}
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
                      {displayRole(user.role)}
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