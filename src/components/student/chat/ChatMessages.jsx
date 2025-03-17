import React, { useState, useEffect, useRef } from 'react';
import { User, Shield, BookOpen, FileUp, X } from 'lucide-react';
import axios from 'axios';

// Lưu trữ các callback để cập nhật tin nhắn
const messageCallbacks = new Set();

const ChatMessages = ({ chatId, newMessage }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingStatus, setTypingStatus] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [avatars, setAvatars] = useState({});
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const previousMessageIdsRef = useRef(new Set());
  const fetchMessagesRef = useRef(null);
  
  // Lấy ID của người dùng hiện tại từ localStorage
  const currentUserId = parseInt(localStorage.getItem('userId'));

  // Format timestamp từ server datetime
  const formatServerTimestamp = (dateTimeString) => {
    if (!dateTimeString) return getCurrentTimeString();
    
    try {
      // Parse datetime string from server (YYYY-MM-DD HH:MM:SS.mmm)
      const date = new Date(dateTimeString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return getCurrentTimeString();
      }
      
      // Format to HH:MM
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return getCurrentTimeString();
    }
  };

  // Lấy thời gian hiện tại dạng chuỗi
  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Thiết lập polling để cập nhật tin nhắn định kỳ
  useEffect(() => {
    if (!chatId) return;
    
    // Reset messages và trạng thái khi chuyển đổi chat
    setMessages([]);
    setLoading(true);
    previousMessageIdsRef.current = new Set();
    
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/student/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Kiểm tra có dữ liệu không
        if (!response.data || !Array.isArray(response.data)) {
          setLoading(false);
          return;
        }
        
        // Format messages
        const formattedMessages = response.data.map(msg => {
          let messageContent = msg.content;
          try {
            const parsedContent = JSON.parse(msg.content);
            if (parsedContent && typeof parsedContent === 'object' && parsedContent.message) {
              messageContent = parsedContent.message;
            }
          } catch (e) {
            // Không phải JSON, giữ nguyên content
          }

          return {
            id: msg.messageId,
            message: messageContent,
            isAdmin: msg.senderRole && msg.senderRole.includes('ADMIN'),
            isInstructor: msg.senderRole && msg.senderRole.includes('INSTRUCTOR'),
            isCurrentUser: msg.senderId === currentUserId,
            avatar: msg.senderAvatar || getDefaultAvatar(msg.senderRole),
            timestamp: formatServerTimestamp(msg.createdAt),
            createdAt: msg.createdAt,
            senderId: msg.senderId,
            senderName: msg.senderName || getDefaultSenderName(msg.senderRole, msg.senderId === currentUserId),
            messageType: msg.messageType || 'TEXT',
            fileUrl: msg.fileUrl,
            senderRole: msg.senderRole
          };
        });
        
        // Kiểm tra xem có tin nhắn mới không
        const currentMessageIds = new Set(formattedMessages.map(msg => msg.id));
        const hasNewMessages = formattedMessages.some(msg => !previousMessageIdsRef.current.has(msg.id));
        
        // Cập nhật state tin nhắn nếu có tin nhắn mới
        if (hasNewMessages || messages.length === 0) {
          setMessages(formattedMessages);
          
          // Cập nhật danh sách ID tin nhắn đã biết
          previousMessageIdsRef.current = currentMessageIds;
          
          // Fetch avatars cho những tin nhắn mới
          formattedMessages.forEach(msg => {
            if (msg.senderId && !avatars[msg.senderId]) {
              fetchUserAvatar(msg.senderId);
            }
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Không thể tải tin nhắn');
        setLoading(false);
      }
    };
    
    // Lưu trữ fetchMessages vào ref để có thể gọi từ bên ngoài
    fetchMessagesRef.current = fetchMessages;
    
    // Fetch ngay lần đầu tiên
    fetchMessages();
    
    // Tăng thời gian polling lên 15 giây vì đã có cơ chế refresh khi gửi tin nhắn
    pollingIntervalRef.current = setInterval(fetchMessages, 15000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [chatId]);

  // Fetch user avatar
  const fetchUserAvatar = async (userId) => {
    try {
      if (!userId || avatars[userId]) return;
      
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/student/chat/users/${userId}/avatar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      if (data.avatarUrl) {
        setAvatars(prev => ({
          ...prev,
          [userId]: data.avatarUrl
        }));
      }
    } catch (err) {
      console.error(`Error fetching avatar for user ${userId}:`, err);
    }
  };

  // Get default avatar based on role
  const getDefaultAvatar = (role) => {
    if (role && role.includes('ADMIN')) {
      return "https://cdn-icons-png.flaticon.com/512/2206/2206368.png";
    } else if (role && role.includes('INSTRUCTOR')) {
      return "https://cdn-icons-png.flaticon.com/512/1995/1995515.png";
    }
    return "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";
  };

  // Get default sender name based on role
  const getDefaultSenderName = (role, isCurrentUser) => {
    if (isCurrentUser) {
      return 'Bạn';
    }
    
    if (role && role.includes('ADMIN')) {
      return 'Admin Support';
    }
    if (role && role.includes('INSTRUCTOR')) {
      return 'Course Instructor';
    }
    
    return 'Unknown User';
  };

  // Đăng ký callback khi component mount
  useEffect(() => {
    const updateMessages = (updater) => {
      setMessages(updater);
    };
    
    messageCallbacks.add(updateMessages);
    
    // Lưu trữ fetchMessages vào window để có thể gọi từ bên ngoài
    window.currentChatMessagesInstance = {
      fetchMessages: fetchMessagesRef.current
    };
    
    return () => {
      messageCallbacks.delete(updateMessages);
      if (window.currentChatMessagesInstance && 
          window.currentChatMessagesInstance.fetchMessages === fetchMessagesRef.current) {
        window.currentChatMessagesInstance = null;
      }
    };
  }, []);

  // Xử lý khi có tin nhắn mới được gửi từ component cha
  useEffect(() => {
    if (newMessage) {
      // Kiểm tra xem đây là tin nhắn tạm thời hay tin nhắn thật
      const isTempMessage = newMessage.messageId && newMessage.messageId.toString().startsWith('temp-');
      const tempId = newMessage.tempId; // Lấy tempId từ newMessage nếu có
      
      if (tempId) {
        // Đây là cập nhật cho tin nhắn tạm thời
        const existingTempIndex = messages.findIndex(msg => msg.id === tempId);
        
        if (existingTempIndex >= 0) {
          // Cập nhật tin nhắn tạm thời thành tin nhắn thật
          setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[existingTempIndex] = {
              id: newMessage.messageId,
              message: newMessage.content,
              isAdmin: newMessage.senderRole && newMessage.senderRole.includes('ADMIN'),
              isInstructor: newMessage.senderRole && newMessage.senderRole.includes('INSTRUCTOR'),
              isCurrentUser: newMessage.senderId === currentUserId,
              avatar: newMessage.senderAvatar || getDefaultAvatar(newMessage.senderRole),
              timestamp: formatServerTimestamp(newMessage.createdAt),
              createdAt: newMessage.createdAt,
              senderId: newMessage.senderId,
              senderName: newMessage.senderName || getDefaultSenderName(newMessage.senderRole, newMessage.senderId === currentUserId),
              messageType: newMessage.messageType || 'TEXT',
              fileUrl: newMessage.fileUrl,
              senderRole: newMessage.senderRole
            };
            return updatedMessages;
          });
        }
      } else if (isTempMessage) {
        // Đây là tin nhắn tạm thời mới
        const formattedMessage = {
          id: newMessage.messageId,
          message: newMessage.content,
          isCurrentUser: true,
          avatar: localStorage.getItem('userAvatar') || getDefaultAvatar('STUDENT'),
          timestamp: formatServerTimestamp(newMessage.createdAt),
          createdAt: newMessage.createdAt,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName || 'Bạn',
          messageType: newMessage.messageType || 'TEXT',
          fileUrl: newMessage.fileUrl,
          senderRole: 'STUDENT',
          isTemp: true
        };
        
        setMessages(prev => [...prev, formattedMessage]);
      } else if (!messages.some(msg => msg.id === newMessage.messageId)) {
        // Đây là tin nhắn thật mới
        const formattedMessage = {
          id: newMessage.messageId,
          message: newMessage.content,
          isAdmin: newMessage.senderRole && newMessage.senderRole.includes('ADMIN'),
          isInstructor: newMessage.senderRole && newMessage.senderRole.includes('INSTRUCTOR'),
          isCurrentUser: newMessage.senderId === currentUserId,
          avatar: newMessage.senderAvatar || getDefaultAvatar(newMessage.senderRole),
          timestamp: formatServerTimestamp(newMessage.createdAt),
          createdAt: newMessage.createdAt,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName || getDefaultSenderName(newMessage.senderRole, newMessage.senderId === currentUserId),
          messageType: newMessage.messageType || 'TEXT',
          fileUrl: newMessage.fileUrl,
          senderRole: newMessage.senderRole
        };
        
        setMessages(prev => [...prev, formattedMessage]);
        
        // Fetch avatar nếu cần
        if (newMessage.senderId && !avatars[newMessage.senderId]) {
          fetchUserAvatar(newMessage.senderId);
        }
      }
    }
  }, [newMessage, chatId]);

  // Cuộn xuống tin nhắn cuối cùng khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lấy icon dựa trên role
  const getIcon = (role) => {
    if (role && role.includes('ADMIN')) {
      return <Shield className="w-4 h-4 text-red-500" />;
    } else if (role && role.includes('INSTRUCTOR')) {
      return <BookOpen className="w-4 h-4 text-green-500" />;
    }
    return <User className="w-4 h-4 text-gray-500" />;
  };

  const enlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const ChatMessage = React.memo(({ id, message, isAdmin, isInstructor, isCurrentUser, avatar, timestamp, createdAt, senderName, messageType, fileUrl, senderId, senderRole }) => {
    // Ưu tiên sử dụng avatar từ state
    const userAvatar = avatars[senderId] || avatar;
    
    // Kiểm tra file URL hợp lệ
    const isValidFileUrl = fileUrl && typeof fileUrl === 'string' && fileUrl.trim() !== '';
    
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
          {!isCurrentUser && (
            <div className="flex flex-col items-center mr-2 mb-1">
              <img src={userAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-xs text-gray-500 mt-1">{senderName}</span>
            </div>
          )}
          <div>
            {messageType === 'IMAGE' && isValidFileUrl ? (
              <div className={`rounded-2xl overflow-hidden ${isCurrentUser ? 'ml-2' : ''}`}>
                <img 
                  src={fileUrl} 
                  alt="Shared image" 
                  className="max-w-full h-auto max-h-64 rounded-2xl cursor-pointer"
                  onClick={() => enlargeImage(fileUrl)}
                  onError={(e) => {
                    console.error("Image failed to load:", fileUrl);
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Image+not+available";
                  }} 
                />
              </div>
            ) : messageType === 'VIDEO' && isValidFileUrl ? (
              <div className={`rounded-2xl overflow-hidden ${isCurrentUser ? 'ml-2' : ''}`}>
                <video 
                  src={fileUrl} 
                  controls
                  className="max-w-full h-auto max-h-64 rounded-2xl"
                  onError={(e) => {
                    console.error("Video failed to load:", fileUrl);
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `<div class="bg-gray-200 p-3 rounded-2xl text-sm text-gray-500">Video không thể hiển thị</div>`;
                  }}
                />
              </div>
            ) : (messageType === 'FILE' || messageType === 'DOCUMENT') && isValidFileUrl ? (
              <div
                className={`p-3 rounded-2xl ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white ml-2'
                    : isAdmin
                    ? 'bg-red-100 text-gray-900'
                    : isInstructor
                    ? 'bg-green-100 text-gray-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm"
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  {message || "Tập tin đính kèm"}
                </a>
              </div>
            ) : (
              <div
                className={`p-3 rounded-2xl ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white ml-2'
                    : isAdmin
                    ? 'bg-red-100 text-gray-900'
                    : isInstructor
                    ? 'bg-green-100 text-gray-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}
            <div className={`mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
              <span className="text-xs text-gray-500">
                {timestamp || getCurrentTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Sắp xếp tin nhắn theo thời gian
  const sortedMessages = React.useMemo(() => {
    return [...messages].sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Nếu không có chatId hoặc không có tin nhắn
  if (!chatId || (messages.length === 0 && !loading)) {
    return (
      <div className="flex-1 flex justify-center items-center bg-gray-50">
        <div className="text-gray-500">
          {chatId ? 'Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!' : 'Chọn một cuộc trò chuyện để xem tin nhắn'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {sortedMessages.map((msg) => (
        <ChatMessage key={`msg-${msg.id}`} {...msg} />
      ))}
      
      {/* Hiển thị trạng thái typing nếu có */}
      {typingStatus && typingStatus.isTyping && (
        <div className="flex items-center space-x-2 text-gray-500 text-sm ml-4">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div className="italic">{typingStatus.username || 'Someone'} đang nhập...</div>
        </div>
      )}
      
      {/* Điểm tham chiếu để cuộn đến tin nhắn cuối cùng */}
      <div ref={messagesEndRef} />
      
      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closeEnlargedImage}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                closeEnlargedImage();
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={enlargedImage} 
              alt="Enlarged" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Thêm phương thức refreshMessages cho component
ChatMessages.refreshMessages = () => {
  // Dùng window để lưu trữ tham chiếu đến instance hiện tại
  if (window.currentChatMessagesInstance && 
      window.currentChatMessagesInstance.fetchMessages) {
    window.currentChatMessagesInstance.fetchMessages();
  }
};

// Thêm các phương thức static để xử lý tin nhắn tạm thời
ChatMessages.addTempMessage = (tempMessage) => {
  const currentUserId = parseInt(localStorage.getItem('userId'));
  
  // Format tin nhắn tạm thời
  const formattedMessage = {
    id: tempMessage.messageId,
    message: tempMessage.content,
    isCurrentUser: true,
    avatar: localStorage.getItem('userAvatar') || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    createdAt: tempMessage.createdAt,
    senderId: currentUserId,
    senderName: tempMessage.senderName || 'Bạn',
    messageType: tempMessage.messageType || 'TEXT',
    fileUrl: tempMessage.fileUrl,
    senderRole: 'STUDENT',
    isTemp: true // Đánh dấu là tin nhắn tạm thời
  };
  
  // Cập nhật tất cả các instance của ChatMessages
  messageCallbacks.forEach(callback => {
    callback(prev => [...prev, formattedMessage]);
  });
};

ChatMessages.updateTempMessage = (tempId, realMessage) => {
  const currentUserId = parseInt(localStorage.getItem('userId'));
  
  // Cập nhật tất cả các instance của ChatMessages
  messageCallbacks.forEach(callback => {
    callback(prev => {
      const index = prev.findIndex(msg => msg.id === tempId);
      if (index === -1) return prev;
      
      const updatedMessages = [...prev];
      updatedMessages[index] = {
        id: realMessage.messageId,
        message: realMessage.content,
        isAdmin: realMessage.senderRole && realMessage.senderRole.includes('ADMIN'),
        isInstructor: realMessage.senderRole && realMessage.senderRole.includes('INSTRUCTOR'),
        isCurrentUser: realMessage.senderId === currentUserId,
        avatar: realMessage.senderAvatar || updatedMessages[index].avatar,
        timestamp: new Date(realMessage.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        createdAt: realMessage.createdAt,
        senderId: realMessage.senderId,
        senderName: realMessage.senderName || updatedMessages[index].senderName,
        messageType: realMessage.messageType || 'TEXT',
        fileUrl: realMessage.fileUrl,
        senderRole: realMessage.senderRole,
        isTemp: false
      };
      return updatedMessages;
    });
  });
};

ChatMessages.removeTempMessage = (tempId) => {
  // Xóa tin nhắn tạm thời khỏi tất cả các instance của ChatMessages
  messageCallbacks.forEach(callback => {
    callback(prev => prev.filter(msg => msg.id !== tempId));
  });
};

// Giữ lại phương thức refreshMessages để tương thích ngược
ChatMessages.refreshMessages = () => {
  // Không cần làm gì vì chúng ta đã xử lý tin nhắn tạm thời
};

export default ChatMessages;