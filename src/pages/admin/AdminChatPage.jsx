import React, { useState } from 'react';
import ChatHeader from '../../components/admin/chat/ChatHeader';
import ChatSidebar from '../../components/admin/chat/ChatSideBar';
import ChatWindow from '../../components/admin/chat/ChatWindow';

const AdminChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);

  const handleUserSelect = ({ user, chat }) => {
    setSelectedUser(user);
    setChatData(chat);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-none">
          <ChatSidebar onUserSelect={handleUserSelect} />
        </div>
        
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 overflow-hidden">
            <ChatWindow 
              selectedUser={selectedUser}
              chatId={chatData?.chatId}
              chatData={chatData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;