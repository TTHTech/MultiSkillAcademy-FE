import React from 'react';
import { Phone, Video, MoreVertical, Users, LogOut } from 'lucide-react';

const StudentChatHeader = ({ 
  selectedUser, 
  isGroup, 
  chatData, 
  isTyping, 
  avatars,
  getRoleText,
  onLeaveGroupClick 
}) => {
  const userAvatar = selectedUser && avatars[selectedUser.userId]
    ? avatars[selectedUser.userId]
    : selectedUser?.avatar || 
      "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";

  const displayName = isGroup
    ? chatData?.groupName || "Nhóm chat"
    : selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName}`
    : "Chat";

  const displayStatus = isGroup
    ? `${chatData?.participants?.length || 0} thành viên`
    : isTyping
    ? "Đang nhập..."
    : selectedUser
    ? getRoleText(selectedUser.role)
    : "Đang hoạt động";

  return (
    <div className="bg-blue-500 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {isGroup ? (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        ) : (
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
            }}
          />
        )}
        <div>
          <h3 className="font-semibold text-white">{displayName}</h3>
          <span className="text-sm text-blue-50">{displayStatus}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isGroup && (
          <button 
            onClick={onLeaveGroupClick}
            className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors"
            title="Rời khỏi nhóm"
          >
            <LogOut className="w-6 h-6" />
          </button>
        )}
        <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
          <Phone className="w-6 h-6" />
        </button>
        <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
          <Video className="w-6 h-6" />
        </button>
        <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default StudentChatHeader;