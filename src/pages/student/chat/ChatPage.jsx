import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import ChatSidebar from '../../../components/student/chat/ChatSidebar';
import ChatMessages from '../../../components/student/chat/ChatWindow';
import ChatInput from '../../../components/student/chat/ChatInput';
import { toast } from 'react-toastify';

// Polyfill for global (Fixes "global is not defined" error)
if (typeof global === 'undefined') {
  window.global = window;
}

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [chatData, setChatData] = useState(null);
  
  // Initialize WebSocket connection when component mounts
  useEffect(() => {
    console.log("Initializing WebSocket connection...");
    setIsConnecting(true);
    setConnectionError(null);
    
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
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
      setIsConnecting(false);
      
      // Subscribe to user-specific topics
      const userId = localStorage.getItem('userId');
      if (userId) {
        // New chat notifications
        console.log(`Subscribing to /topic/chat/${userId}/new`);
        client.subscribe(`/topic/chat/${userId}/new`, (message) => {
          try {
            const newChat = JSON.parse(message.body);
            console.log('New chat received:', newChat);
            toast.info(`New conversation with ${newChat.participants.find(p => p.userId !== parseInt(userId))?.firstName || 'User'}`);
          } catch (error) {
            console.error('Error parsing message:', error, message.body);
          }
        });
        
        // New message notifications (for chats that aren't currently open)
        console.log(`Subscribing to /topic/chat/${userId}/message`);
        client.subscribe(`/topic/chat/${userId}/message`, (message) => {
          try {
            const newMsg = JSON.parse(message.body);
            console.log('New message received via WebSocket:', newMsg);
            
            // Only show notification if the message is not for the currently open chat
            if (newMsg.chatId !== selectedChatId && newMsg.senderId !== parseInt(userId)) {
              toast.info(`New message from ${newMsg.senderName || 'User'}`);
            }
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
      setConnectionError('Error connecting to chat service');
      setIsConnecting(false);
    };
    
    client.onWebSocketError = function(error) {
      console.error('WebSocket error:', error);
      setConnectionError('Error connecting to chat service');
      setIsConnecting(false);
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

  // Subscribe to typing notifications when a chat is selected
  useEffect(() => {
    if (!stompClient || !stompClient.connected || !selectedChatId) {
      return;
    }
    
    // Subscribe to typing notifications for this chat
    console.log(`Subscribing to /topic/chat/${selectedChatId}/typing`);
    const subscription = stompClient.subscribe(`/topic/chat/${selectedChatId}/typing`, (message) => {
      try {
        const typingData = JSON.parse(message.body);
        console.log('Typing notification:', typingData);
        
        // Handle typing notification in the UI
        // You can pass this to the ChatMessages component
      } catch (error) {
        console.error('Error parsing typing notification:', error, message.body);
      }
    });
    
    // Subscribe to new messages for this chat
    console.log(`Subscribing to /topic/chat/${selectedChatId}/messages`);
    const messageSubscription = stompClient.subscribe(`/topic/chat/${selectedChatId}/messages`, (message) => {
      try {
        const newMsg = JSON.parse(message.body);
        console.log('New message received for current chat:', newMsg);
        
        // Only process if from someone else (not our own messages)
        if (newMsg.senderId !== parseInt(localStorage.getItem('userId'))) {
          setNewMessage(newMsg);
        }
      } catch (error) {
        console.error('Error parsing message:', error, message.body);
      }
    });
    
    return () => {
      subscription.unsubscribe();
      messageSubscription.unsubscribe();
    };
  }, [stompClient, selectedChatId]);

  // Fetch user details when selecting a chat
  useEffect(() => {
    if (!selectedChatId) {
      setSelectedUser(null);
      return;
    }
    
    const fetchChatDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/chat/${selectedChatId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data) {
          console.log("Chat details fetched:", response.data);
          setChatData(response.data);
          
          // Find the other participant (not the current user)
          const currentUserId = parseInt(localStorage.getItem('userId'));
          const otherParticipant = response.data.participants.find(p => p.userId !== currentUserId);
          
          if (otherParticipant) {
            setSelectedUser(otherParticipant);
          }
        }
      } catch (error) {
        console.error('Error fetching chat details:', error);
        toast.error('Could not load conversation details');
      }
    };
    
    fetchChatDetails();
  }, [selectedChatId]);

  // Handle sending a message
  const handleSendMessage = (message, tempId = null) => {
    // Pass the message to the ChatMessages component
    setNewMessage(tempId ? {...message, tempId} : message);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Sidebar */}
      <ChatSidebar 
        onSelectChat={setSelectedChatId}
        selectedChatId={selectedChatId}
      />
      
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {connectionError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{connectionError}. Please refresh the page or try again later.</p>
          </div>
        )}
        
        {isConnecting && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            <p>Connecting to chat service...</p>
          </div>
        )}
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ChatMessages 
            chatId={selectedChatId}
            selectedUser={selectedUser}
            chatData={chatData}
            newMessage={newMessage}
          />
        </div>
        
        {/* Chat Input */}
        <ChatInput 
          chatId={selectedChatId}
          onMessageSent={handleSendMessage}
          stompClient={stompClient}
        />
      </div>
    </div>
  );
};

export default ChatPage;