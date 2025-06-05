import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, MoreHorizontal, Edit, Filter, UserPlus, Users, MessageSquare, X, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatSidebar = ({ onUserSelect, refreshTrigger }) => {
  const [chatList, setChatList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [activeChatId, setActiveChatId] = useState(null);
  const [showUserSearchModal, setShowUserSearchModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [avatars, setAvatars] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  // Group chat creation state
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [groupCreationStep, setGroupCreationStep] = useState(1);
  const [participantFilter, setParticipantFilter] = useState("ALL");

  const avatarsRef = useRef({});
  const fetchingAvatarsRef = useRef(new Set());

  // Get current user ID on mount
  useEffect(() => {
    const userId = parseInt(localStorage.getItem("userId"));
    if (userId) {
      setCurrentUserId(userId);
      console.log("Current user ID set to:", userId);
    }
  }, []);

  // Fetch user avatar
  const fetchUserAvatar = useCallback(async (userId) => {
    try {
      if (fetchingAvatarsRef.current.has(userId) || avatarsRef.current[userId]) {
        return avatarsRef.current[userId] || null;
      }

      fetchingAvatarsRef.current.add(userId);

      const token = localStorage.getItem("token");
      if (!token) {
        fetchingAvatarsRef.current.delete(userId);
        return null;
      }

      const response = await fetch(`${baseUrl}/api/instructor/chat/users/${userId}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Cannot load avatar for user ${userId}`);
        fetchingAvatarsRef.current.delete(userId);
        return null;
      }
      
      const data = await response.json();
      const avatarUrl = data.avatarUrl;
      
      if (avatarUrl) {
        avatarsRef.current[userId] = avatarUrl;
        setAvatars(prev => ({
          ...prev,
          [userId]: avatarUrl
        }));
      }

      fetchingAvatarsRef.current.delete(userId);
      return avatarUrl;
    } catch (err) {
      console.error(`Error fetching avatar for user ${userId}:`, err);
      fetchingAvatarsRef.current.delete(userId);
      return null;
    }
  }, []);

  // Fetch avatars for participants
  const fetchAvatarsForParticipants = useCallback(async (participants) => {
    if (!participants || participants.length === 0) return;
    
    const participantsNeedingAvatars = participants.filter(p => 
      p.userId && !avatarsRef.current[p.userId] && !fetchingAvatarsRef.current.has(p.userId)
    );
    
    if (participantsNeedingAvatars.length === 0) return;

    const avatarPromises = participantsNeedingAvatars.map(p => 
      fetchUserAvatar(p.userId)
    );
    
    try {
      await Promise.all(avatarPromises);
    } catch (error) {
      console.error("Error fetching multiple avatars:", error);
    }
  }, [fetchUserAvatar]);

  // Fetch all chats
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      console.log("Fetching all chats...");
      const response = await fetch(`${baseUrl}/api/instructor/chat`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách trò chuyện");
      }
      
      const data = await response.json();
      console.log("Fetched chats:", data.length);
      setChatList(data);
      
      // Fetch avatars for all participants
      const allParticipants = data.flatMap(chat => chat.participants || []);
      fetchAvatarsForParticipants(allParticipants);
    } catch (err) {
      console.error("Error fetching chats:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAvatarsForParticipants]);

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Vui lòng đăng nhập lại");
      }

      const response = await fetch(`${baseUrl}/api/instructor/chat/search/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
      }
      
      const data = await response.json();
      setAllUsers(data);
      fetchAvatarsForParticipants(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    console.log("ChatSidebar useEffect triggered, refreshTrigger:", refreshTrigger);
    fetchChats();
    fetchAllUsers();
  }, [refreshTrigger, fetchChats]);

  // Handle chat selection
  const handleChatSelect = async (chat) => {
    try {
      setActiveChatId(chat.chatId);
      
      // Get full chat details
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(`${baseUrl}/api/instructor/chat/${chat.chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải chi tiết trò chuyện");
      }

      const chatData = await response.json();
      console.log("Chat details loaded:", chatData);
      
      // For individual chat, find the correct user to pass
      let selectedUser = null;
      if (chat.chatType === 'INDIVIDUAL') {
        const userId = getCurrentUserId();
        selectedUser = chatData.participants?.find(p => p.userId !== userId);
      }
      
      onUserSelect({ 
        user: selectedUser,
        chat: chatData,
        isGroup: chat.chatType === 'GROUP'
      });

    } catch (err) {
      console.error("Error selecting chat:", err);
      toast.error(err.message);
    }
  };

  // Create individual chat
  const createIndividualChat = async (user) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");
      
      const request = {
        participantId: user.userId,
        initialMessage: "Xin chào! Đây là Giảng viên."
      };
      
      console.log("Creating individual chat with:", request);
      const response = await fetch(`${baseUrl}/api/instructor/chat/create/individual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create chat error:", errorText);
        throw new Error("Không thể tạo cuộc trò chuyện");
      }
      
      const chatData = await response.json();
      console.log("New individual chat created:", chatData.chatId);
      
      onUserSelect({ 
        user,
        chat: chatData,
        isGroup: false
      });
      
      setShowUserSearchModal(false);
      toast.success("Tạo cuộc trò chuyện thành công!");
      
      // Refresh chat list
      setTimeout(() => {
        fetchChats();
      }, 1000);
      
    } catch (err) {
      console.error("Error creating chat:", err);
      toast.error(err.message);
    }
  };

  // Create group chat
  const createGroupChat = async () => {
    try {
      if (!groupName.trim()) {
        toast.error("Vui lòng nhập tên nhóm");
        return;
      }
      
      if (selectedParticipants.length < 2) {
        toast.error("Nhóm cần ít nhất 2 thành viên");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");
      
      const request = {
        groupName: groupName.trim(),
        participantIds: selectedParticipants.map(p => p.userId),
        initialMessage: `Chào mừng mọi người! Nhóm "${groupName}" đã được tạo bởi Giảng viên.`
      };
      
      console.log("Creating group chat:", request);
      const response = await fetch(`${baseUrl}/api/instructor/chat/create/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create group chat error:", errorText);
        throw new Error("Không thể tạo nhóm chat");
      }
      
      const chatData = await response.json();
      console.log("New group chat created:", chatData.chatId);
      
      // Reset group creation state
      setGroupName("");
      setSelectedParticipants([]);
      setGroupCreationStep(1);
      setShowCreateGroupModal(false);
      setParticipantFilter("ALL");
      
      // Select the new group chat
      onUserSelect({ 
        chat: chatData,
        isGroup: true
      });
      
      toast.success("Tạo nhóm chat thành công!");
      
      // Refresh chat list
      setTimeout(() => {
        fetchChats();
      }, 1000);
      
    } catch (err) {
      console.error("Error creating group chat:", err);
      toast.error(err.message);
    }
  };

  // Toggle participant selection
  const toggleParticipantSelection = (user) => {
    setSelectedParticipants(prev => {
      const isSelected = prev.some(p => p.userId === user.userId);
      if (isSelected) {
        return prev.filter(p => p.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  };

  // Filter chats based on search term and type
  const getFilteredChats = () => {
    return chatList.filter((chat) => {
      // Type filter
      if (filter !== "ALL") {
        if (filter === "GROUP" && chat.chatType !== "GROUP") return false;
        if (filter === "INDIVIDUAL" && chat.chatType !== "INDIVIDUAL") return false;
      }

      // Search filter
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      if (chat.chatType === 'GROUP' && chat.groupName) {
        if (chat.groupName.toLowerCase().includes(searchLower)) {
          return true;
        }
      }
      
      // Search in participant names
      const participantMatch = chat.participants?.some(p => 
        p.firstName?.toLowerCase().includes(searchLower) ||
        p.lastName?.toLowerCase().includes(searchLower) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower)
      );
      
      return participantMatch;
    });
  };

  // Filter users for search - Frontend filtering
  const getFilteredUsers = (searchKey = "", roleFilter = "ALL") => {
    return allUsers.filter(user => {
      // Instructor can only add Students or Admins to chat/group
      const userRole = user.role.replace("ROLE_", "");
      if (userRole === "INSTRUCTOR") return false;
      
      // Role filter
      if (roleFilter !== "ALL") {
        if (userRole !== roleFilter) return false;
      }

      // Search filter
      if (!searchKey) return true;
      
      const searchLower = searchKey.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower)
      );
    });
  };

  // Get chat display info
  const getChatDisplayInfo = (chat) => {
    if (chat.chatType === 'GROUP') {
      return {
        name: chat.groupName || 'Nhóm Chat',
        avatar: null,
        subtitle: `${chat.participantCount || chat.participants?.length || 0} thành viên`,
        isGroup: true
      };
    } else {
      // For individual chat, find the other participant
      const userId = getCurrentUserId();
      
      // Find participant that is NOT the current user
      const otherParticipant = chat.participants?.find(p => p.userId !== userId);
      
      if (otherParticipant) {
        return {
          name: `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim(),
          avatar: avatars[otherParticipant.userId],
          subtitle: displayRole(otherParticipant.role),
          isGroup: false,
          userId: otherParticipant.userId,
          role: otherParticipant.role
        };
      }
      
      return {
        name: 'Người dùng không xác định',
        avatar: null,
        subtitle: '',
        isGroup: false
      };
    }
  };

  // Get current user ID (instructor)
  const getCurrentUserId = () => {
    return currentUserId || parseInt(localStorage.getItem("userId")) || 0;
  };

  // Avatar fallback
  const AvatarFallback = ({ name, role, isGroup }) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
    let bgColor = "bg-gray-500";
    
    if (isGroup) {
      bgColor = "bg-green-500";
    } else if (role) {
      const bgColors = {
        STUDENT: "bg-blue-500",
        INSTRUCTOR: "bg-purple-500",
        ADMIN: "bg-red-500"
      };
      bgColor = bgColors[role.replace("ROLE_", "")] || "bg-gray-500";
    }
    
    return (
      <div className={`w-full h-full rounded-full flex items-center justify-center ${bgColor} text-white font-bold text-xl`}>
        {isGroup ? <Users className="w-6 h-6" /> : firstLetter}
      </div>
    );
  };

  // Display role
  const displayRole = (role) => {
    if (!role) return "";
    const roleMap = {
      "ROLE_STUDENT": "Học viên",
      "STUDENT": "Học viên",
      "ROLE_INSTRUCTOR": "Giảng viên",
      "INSTRUCTOR": "Giảng viên",
      "ADMIN": "Quản trị viên",
      "ROLE_ADMIN": "Quản trị viên"
    };
    return roleMap[role] || role;
  };

  // Format time
  const formatLastMessageTime = (timeString) => {
    if (!timeString) return "";
    
    try {
      const messageDate = new Date(timeString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isToday = messageDate.toDateString() === today.toDateString();
      const isYesterday = messageDate.toDateString() === yesterday.toDateString();
      
      if (isToday) {
        return messageDate.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (isYesterday) {
        return "Hôm qua";
      } else {
        return messageDate.toLocaleDateString('vi-VN', {
          day: 'numeric',
          month: 'numeric'
        });
      }
    } catch (e) {
      return "";
    }
  };

  const filteredChats = getFilteredChats();

  return (
    <div className="w-[360px] bg-white border-r flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=G&background=8B5CF6&color=ffffff&size=128&bold=true"
            alt="Giảng viên"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-xl font-bold">Trò chuyện Giảng viên</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => {
              setShowUserSearchModal(true);
            }}
            title="Trò chuyện mới"
          >
            <UserPlus className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => {
              setShowCreateGroupModal(true);
              setGroupName("");
              setSelectedParticipants([]);
              setGroupCreationStep(1);
              setParticipantFilter("ALL");
            }}
            title="Tạo nhóm"
          >
            <Users className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={fetchChats}
            title="Làm mới"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-2 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "ALL"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("INDIVIDUAL")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "INDIVIDUAL"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cá nhân
          </button>
          <button
            onClick={() => setFilter("GROUP")}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === "GROUP"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Nhóm
          </button>
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm text-center mt-2">Bắt đầu một cuộc trò chuyện mới hoặc tạo nhóm</p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Individual Chats Section */}
            {filteredChats.filter(chat => chat.chatType === 'INDIVIDUAL').length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">
                  Trò chuyện cá nhân
                </div>
                {filteredChats.filter(chat => chat.chatType === 'INDIVIDUAL').map((chat) => {
                  const displayInfo = getChatDisplayInfo(chat);
                  return (
                    <div
                      key={chat.chatId}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChatId === chat.chatId ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="relative flex-shrink-0 w-12 h-12">
                        {displayInfo.avatar ? (
                          <img
                            src={displayInfo.avatar}
                            alt={displayInfo.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback 
                            name={displayInfo.name} 
                            role={displayInfo.role}
                            isGroup={displayInfo.isGroup}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold truncate text-gray-900">
                            {displayInfo.name}
                          </h3>
                          {chat.updatedAt && (
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatLastMessageTime(chat.updatedAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate">
                            {displayInfo.subtitle}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Group Chats Section */}
            {filteredChats.filter(chat => chat.chatType === 'GROUP').length > 0 && (
              <>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600 border-t">
                  Trò chuyện nhóm
                </div>
                {filteredChats.filter(chat => chat.chatType === 'GROUP').map((chat) => {
                  const displayInfo = getChatDisplayInfo(chat);
                  return (
                    <div
                      key={chat.chatId}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        activeChatId === chat.chatId ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="relative flex-shrink-0 w-12 h-12">
                        {displayInfo.avatar ? (
                          <img
                            src={displayInfo.avatar}
                            alt={displayInfo.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback 
                            name={displayInfo.name} 
                            role={displayInfo.role}
                            isGroup={displayInfo.isGroup}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold truncate text-gray-900">
                            {displayInfo.name}
                          </h3>
                          {chat.updatedAt && (
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatLastMessageTime(chat.updatedAt)}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate">
                            {displayInfo.subtitle}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Group Creation Modal */}
      {showCreateGroupModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-bold text-lg">Tạo Nhóm Chat</h3>
            <button 
              onClick={() => setShowCreateGroupModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {groupCreationStep === 1 ? (
              // Step 1: Group name
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nhóm
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => {
                    if (groupName.trim()) {
                      setGroupCreationStep(2);
                    }
                  }}
                  disabled={!groupName.trim()}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tiếp theo
                </button>
              </div>
            ) : (
              // Step 2: Select participants
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Chọn thành viên ({selectedParticipants.length})
                    </span>
                    <button
                      onClick={() => setGroupCreationStep(1)}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Quay lại
                    </button>
                  </div>
                  
                  {selectedParticipants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedParticipants.map(user => (
                        <div key={user.userId} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center">
                          {user.firstName} {user.lastName}
                          <button
                            onClick={() => toggleParticipantSelection(user)}
                            className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm người dùng..."
                      className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setParticipantFilter("ALL")}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        participantFilter === "ALL"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setParticipantFilter("STUDENT")}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        participantFilter === "STUDENT"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Học viên
                    </button>
                    <button
                      onClick={() => setParticipantFilter("ADMIN")}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        participantFilter === "ADMIN"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Quản trị viên
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    getFilteredUsers(searchTerm, participantFilter).map((user) => {
                      const isSelected = selectedParticipants.some(p => p.userId === user.userId);
                      return (
                        <div
                          key={user.userId}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-100' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => toggleParticipantSelection(user)}
                        >
                          <div className="relative flex-shrink-0 w-10 h-10">
                            {avatars[user.userId] ? (
                              <img
                                src={avatars[user.userId]}
                                alt={user.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <AvatarFallback 
                                name={user.firstName} 
                                role={user.role}
                                isGroup={false}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-gray-900">
                              {`${user.firstName || ""} ${user.lastName || ""}`}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {displayRole(user.role)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                
                <button
                  onClick={createGroupChat}
                  disabled={selectedParticipants.length < 2}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tạo nhóm ({selectedParticipants.length} thành viên)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Search Modal */}
      {showUserSearchModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="font-bold text-lg">Trò chuyện mới</h3>
            <button 
              onClick={() => setShowUserSearchModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setParticipantFilter("ALL")}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    participantFilter === "ALL"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setParticipantFilter("ADMIN")}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    participantFilter === "ADMIN"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Quản trị viên
                </button>
                <button
                  onClick={() => setParticipantFilter("STUDENT")}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    participantFilter === "STUDENT"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Học viên
                </button>
              </div>
            </div>
            
            <div className="px-4 pb-4">
              {searchLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {getFilteredUsers(searchTerm, participantFilter).map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                      onClick={() => createIndividualChat(user)}
                    >
                      <div className="relative flex-shrink-0 w-12 h-12">
                        {avatars[user.userId] ? (
                          <img
                            src={avatars[user.userId]}
                            alt={user.firstName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback 
                            name={user.firstName} 
                            role={user.role}
                            isGroup={false}
                          />
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
                      <div className="text-purple-600">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;