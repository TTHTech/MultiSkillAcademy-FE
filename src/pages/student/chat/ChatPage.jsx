import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChatSidebar from '../../../components/student/chat/ChatSidebar';
import ChatWindow from '../../../components/student/chat/ChatWindow';

const ChatPage = () => {
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
        
        <div className="flex-1 flex flex-col bg-gray-50">
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

export default ChatPage;