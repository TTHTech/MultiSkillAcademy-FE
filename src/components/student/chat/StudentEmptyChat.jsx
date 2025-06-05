import React from 'react';

const StudentEmptyChat = ({ selectedUser, isGroup, chatData, avatars, getRoleText }) => {
  const userAvatar = selectedUser && avatars[selectedUser.userId]
    ? avatars[selectedUser.userId]
    : selectedUser?.avatar || 
      "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";

  const displayName = isGroup
    ? chatData?.groupName || "Nhóm chat"
    : selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName}`
    : null;

  const displayRole = isGroup
    ? `${chatData?.participants?.length || 0} thành viên`
    : selectedUser
    ? getRoleText(selectedUser.role)
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {displayName ? (
        <>
          <img
            src={userAvatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full mb-4 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
            }}
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {displayName}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{displayRole}</p>
          <p className="text-sm text-gray-500">Hãy bắt đầu cuộc trò chuyện</p>
        </>
      ) : (
        <>
          <img
            src="https://www.svgrepo.com/show/192262/chat.svg"
            alt="Empty Chat"
            className="w-32 h-32 mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có cuộc trò chuyện nào
          </h3>
          <p className="text-sm text-gray-500">
            Chọn một người dùng từ danh sách bên trái để bắt đầu chat
          </p>
        </>
      )}
    </div>
  );
};

export default StudentEmptyChat;