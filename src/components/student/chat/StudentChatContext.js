import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import StudentChatService from './StudentChatService';
import useStudentChatWebSocket from './useStudentChatWebSocket';
import { STUDENT_CHAT_CONSTANTS } from './StudentChatConstants';

// Initial state
const initialState = {
  // Chat data
  chats: [],
  selectedChat: null,
  messages: [],
  
  // User data
  currentUser: null,
  avatars: {},
  contacts: [],
  
  // UI state
  loading: false,
  error: null,
  isTyping: false,
  typingUsers: {},
  
  // WebSocket state
  isConnected: false,
  
  // Filters and search
  searchTerm: '',
  filter: 'ALL',
  
  // Statistics
  unreadCount: 0,
  chatStats: null
};

// Action types
const ActionTypes = {
  // Loading states
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Chat management
  SET_CHATS: 'SET_CHATS',
  SET_SELECTED_CHAT: 'SET_SELECTED_CHAT',
  UPDATE_CHAT: 'UPDATE_CHAT',
  REMOVE_CHAT: 'REMOVE_CHAT',
  
  // Messages
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  REMOVE_MESSAGE: 'REMOVE_MESSAGE',
  
  // Users and avatars
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  SET_AVATARS: 'SET_AVATARS',
  SET_CONTACTS: 'SET_CONTACTS',
  UPDATE_AVATAR: 'UPDATE_AVATAR',
  
  // Typing status
  SET_TYPING: 'SET_TYPING',
  SET_TYPING_USERS: 'SET_TYPING_USERS',
  
  // WebSocket
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  
  // Filters
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTER: 'SET_FILTER',
  
  // Statistics
  SET_CHAT_STATS: 'SET_CHAT_STATS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT'
};

// Reducer function
function studentChatReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
      
    case ActionTypes.SET_CHATS:
      return { ...state, chats: action.payload, loading: false };
      
    case ActionTypes.SET_SELECTED_CHAT:
      return { ...state, selectedChat: action.payload };
      
    case ActionTypes.UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.chatId === action.payload.chatId ? { ...chat, ...action.payload } : chat
        )
      };
      
    case ActionTypes.REMOVE_CHAT:
      return {
        ...state,
        chats: state.chats.filter(chat => chat.chatId !== action.payload),
        selectedChat: state.selectedChat?.chatId === action.payload ? null : state.selectedChat
      };
      
    case ActionTypes.SET_MESSAGES:
      return { ...state, messages: action.payload };
      
    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
      
    case ActionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload } : msg
        )
      };
      
    case ActionTypes.REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(msg => msg.id !== action.payload)
      };
      
    case ActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
      
    case ActionTypes.SET_AVATARS:
      return { ...state, avatars: action.payload };
      
    case ActionTypes.UPDATE_AVATAR:
      return {
        ...state,
        avatars: { ...state.avatars, [action.payload.userId]: action.payload.avatarUrl }
      };
      
    case ActionTypes.SET_CONTACTS:
      return { ...state, contacts: action.payload };
      
    case ActionTypes.SET_TYPING:
      return { ...state, isTyping: action.payload };
      
    case ActionTypes.SET_TYPING_USERS:
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [action.payload.chatId]: action.payload.users }
      };
      
    case ActionTypes.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };
      
    case ActionTypes.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
      
    case ActionTypes.SET_FILTER:
      return { ...state, filter: action.payload };
      
    case ActionTypes.SET_CHAT_STATS:
      return { ...state, chatStats: action.payload };
      
    case ActionTypes.SET_UNREAD_COUNT:
      return { ...state, unreadCount: action.payload };
      
    default:
      return state;
  }
}

// Create context
const StudentChatContext = createContext();

