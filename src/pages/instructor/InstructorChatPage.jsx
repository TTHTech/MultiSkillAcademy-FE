import React, { useState } from 'react';
import ChatHeader from '../../components/admin/chat/ChatHeader';
import InstructorChatSidebar from '../../components/instructor/chat/InstructorChatSideBar';
import InstructorChatWindow from '../../components/instructor/chat/InstructorChatWindow';
import Sidebar from "../../components/instructor/Sidebar/Sidebar";

const InstructorChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [open, setOpen] = useState(true);

  const handleUserSelect = ({ user, chat }) => {
    setSelectedUser(user);
    setChatData(chat);
  };

  return (
    <div className="relative flex">
      <div className={`fixed inset-y-0 left-0 transition-all duration-300 ${open ? 'w-72' : 'w-16'} bg-white shadow-lg z-20`}>
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      <section
        className={`flex-1 transition-margin duration-300 ml-${open ? '72' : '16'} m-3 text-xl text-gray-900 font-semibold bg-gradient-to-b from-gray-100 to-blue-100 shadow-lg rounded-lg min-h-screen`}
      >
        <div className="flex h-full bg-gray-100 relative">
          <div className="flex-none relative z-30">
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
      </section>
    </div>
  );
};

export default InstructorChatPage;
