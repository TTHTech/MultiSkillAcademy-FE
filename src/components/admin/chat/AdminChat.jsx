import React, { useState, useCallback, useRef } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Use ref to prevent unnecessary re-renders
  const lastRefreshRef = useRef(Date.now());

  // Handle user selection from sidebar
  const handleUserSelect = useCallback(({ user, chat }) => {
    console.log("AdminChat: User selected:", user.userId, "Chat:", chat.chatId);
    setSelectedUser(user);
    setChatData(chat);
  }, []);

  // Handle message sent to refresh sidebar - with throttling
  const handleMessageSent = useCallback(() => {
    const now = Date.now();
    // Throttle refresh to prevent too frequent updates
    if (now - lastRefreshRef.current < 2000) { // 2 seconds minimum between refreshes
      console.log("AdminChat: Refresh throttled");
      return;
    }
    
    lastRefreshRef.current = now;
    console.log("AdminChat: Triggering sidebar refresh after message sent");
    
    // Delay to allow backend to process the message
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 1500);
  }, []);

  // Manual refresh function
  const triggerRefresh = useCallback(() => {
    console.log("AdminChat: Manual refresh triggered");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Debug information
  const debugInfo = {
    selectedUserId: selectedUser?.userId,
    chatId: chatData?.chatId,
    refreshTrigger,
    lastRefresh: new Date(lastRefreshRef.current).toLocaleTimeString()
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 right-0 bg-black text-white text-xs p-2 z-50 opacity-75">
          <div>User: {debugInfo.selectedUserId || 'None'}</div>
          <div>Chat: {debugInfo.chatId || 'None'}</div>
          <div>Trigger: {debugInfo.refreshTrigger}</div>
          <div>Last: {debugInfo.lastRefresh}</div>
        </div>
      )}
      
      {/* Sidebar */}
      <ChatSidebar 
        onUserSelect={handleUserSelect}
        refreshTrigger={refreshTrigger}
      />
      
      {/* Main Chat Window */}
      <div className="flex-1">
        <ChatWindow 
          selectedUser={selectedUser}
          chatId={chatData?.chatId}
          chatData={chatData}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
};

export default AdminChat;