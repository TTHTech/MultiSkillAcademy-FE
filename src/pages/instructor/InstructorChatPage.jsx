import React, { useState } from 'react';
import ChatHeader from '../../components/admin/chat/ChatHeader';
import InstructorChatSidebar from '../../components/instructor/chat/InstructorChatSideBar';
import InstructorChatWindow from '../../components/instructor/chat/InstructorChatWindow';
import Sidebar from "../../components/instructor/Sidebar/Sidebar";

const InstructorChatPage= () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [open, setOpen] = useState(true);

  const handleUserSelect = ({ user, chat }) => {
    setSelectedUser(user);
    setChatData(chat);
  };

  return (
    <section
    className={`m-3 text-xl text-gray-900 font-semibold duration-300 flex-1 bg-gradient-to-b from-gray-100 to-blue-100 shadow-lg rounded-lg min-h-screen ${
      open ? "ml-72" : "ml-16"
    }`}
  >
    <Sidebar open={open} setOpen={setOpen} />
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
    </section>
  );
};

export default InstructorChatPage;