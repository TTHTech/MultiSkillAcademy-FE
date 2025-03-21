import React from 'react';

const ChatMessage = ({ user, message, timestamp }) => {
  return (
    <div className="mb-4">
      <div className="text-sm text-gray-500">{user} • {timestamp}</div>
      <div className="bg-white p-3 rounded-lg shadow-sm text-gray-800 mt-1">
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;