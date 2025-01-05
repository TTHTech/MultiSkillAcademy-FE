import React from 'react';
import ChatHeader from '../../../components/student/chat/ChatHeader';
import ChatSidebar from '../../../components/student/chat/ChatSidebar';
import ChatMessages from '../../../components/student/chat/ChatMessages';
import ChatInput from '../../../components/student/chat/ChatInput';

const ChatPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      <div className="flex flex-col flex-1">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;