// Provider component
export const StudentChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentChatReducer, initialState);

  // WebSocket hooks
  const {
    isConnected,
    subscribeToChatTopics,
    unsubscribeFromChatTopics,
    sendMessage: sendWebSocketMessage,
    sendTypingStatus
  } = useStudentChatWebSocket({
    onNewMessage: handleNewMessage,
    onTypingStatusChange: handleTypingStatusChange,
    onConnectionStatusChange: handleConnectionStatusChange,
    onError: handleWebSocketError
  });

  // WebSocket event handlers
  function handleNewMessage(messageData) {
    dispatch({ type: ActionTypes.ADD_MESSAGE, payload: messageData });
    
    // Update chat list with new message
    if (messageData.chatId) {
      dispatch({
        type: ActionTypes.UPDATE_CHAT,
        payload: {
          chatId: messageData.chatId,
          lastMessage: messageData,
          updatedAt: messageData.createdAt
        }
      });
    }
  }

  function handleTypingStatusChange(typingData) {
    const { chatId, userId, isTyping } = typingData;
    
    dispatch({
      type: ActionTypes.SET_TYPING_USERS,
      payload: {
        chatId,
        users: isTyping ? [userId] : []
      }
    });
  }

  function handleConnectionStatusChange(connected) {
    dispatch({ type: ActionTypes.SET_CONNECTION_STATUS, payload: connected });
  }

  function handleWebSocketError(error) {
    console.error('WebSocket error:', error);
    toast.error(error);
  }

  // Initialize current user on mount
  useEffect(() => {
    const userId = StudentChatService.getCurrentUserId();
    const username = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USERNAME);
    const role = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.ROLE);
    
    if (userId && username && role) {
      dispatch({
        type: ActionTypes.SET_CURRENT_USER,
        payload: { userId, username, role }
      });
    }
  }, []);

  // Actions
  const actions = {
    // Loading and error management
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),

    // Chat management
    loadChats: async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const chats = await StudentChatService.getAllChats();
        dispatch({ type: ActionTypes.SET_CHATS, payload: chats });
        
        // Calculate unread count
        const totalUnread = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
        dispatch({ type: ActionTypes.SET_UNREAD_COUNT, payload: totalUnread });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
      }
    },

    selectChat: async (chat) => {
      try {
        dispatch({ type: ActionTypes.SET_SELECTED_CHAT, payload: chat });
        
        if (chat?.chatId) {
          // Load messages
          const chatDetail = await StudentChatService.getChatDetail(chat.chatId);
          dispatch({ type: ActionTypes.SET_MESSAGES, payload: chatDetail.messages || [] });
          
          // Subscribe to WebSocket topics
          subscribeToChatTopics(chat.chatId);
          
          // Mark as read
          try {
            await StudentChatService.markAsRead(chat.chatId);
          } catch (error) {
            console.warn('Failed to mark as read:', error);
          }
        }
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
      }
    },

    // Message management
    sendMessage: async (content, file, messageType = 'TEXT') => {
      try {
        if (!state.selectedChat?.chatId) {
          throw new Error('No chat selected');
        }

        let sentMessage;
        if (messageType === 'TEXT') {
          sentMessage = await StudentChatService.sendTextMessage(
            state.selectedChat.chatId,
            content,
            messageType
          );
        } else {
          sentMessage = await StudentChatService.sendMediaMessage(
            state.selectedChat.chatId,
            file,
            messageType
          );
        }

        dispatch({ type: ActionTypes.ADD_MESSAGE, payload: sentMessage });
        
        // Update chat list
        dispatch({
          type: ActionTypes.UPDATE_CHAT,
          payload: {
            chatId: state.selectedChat.chatId,
            lastMessage: sentMessage,
            updatedAt: sentMessage.createdAt
          }
        });

        return sentMessage;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
        throw error;
      }
    },

    deleteMessage: async (messageId) => {
      try {
        if (!state.selectedChat?.chatId) return;

        await StudentChatService.deleteMessage(state.selectedChat.chatId, messageId);
        dispatch({ type: ActionTypes.REMOVE_MESSAGE, payload: messageId });
        toast.success(STUDENT_CHAT_CONSTANTS.SUCCESS.MESSAGE_DELETED);
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
      }
    },

    // Contact management
    loadContacts: async () => {
      try {
        const contacts = await StudentChatService.getAvailableContacts();
        dispatch({ type: ActionTypes.SET_CONTACTS, payload: contacts });
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
      }
    },

    // Avatar management
    loadAvatar: async (userId) => {
      try {
        const avatarData = await StudentChatService.getUserAvatar(userId);
        if (avatarData?.avatarUrl) {
          dispatch({
            type: ActionTypes.UPDATE_AVATAR,
            payload: { userId, avatarUrl: avatarData.avatarUrl }
          });
        }
      } catch (error) {
        console.warn('Failed to load avatar for user', userId, error);
      }
    },

    // Chat creation
    createIndividualChat: async (participantId, initialMessage = '') => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const newChat = await StudentChatService.createIndividualChat(participantId, initialMessage);
        
        // Reload chats to include the new one
        await actions.loadChats();
        
        // Select the new chat
        await actions.selectChat(newChat);
        
        toast.success(STUDENT_CHAT_CONSTANTS.SUCCESS.CHAT_CREATED);
        return newChat;
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
        throw error;
      }
    },

    // Group management
    leaveGroup: async (chatId) => {
      try {
        await StudentChatService.leaveGroup(chatId);
        dispatch({ type: ActionTypes.REMOVE_CHAT, payload: chatId });
        toast.success(STUDENT_CHAT_CONSTANTS.SUCCESS.LEFT_GROUP);
        
        // Reload chats
        await actions.loadChats();
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        toast.error(error.message);
      }
    },

    // Typing management
    setTyping: (isTyping) => {
      dispatch({ type: ActionTypes.SET_TYPING, payload: isTyping });
      
      if (state.selectedChat?.chatId) {
        sendTypingStatus(state.selectedChat.chatId, isTyping);
      }
    },

    // Filter management
    setSearchTerm: (term) => dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term }),
    setFilter: (filter) => dispatch({ type: ActionTypes.SET_FILTER, payload: filter }),

    // Statistics
    loadChatStats: async () => {
      try {
        const stats = await StudentChatService.getChatStats();
        dispatch({ type: ActionTypes.SET_CHAT_STATS, payload: stats });
      } catch (error) {
        console.warn('Failed to load chat stats:', error);
      }
    }
  };

  const value = {
    ...state,
    actions,
    isConnected
  };

  return (
    <StudentChatContext.Provider value={value}>
      {children}
    </StudentChatContext.Provider>
  );
};

// Hook to use context
export const useStudentChat = () => {
  const context = useContext(StudentChatContext);
  if (!context) {
    throw new Error('useStudentChat must be used within a StudentChatProvider');
  }
  return context;
};

export default StudentChatContext;