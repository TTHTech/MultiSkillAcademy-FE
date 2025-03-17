import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatSidebar from '../../../components/student/chat/ChatSidebar';
import ChatContainer from '../../../components/student/chat/ChatContainer';
import { Client } from '@stomp/stompjs';

// Polyfill for global (Giải quyết lỗi "global is not defined")
if (typeof global === 'undefined') {
  window.global = window;
}

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  
  // Kết nối WebSocket khi component được mount
  useEffect(() => {
    console.log("Initializing WebSocket connection...");
    
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      debug: function(str) {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function(frame) {
      console.log('Connected to WebSocket:', frame);
      setStompClient(client);
      
      // Subscribe các sự kiện toàn cục
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log(`Subscribing to /topic/chat/${userId}/new`);
        client.subscribe(`/topic/chat/${userId}/new`, (message) => {
          // Xử lý khi có cuộc trò chuyện mới
          try {
            const newChat = JSON.parse(message.body);
            console.log('New chat received:', newChat);
            // Có thể thêm logic refresh danh sách chat ở đây
          } catch (error) {
            console.error('Error parsing message:', error, message.body);
          }
        });
      } else {
        console.warn("No userId found in localStorage");
      }
    };

    client.onStompError = function(frame) {
      console.error('STOMP error:', frame);
    };
    
    client.onWebSocketError = function(error) {
      console.error('WebSocket error:', error);
    };

    console.log("Activating STOMP client...");
    client.activate();
    
    return () => {
      console.log("Deactivating STOMP client...");
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  // Khi chọn một cuộc trò chuyện
  useEffect(() => {
    if (!selectedChat) {
      console.log("No chat selected");
      return;
    }
    
    console.log(`Fetching details for chat ID ${selectedChat}`);
    
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/chat/${selectedChat}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log("Chat details fetched:", response.data);
        setCurrentChat(response.data);
      } catch (error) {
        console.error('Error fetching chat details:', error);
        console.error('Response:', error.response?.data);
      }
    };
    
    fetchChatDetails();
  }, [selectedChat]);

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar 
        onSelectChat={setSelectedChat}
        selectedChatId={selectedChat}
      />
       
      <div className="flex flex-col flex-1">
        {selectedChat ? (
          <ChatContainer 
            chatId={selectedChat}
            selectedUser={currentChat?.recipient}
            stompClient={stompClient}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center p-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Student Chat System</h2>
              <p className="text-gray-500 mb-6">Chọn một cuộc trò chuyện hoặc tìm kiếm một giảng viên để bắt đầu</p>
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-500">
                  Bạn có thể liên hệ với giảng viên hoặc admin để được hỗ trợ về các vấn đề liên quan đến khóa học, bài tập, 
                  hoặc các vấn đề kỹ thuật.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;