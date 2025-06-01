import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  UserPlus,
  UserMinus,
  Users,
  Search,
  Settings,
} from "lucide-react";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const GroupManagement = ({ chatData, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("info"); // info, participants, add
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(chatData?.groupName || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(false);

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
        `${baseUrl}/api/instructor/chat/users/${userId}/avatar`,
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

  // Search users for adding to group
  const searchUsersForGroup = async (keyword) => {
    try {
      setSearchLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again");

      const url = new URL(`${baseUrl}/api/instructor/chat/search/users`);
      if (keyword) url.searchParams.append("keyword", keyword);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Cannot search users");
      }

      const data = await response.json();

      // Filter out existing participants
      const existingIds = chatData?.participants?.map((p) => p.userId) || [];
      const filteredUsers = data.filter(
        (user) => !existingIds.includes(user.userId)
      );

      setSearchUsers(filteredUsers);

      // Fetch avatars for search results
      filteredUsers.forEach((user) => fetchUserAvatar(user.userId));
    } catch (err) {
      console.error("Error searching users:", err);
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
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
      if (!token) throw new Error("Please login again");

      const response = await fetch(
        `${baseUrl}/api/instructor/chat/${chatData.chatId}/group-info`,
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
        throw new Error("Cannot update group name");
      }

      toast.success("Group name updated successfully");
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

  // Add participant to group
  const addParticipantToGroup = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again");

      const response = await fetch(
        `${baseUrl}/api/instructor/chat/${chatData.chatId}/participants/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userIds: [userId],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Cannot add participant");
      }

      toast.success("Participant added successfully");

      // Remove from search results
      setSearchUsers((prev) => prev.filter((u) => u.userId !== userId));

      // Notify parent to refresh
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error adding participant:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove participant from group
  const removeParticipantFromGroup = async (userId) => {
    try {
      if (!confirm("Are you sure you want to remove this participant?")) return;

      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again");

      const response = await fetch(
        `${baseUrl}/api/instructor/chat/${chatData.chatId}/participants/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kiểm tra response chi tiết
      const responseText = await response.text();
      console.log("Remove participant response status:", response.status);
      console.log("Remove participant response body:", responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.error || errorData.message || "Cannot remove participant"
          );
        } catch {
          throw new Error(`Cannot remove participant (${response.status})`);
        }
      }

      // Parse response để lấy updated chat data
      try {
        const updatedChat = JSON.parse(responseText);

        // Cập nhật chatData với data mới từ server
        if (updatedChat && updatedChat.participants) {
          // Verify participant was actually removed
          const stillExists = updatedChat.participants.some(
            (p) => p.userId === userId
          );
          if (stillExists) {
            throw new Error("Server did not remove participant");
          }
        }
      } catch (parseError) {
        console.warn("Could not parse response as JSON:", parseError);
      }

      toast.success("Participant removed successfully");

      // Force parent to refresh data from server
      if (onUpdate) {
        onUpdate();
      }

      // Also close modal to force refresh when reopened
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

  // Role display
  const getRoleText = (role) => {
    const roleMap = {
      ADMIN: "Admin",
      ROLE_ADMIN: "Admin",
      INSTRUCTOR: "Instructor",
      ROLE_INSTRUCTOR: "Instructor",
      STUDENT: "Student",
      ROLE_STUDENT: "Student",
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

  // Check if current user is group creator
  const isGroupCreator = chatData?.participants?.some(
    p => p.userId === getCurrentUserId() && p.participantType === 'ADMIN'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Group Management</h3>
              <p className="text-sm text-gray-500">
                {chatData?.participants?.length || 0} participants
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
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Group Info
          </button>
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "participants"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Participants
          </button>
          {isGroupCreator && (
            <button
              onClick={() => {
                setActiveTab("add");
                searchUsersForGroup("");
              }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === "add"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Members
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Group Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Group Name
                </label>
                {isEditingName && isGroupCreator ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={updateGroupName}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setNewGroupName(chatData?.groupName || "");
                        setIsEditingName(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg">
                      {chatData?.groupName || "Group Chat"}
                    </p>
                    {isGroupCreator && (
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {chatData?.participants?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {chatData?.createdAt
                      ? new Date(chatData.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
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
                          {isCurrentUser && " (You)"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getRoleText(participant.role)}
                          {participant.participantType === 'ADMIN' && " - Group Creator"}
                        </p>
                      </div>
                    </div>

                    {!isCurrentUser && isGroupCreator && participant.participantType !== 'ADMIN' && (
                      <button
                        onClick={() =>
                          removeParticipantFromGroup(participant.userId)
                        }
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Remove participant"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "add" && isGroupCreator && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchUsersForGroup(e.target.value);
                  }}
                  placeholder="Search users to add..."
                  className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : searchUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "No users found" : "Search for users to add"}
                  </div>
                ) : (
                  searchUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
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

                      <button
                        onClick={() => addParticipantToGroup(user.userId)}
                        disabled={loading}
                        className="p-2 bg-purple-500 text-white hover:bg-purple-600 rounded-full transition-colors disabled:opacity-50"
                        title="Add to group"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;