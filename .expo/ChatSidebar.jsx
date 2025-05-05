window.global = window;
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Ban, Video, Edit, Archive, ChevronDown, Settings, Filter } from 'lucide-react';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatSidebar = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');


  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please login first.");
        }

        const socket = new SockJS(`${baseUrl}/ws?token=${token}`);
        const stompClient = Stomp.over(socket);

        stompClient.connect(
          {
            'Authorization': `Bearer ${token}`
          },
          (frame) => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/chat/admin', (message) => {
              const data = JSON.parse(message.body);
              updateChatList(data);
            });
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            toast.error("Failed to connect to chat service");
          }
        );

        return stompClient;
      } catch (err) {
        console.error('WebSocket setup error:', err);
        toast.error(err.message || "Failed to setup chat connection");
        return null;
      }
    };

    const fetchChats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No token found, please login first.");
        }

        const response = await fetch(`${baseUrl}/api/admin/chat`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        
        const data = await response.json();
        setChats(data);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError(err.message);
        toast.error(err.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    const stompClient = connectWebSocket();
    fetchChats();

    // Cleanup WebSocket connection
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  const updateChatList = (newMessage) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.chatId === newMessage.chatId);
      if (chatIndex === -1) return prevChats;

      const updatedChats = [...prevChats];
      updatedChats[chatIndex] = {
        ...updatedChats[chatIndex],
        lastMessage: newMessage,
        updatedAt: new Date()
      };

      return updatedChats.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    });
  };

  const getFilteredChats = () => {
    return chats
      .filter(chat => {
        const searchMatch = chat.participants.some(participant => 
          participant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filter === 'ALL') return searchMatch;
        return searchMatch && chat.participants.some(p => p.role === filter);
      });
  };

  const formatLastSeen = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now - messageDate) / 1000 / 60);

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ`;
    return format(messageDate, 'dd/MM/yyyy', { locale: vi });
  };

  if (loading) return (
    <div className="w-[360px] h-screen flex items-center justify-center">
      <div className="text-emerald-500">Đang tải...</div>
    </div>
  );

  if (error) return (
    <div className="w-[360px] h-screen flex items-center justify-center">
      <div className="text-red-500 px-4 text-center">{error}</div>
    </div>
  );

  const filteredChats = getFilteredChats();

  return (
    <div className="w-[360px] bg-white border-r flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/api/placeholder/40/40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-xl font-bold">Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm trên Messenger"
            className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-full pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-1 
              ${filter === 'ALL' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            Tất cả tin nhắn <ChevronDown className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setFilter('INSTRUCTOR')}
            className={`px-3 py-1 text-sm rounded-full transition-colors
              ${filter === 'INSTRUCTOR' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            Instructor
          </button>
          <button 
            onClick={() => setFilter('STUDENT')}
            className={`px-3 py-1 text-sm rounded-full transition-colors
              ${filter === 'STUDENT' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
          >
            Student
          </button>
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Không có cuộc trò chuyện nào</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherParticipant = chat.participants.find(p => p.role !== 'ADMIN');
            const lastMessage = chat.lastMessage;
            
            return (
              <div
                key={chat.chatId}
                onClick={() => setActiveUser(chat.chatId)}
                className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                  activeUser === chat.chatId ? 'bg-gray-100' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={otherParticipant?.avatar || '/api/placeholder/48/48'}
                    alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                    className="w-14 h-14 rounded-full"
                  />
                  <span
                    className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      otherParticipant?.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate text-gray-900">
                      {`${otherParticipant?.firstName || ''} ${otherParticipant?.lastName || ''}`}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatLastSeen(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage?.content || 'Bắt đầu cuộc trò chuyện'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t grid grid-cols-4 gap-2">
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Archive className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">Lưu trữ</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Ban className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">Chặn</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Filter className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">Bộ lọc</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-6 h-6 text-gray-600" />
          <span className="text-xs text-gray-600">Cài đặt</span>
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;