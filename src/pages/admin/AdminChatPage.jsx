import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../../components/admin/chat/ChatHeader';
import ChatSidebar from '../../components/admin/chat/ChatSidebar';
import ChatWindow from '../../components/admin/chat/ChatWindow';
import GroupManagement from '../../components/admin/chat/GroupManagement';

const AdminChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [isGroup, setIsGroup] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const navigate = useNavigate();

  // Debug role và login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('AdminChatPage - Auth Check:', {
      token: !!token,
      role: role,
      isAdmin: role === 'ROLE_ADMIN'
    });

    // Redirect nếu không phải admin
    if (!token || role !== 'ROLE_ADMIN') {
      navigate('/login');
    }
  }, [navigate]);

  const handleUserSelect = ({ user, chat }) => {
    console.log('User selected:', { user, chat });
    
    setSelectedUser(user);
    setChatData(chat);
    setIsGroup(chat?.chatType === 'GROUP');
    setShowGroupManagement(false);
  };

  const handleMessageSent = () => {
    // Refresh sidebar khi có tin nhắn mới
    setRefreshSidebar(prev => prev + 1);
  };

  const handleGroupUpdate = () => {
    // Refresh sidebar và close modal
    setRefreshSidebar(prev => prev + 1);
    setShowGroupManagement(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-none">
          <ChatSidebar 
            onUserSelect={handleUserSelect}
            refreshTrigger={refreshSidebar}
          />
        </div>
        
        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Remove bg-gray-900 from container */}
          <div className="flex-1 overflow-hidden bg-white">
            {chatData ? (
              <ChatWindow 
                selectedUser={selectedUser}
                chatId={chatData.chatId}
                chatData={chatData}
                isGroup={chatData.chatType === 'GROUP'}
                onMessageSent={handleMessageSent}
                onGroupManagementClick={() => {
                  console.log('Group management clicked!');
                  setShowGroupManagement(true);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <img
                    src="https://www.svgrepo.com/show/192262/chat.svg"
                    alt="Empty Chat"
                    className="w-32 h-32 mb-4 mx-auto opacity-50"
                  />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Chưa có cuộc trò chuyện nào
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chọn một người dùng từ danh sách bên trái để bắt đầu chat
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Management Modal */}
      {showGroupManagement && chatData && isGroup && (
        <GroupManagement
          chatData={chatData}
          onClose={() => setShowGroupManagement(false)}
          onUpdate={handleGroupUpdate}
        />
      )}
    </div>
  );
};

export default AdminChatPage;