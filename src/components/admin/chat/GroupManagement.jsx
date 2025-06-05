import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  UserPlus,
  UserMinus,
  Users,
  Search,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const GroupManagement = ({ chatData, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("info"); // info, participants, add
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(chatData?.groupName || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get current user ID
  const getCurrentUserId = () => {
    return parseInt(localStorage.getItem("userId")) || 0;
  };

  // Fetch user avatar
  const fetchUserAvatar = async (userId) => {
    try {
      if (!userId || avatars[userId]) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${baseUrl}/api/admin/chat/users/${userId}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return;

      const data = await response.json();
      if (data.avatarUrl) {
        setAvatars((prev) => ({
          ...prev,
          [userId]: data.avatarUrl,
        }));
      }
    } catch (err) {
      console.error(`Error fetching avatar for user ${userId}:`, err);
    }
  };

  // Fetch avatars for all participants
  useEffect(() => {
    if (chatData?.participants) {
      chatData.participants.forEach((p) => {
        if (p.userId) fetchUserAvatar(p.userId);
      });
    }
  }, [chatData]);

  // Fetch all users once
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(`${baseUrl}/api/admin/chat/search/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách người dùng");
      }

      const data = await response.json();
      setAllUsers(data);

      // Fetch avatars for all users
      data.forEach((user) => fetchUserAvatar(user.userId));
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Get filtered users for adding to group
  const getAvailableUsers = () => {
    // Filter out existing participants
    const existingIds = chatData?.participants?.map((p) => p.userId) || [];
    
    return allUsers.filter((user) => {
      // Exclude existing participants
      if (existingIds.includes(user.userId)) return false;
      
      // Apply role filter
      if (roleFilter !== "ALL") {
        const userRole = user.role.replace("ROLE_", "");
        if (userRole !== roleFilter) return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  // Update group name
  const updateGroupName = async () => {
    try {
      if (!newGroupName.trim() || newGroupName.trim() === chatData.groupName) {
        setIsEditingName(false);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatData.chatId}/group-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupName: newGroupName.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật tên nhóm");
      }

      toast.success("Cập nhật tên nhóm thành công");
      setIsEditingName(false);

      // Notify parent to refresh
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error updating group name:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add multiple participants to group
  const addParticipantsToGroup = async () => {
    try {
      if (selectedUsers.length === 0) {
        toast.error("Vui lòng chọn ít nhất một người");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatData.chatId}/participants/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userIds: selectedUsers.map(u => u.userId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể thêm thành viên");
      }

      toast.success(`Đã thêm ${selectedUsers.length} thành viên thành công`);

      // Clear selection
      setSelectedUsers([]);
      setSearchTerm("");
      setRoleFilter("ALL");

      // Notify parent to refresh
      if (onUpdate) onUpdate();
      
      // Switch to participants tab
      setActiveTab("participants");
    } catch (err) {
      console.error("Error adding participants:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove participant from group
  const removeParticipantFromGroup = async (userId) => {
    try {
      if (!confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?")) return;

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatData.chatId}/participants/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.error || errorData.message || "Không thể xóa thành viên"
          );
        } catch {
          throw new Error(`Không thể xóa thành viên (${response.status})`);
        }
      }

      toast.success("Xóa thành viên thành công");

      // Force parent to refresh
      if (onUpdate) {
        onUpdate();
      }

      // Close modal to force refresh
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Error removing participant:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete group
  const deleteGroup = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/system/${chatData.chatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể giải tán nhóm");
      }

      toast.success("Giải tán nhóm thành công");
      
      // Notify parent and close
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      console.error("Error deleting group:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.userId === user.userId);
      if (isSelected) {
        return prev.filter(u => u.userId !== user.userId);
      } else {
        return [...prev, user];
      }
    });
  };

  // Role display
  const getRoleText = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      ROLE_ADMIN: "Quản trị viên",
      INSTRUCTOR: "Giảng viên",
      ROLE_INSTRUCTOR: "Giảng viên",
      STUDENT: "Học viên",
      ROLE_STUDENT: "Học viên",
    };
    return roleMap[role] || role;
  };

  // Avatar fallback
  const AvatarFallback = ({ name, role }) => {
    const firstLetter = name ? name.charAt(0).toUpperCase() : "?";
    const bgColors = {
      STUDENT: "bg-blue-500",
      INSTRUCTOR: "bg-purple-500",
      ADMIN: "bg-red-500",
    };
    const bgColor = bgColors[role?.replace("ROLE_", "")] || "bg-gray-500";

    return (
      <div
        className={`w-full h-full rounded-full flex items-center justify-center ${bgColor} text-white font-bold`}
      >
        {firstLetter}
      </div>
    );
  };

  const availableUsers = getAvailableUsers();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Quản lý nhóm</h3>
              <p className="text-sm text-gray-500">
                {chatData?.participants?.length || 0} thành viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "info"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thông tin nhóm
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "participants"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thành viên
          </button>
          <button
            onClick={() => {
              setActiveTab("add");
              setSelectedUsers([]);
              setSearchTerm("");
              setRoleFilter("ALL");
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "add"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Thêm thành viên
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tên nhóm
                </label>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={updateGroupName}
                      disabled={loading}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setNewGroupName(chatData?.groupName || "");
                        setIsEditingName(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg">
                      {chatData?.groupName || "Nhóm Chat"}
                    </p>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Tổng thành viên</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chatData?.participants?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {chatData?.createdAt
                      ? new Date(chatData.createdAt).toLocaleDateString('vi-VN')
                      : "Không xác định"}
                  </p>
                </div>
              </div>

              {/* Participant breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Phân loại thành viên</p>
                <div className="space-y-2">
                  {(() => {
                    const counts = chatData?.participants?.reduce((acc, p) => {
                      const role = p.role?.replace("ROLE_", "") || "UNKNOWN";
                      acc[role] = (acc[role] || 0) + 1;
                      return acc;
                    }, {}) || {};
                    
                    return Object.entries(counts).map(([role, count]) => (
                      <div key={role} className="flex justify-between text-sm">
                        <span className="text-gray-600">{getRoleText(role)}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium text-red-600 mb-3">Vùng nguy hiểm</h4>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Giải tán nhóm
                </button>
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <div className="space-y-2">
              {chatData?.participants?.map((participant) => {
                const isCurrentUser = participant.userId === getCurrentUserId();
                const avatar = avatars[participant.userId];

                return (
                  <div
                    key={participant.userId}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={participant.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback
                            name={participant.firstName}
                            role={participant.role}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {participant.firstName} {participant.lastName}
                          {isCurrentUser && " (Bạn)"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getRoleText(participant.role)}
                        </p>
                      </div>
                    </div>

                    {!isCurrentUser && (
                      <button
                        onClick={() =>
                          removeParticipantFromGroup(participant.userId)
                        }
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Xóa thành viên"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "add" && (
            <div className="space-y-4">
              {/* Selected users */}
              {selectedUsers.length > 0 && (
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-emerald-700 mb-2">
                    Đã chọn: {selectedUsers.length} người
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map(user => (
                      <div key={user.userId} className="bg-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        {user.firstName} {user.lastName}
                        <button
                          onClick={() => toggleUserSelection(user)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search and filter */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm người dùng để thêm..."
                    className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRoleFilter("ALL")}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      roleFilter === "ALL"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setRoleFilter("STUDENT")}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      roleFilter === "STUDENT"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Học viên
                  </button>
                  <button
                    onClick={() => setRoleFilter("INSTRUCTOR")}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      roleFilter === "INSTRUCTOR"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Giảng viên
                  </button>
                </div>
              </div>

              {/* User list */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || roleFilter !== "ALL" 
                      ? "Không tìm thấy người dùng phù hợp" 
                      : "Tất cả người dùng đã trong nhóm"}
                  </div>
                ) : (
                  availableUsers.map((user) => {
                    const isSelected = selectedUsers.some(u => u.userId === user.userId);
                    return (
                      <div
                        key={user.userId}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-100' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10">
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
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getRoleText(user.role)}
                            </p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add button */}
              {selectedUsers.length > 0 && (
                <button
                  onClick={addParticipantsToGroup}
                  disabled={loading}
                  className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Thêm {selectedUsers.length} thành viên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-bold text-lg">Xác nhận giải tán nhóm</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn giải tán nhóm <strong>{chatData?.groupName || "này"}</strong>? 
              Hành động này không thể hoàn tác và tất cả tin nhắn sẽ bị xóa vĩnh viễn.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={deleteGroup}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Giải tán nhóm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;