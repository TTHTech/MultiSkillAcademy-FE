import { useEffect, useRef, useCallback } from 'react';
import { STUDENT_CHAT_CONSTANTS } from './StudentChatConstants';
import StudentChatService from './StudentChatService';

const useStudentChatWebSocket = ({
  onNewMessage,
  onTypingStatusChange,
  onConnectionStatusChange,
  onError
}) => {
  const stompClientRef = useRef(null);
  const subscriptionsRef = useRef(new Map());
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    try {
      // Check if user is authenticated
      if (!StudentChatService.isAuthenticated()) {
        console.warn('User not authenticated, skipping WebSocket connection');
        return;
      }

      // Get existing connection or create new one
      const existingClient = window.stompClient;
      
      if (existingClient && existingClient.connected) {
        console.log('Using existing WebSocket connection');
        stompClientRef.current = existingClient;
        
        if (onConnectionStatusChange) {
          onConnectionStatusChange(true);
        }
        
        return existingClient;
      }

      console.log('Initializing new WebSocket connection for student chat...');
      
      // WebSocket connection will be handled by global connection
      // This hook just manages student-specific subscriptions
      
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      if (onError) {
        onError('WebSocket connection failed');
      }
    }
  }, [onConnectionStatusChange, onError]);

  // Subscribe to chat-specific topics
  const subscribeToChatTopics = useCallback((chatId) => {
    if (!stompClientRef.current || !stompClientRef.current.connected || !chatId) {
      return;
    }

    try {
      // Subscribe to typing status for this chat
      const typingTopic = STUDENT_CHAT_CONSTANTS.WEBSOCKET.TOPIC_TYPING(chatId);
      const typingSubscription = stompClientRef.current.subscribe(typingTopic, (message) => {
        try {
          const typingData = JSON.parse(message.body);
          
          // Don't show typing status for current user
          const currentUserId = StudentChatService.getCurrentUserId();
          if (typingData.userId !== currentUserId && onTypingStatusChange) {
            onTypingStatusChange(typingData);
          }
        } catch (error) {
          console.error('Error parsing typing status:', error);
        }
      });

      // Subscribe to new messages for this chat
      const messagesTopic = STUDENT_CHAT_CONSTANTS.WEBSOCKET.TOPIC_NEW_MESSAGE(chatId);
      const messagesSubscription = stompClientRef.current.subscribe(messagesTopic, (message) => {
        try {
          const messageData = JSON.parse(message.body);
          
          // Don't process messages from current user (already added locally)
          const currentUserId = StudentChatService.getCurrentUserId();
          if (messageData.senderId !== currentUserId && onNewMessage) {
            onNewMessage(messageData);
          }
        } catch (error) {
          console.error('Error parsing new message:', error);
        }
      });

      // Store subscriptions for cleanup
      subscriptionsRef.current.set(`typing_${chatId}`, typingSubscription);
      subscriptionsRef.current.set(`messages_${chatId}`, messagesSubscription);

      console.log(`Subscribed to chat topics for chatId: ${chatId}`);
    } catch (error) {
      console.error('Error subscribing to chat topics:', error);
      if (onError) {
        onError('Failed to subscribe to chat updates');
      }
    }
  }, [onNewMessage, onTypingStatusChange, onError]);

  // Unsubscribe from chat-specific topics
  const unsubscribeFromChatTopics = useCallback((chatId) => {
    if (!chatId) return;

    try {
      const typingKey = `typing_${chatId}`;
      const messagesKey = `messages_${chatId}`;

      const typingSubscription = subscriptionsRef.current.get(typingKey);
      const messagesSubscription = subscriptionsRef.current.get(messagesKey);

      if (typingSubscription) {
        typingSubscription.unsubscribe();
        subscriptionsRef.current.delete(typingKey);
      }

      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
        subscriptionsRef.current.delete(messagesKey);
      }

      console.log(`Unsubscribed from chat topics for chatId: ${chatId}`);
    } catch (error) {
      console.error('Error unsubscribing from chat topics:', error);
    }
  }, []);

  // Send message via WebSocket
  const sendMessage = useCallback((chatId, content, messageType = 'TEXT') => {
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      throw new Error('WebSocket not connected');
    }

    try {
      const messagePayload = StudentChatService.getWebSocketMessagePayload(chatId, content, messageType);
      
      stompClientRef.current.publish({
        destination: STUDENT_CHAT_CONSTANTS.WEBSOCKET.SEND_MESSAGE,
        body: JSON.stringify(messagePayload)
      });

      console.log('Message sent via WebSocket:', messagePayload);
    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
      throw error;
    }
  }, []);

  // Send typing status
  const sendTypingStatus = useCallback((chatId, isTyping) => {
    if (!stompClientRef.current || !stompClientRef.current.connected || !chatId) {
      return;
    }

    try {
      const typingPayload = StudentChatService.getTypingStatusPayload(chatId, isTyping);
      
      stompClientRef.current.publish({
        destination: STUDENT_CHAT_CONSTANTS.WEBSOCKET.TYPING,
        body: JSON.stringify(typingPayload)
      });

      console.log('Typing status sent:', typingPayload);
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  }, []);

  // Check connection status
  const isConnected = useCallback(() => {
    return stompClientRef.current && stompClientRef.current.connected;
  }, []);

  // Reconnect logic
  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      if (onError) {
        onError('Connection lost. Please refresh the page.');
      }
      return;
    }

    reconnectAttemptsRef.current += 1;
    console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      initializeWebSocket();
    }, reconnectDelay * reconnectAttemptsRef.current);
  }, [initializeWebSocket, onError]);

  // Handle connection events
  useEffect(() => {
    const checkConnection = () => {
      const client = window.stompClient;
      if (client && client.connected) {
        stompClientRef.current = client;
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts
        
        if (onConnectionStatusChange) {
          onConnectionStatusChange(true);
        }
      } else {
        if (onConnectionStatusChange) {
          onConnectionStatusChange(false);
        }
        
        // Attempt reconnect if not already trying
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          attemptReconnect();
        }
      }
    };

    // Check connection initially
    checkConnection();

    // Set up periodic connection checks
    const connectionCheckInterval = setInterval(checkConnection, 5000);

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [onConnectionStatusChange, attemptReconnect]);

  // Initialize WebSocket on mount
  useEffect(() => {
    initializeWebSocket();

    return () => {
      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Unsubscribe from all topics
      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });
      subscriptionsRef.current.clear();
    };
  }, [initializeWebSocket]);

  return {
    // Connection status
    isConnected,
    
    // Chat subscriptions
    subscribeToChatTopics,
    unsubscribeFromChatTopics,
    
    // Messaging
    sendMessage,
    sendTypingStatus,
    
    // Connection management
    reconnect: initializeWebSocket
  };
};

export default useStudentChatWebSocket;