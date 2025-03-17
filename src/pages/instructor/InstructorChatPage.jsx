import React, { useState } from 'react';
import ChatHeader from '../../components/admin/chat/ChatHeader';
import InstructorChatSidebar from '../../components/instructor/chat/InstructorChatSideBar';
import InstructorChatWindow from '../../components/instructor/chat/InstructorChatWindow';

const InstructorChatPage= () => {
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
          <InstructorChatSidebar onUserSelect={handleUserSelect} />
        </div>
        
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 overflow-hidden">
            <InstructorChatWindow 
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

export default InstructorChatPage;