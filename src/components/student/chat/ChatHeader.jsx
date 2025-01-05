import React from 'react';
import { User } from 'lucide-react';

const ChatHeader = ({ currentChat }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{currentChat?.name || 'Chat Room'}</h2>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {currentChat?.role === 'admin' ? 'Admin Support' : 'Course Instructor'}
      </div>
    </header>
  );
};

export default ChatHeader;