import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatContainer = ({ chatId, selectedUser, stompClient }) => {
  const [newMessage, setNewMessage] = useState(null);
  
  // Handler for when a new message is sent
  const handleMessageSent = (message, tempId) => {
    if (tempId) {
      // If tempId is provided, this is an update to a temporary message
      setNewMessage({ ...message, tempId });
    } else {
      // Otherwise, it's a new message
      setNewMessage(message);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedUser={selectedUser} />
      <ChatMessages 
        chatId={chatId} 
        newMessage={newMessage} 
      />
      <ChatInput 
        chatId={chatId} 
        onMessageSent={handleMessageSent} 
        stompClient={stompClient} 
      />
    </div>
  );
};

export default ChatContainer;