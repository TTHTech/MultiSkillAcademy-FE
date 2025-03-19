import React, { useState, useEffect } from 'react';
import { Search, Shield, BookOpen, User } from 'lucide-react';
import axios from 'axios';

const ChatSidebar = ({ onSelectChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Lấy ID người dùng từ localStorage
  const currentUserId = parseInt(localStorage.getItem('userId'));

  // Lấy danh sách cuộc trò chuyện khi component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get('http://localhost:8080/api/student/chat', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setChats(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    
    // Thiết lập polling để cập nhật danh sách chat định kỳ (tùy chọn)
    const intervalId = setInterval(fetchChats, 30000); // Cập nhật mỗi 30 giây
    
    return () => clearInterval(intervalId);
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length > 2) {
      try {
        setLoading(true);
        
        const response = await axios.get(`http://localhost:8080/api/student/chat/search-users`, {
          params: { keyword: value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  // Bắt đầu hoặc tiếp tục chat với một người dùng
  const startOrContinueChat = async (userId) => {
    try {
      setLoading(true);
      
      // Kiểm tra xem đã có cuộc trò chuyện với người dùng này chưa
      const existingChat = chats.find(chat => 
        chat.participants.some(p => p.userId === userId)
      );
      
      if (existingChat) {
        onSelectChat(existingChat.chatId);
      } else {
        // Tạo cuộc trò chuyện mới
        const response = await axios.post('http://localhost:8080/api/student/chat', {
          chatType: 'INDIVIDUAL',
          recipientId: userId
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Thêm cuộc trò chuyện mới và chọn nó
        if (response.data) {
          setChats(prevChats => [...prevChats, response.data]);
          onSelectChat(response.data.chatId);
        }
      }
      
      // Đóng kết quả tìm kiếm
      setShowSearchResults(false);
      setSearchTerm('');
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format thời gian hiện thị
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Nếu dưới 24h, hiển thị giờ:phút
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } 
    // Nếu dưới 7 ngày, hiển thị tên ngày
    else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    // Còn lại hiển thị ngày/tháng
    else {
      return date.toLocaleDateString();
    }
  };

  // Icon dựa vào role
  const getRoleIcon = (role) => {
    if (role === 'ADMIN') {
      return <Shield className="w-5 h-5 text-red-500" />;
    }
    return <BookOpen className="w-5 h-5 text-green-500" />;
  };

  // Hàm lấy tên người nhận trong chat (không phải người dùng hiện tại)
  const getChatName = (chat) => {
    // Lọc ra người tham gia không phải bản thân
    const otherParticipants = chat.participants.filter(p => p.userId !== currentUserId);
    
    if (otherParticipants.length > 0) {
      const participant = otherParticipants[0];
      return `${participant.firstName} ${participant.lastName}`;
    }
    
    return 'Chat Room';
  };

  // Lấy role của người nhận (cho biểu tượng)
  const getChatRole = (chat) => {
    const otherParticipants = chat.participants.filter(p => p.userId !== currentUserId);
    
    if (otherParticipants.length > 0) {
      return otherParticipants[0].role;
    }
    
    return 'INSTRUCTOR';
  };

  // Đếm tin nhắn chưa đọc
  const getUnreadCount = (chat) => {
    if (chat.lastMessage && 
        !chat.lastMessage.isRead && 
        chat.lastMessage.senderId !== currentUserId) {
      return 1;
    }
    return 0;
  };

  if (loading && chats.length === 0) {
    return (
      <div className="w-80 border-r bg-white flex justify-center items-center">
        <div className="p-4">Loading conversations...</div>
      </div>
    );
  }

  if (error && chats.length === 0) {
    return (
      <div className="w-80 border-r bg-white">
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      {/* Hiển thị kết quả tìm kiếm */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="border-b py-2">
          <h3 className="px-4 py-1 text-sm font-medium text-gray-500">Kết quả tìm kiếm</h3>
          {searchResults.map((user) => (
            <div
              key={user.userId}
              className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => startOrContinueChat(user.userId)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {getRoleIcon(user.role)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'ADMIN' ? 'Admin Support' : 'Course Instructor'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Hiển thị danh sách chat */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 68px)' }}>
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            className={`flex items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
              selectedChatId === chat.chatId ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectChat(chat.chatId)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {getRoleIcon(getChatRole(chat))}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{getChatName(chat)}</p>
                  <p className="text-sm text-gray-500 truncate" style={{ maxWidth: '180px' }}>
                    {chat.lastMessage ? chat.lastMessage.content : 'Bắt đầu cuộc trò chuyện'}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {chat.lastMessage ? formatTimestamp(chat.lastMessage.createdAt) : formatTimestamp(chat.createdAt)}
                  </span>
                  {getUnreadCount(chat) > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                      {getUnreadCount(chat)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getChatRole(chat) === 'ADMIN' ? 'Admin Support' : 'Course Instructor'}
              </div>
            </div>
          </div>
        ))}
        
        {chats.length === 0 && !loading && (
          <div className="p-4 text-center text-gray-500">
            <p>Chưa có cuộc trò chuyện nào</p>
            <p className="text-sm mt-2">Tìm kiếm giảng viên hoặc admin để bắt đầu chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;