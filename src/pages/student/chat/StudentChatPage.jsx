import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentChatSidebar from '../../../components/student/chat/StudentChatSidebar.jsx';
import StudentChatWindow from '../../../components/student/chat/StudentChatWindow.jsx';

const StudentChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [isGroup, setIsGroup] = useState(false);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const navigate = useNavigate();

  // Debug role và login status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('StudentChatPage - Auth Check:', {
      token: !!token,
      role: role,
      isStudent: role === 'ROLE_STUDENT'
    });

    // Redirect nếu không phải student
    if (!token || role !== 'ROLE_STUDENT') {
      navigate('/login');
    }
  }, [navigate]);

  const handleUserSelect = ({ user, chat }) => {
    console.log('User selected:', { user, chat });
    
    setSelectedUser(user);
    setChatData(chat);
    setIsGroup(chat?.chatType === 'GROUP');
  };

  const handleMessageSent = () => {
    // Refresh sidebar khi có tin nhắn mới
    setRefreshSidebar(prev => prev + 1);
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 gap-0 m-0 p-0 overflow-hidden">
      {/* Chat Sidebar - 384px */}
      <div className="w-[384px] min-w-96 max-w-96 bg-white flex-shrink-0 border-r-0 gap-0 m-0 p-0">
        <StudentChatSidebar 
          onUserSelect={handleUserSelect}
          refreshTrigger={refreshSidebar}
        />
      </div>
      
      {/* Chat Window - Remaining space */}
      <div className="flex-1 bg-white gap-0 m-0 p-0 border-l-0">
        {chatData ? (
          <StudentChatWindow 
            selectedUser={selectedUser}
            chatId={chatData.chatId}
            chatData={chatData}
            isGroup={chatData.chatType === 'GROUP'}
            onMessageSent={handleMessageSent}
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
  );
};

export default StudentChatPage;