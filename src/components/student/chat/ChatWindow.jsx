import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Trash2, FileUp, Send, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ChatInput from './ChatInput';

const ChatWindow = ({ selectedUser, chatId, chatData }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const messagesEndRef = useRef(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [avatars, setAvatars] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Lấy và format tin nhắn khi chatData thay đổi
  useEffect(() => {
    if (chatData?.chatId) {
      setLoading(true);
      fetchMessages(chatData.chatId)
        .finally(() => setLoading(false));
    } else {
      setMessages([]);
    }
  }, [chatData]);

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

  // Hàm mới: Đảm bảo URL file đầy đủ và hợp lệ
  const getFullFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    
    // Log để debug
    console.log("Processing file URL:", fileUrl);
    if (fileUrl && fileUrl.includes('%20')) {
      // URL đã được encode - cần giữ nguyên format
      return fileUrl.startsWith('http') ? fileUrl : `http://localhost:8080${fileUrl.startsWith('/') ? '' : '/api/student/chat/files/'}${fileUrl}`;
    }
    
    // Chuyển hướng từ API instructor sang API student
    // if (fileUrl && fileUrl.includes('/api/instructor/chat/files/')) {
    //   const fileName = fileUrl.split('/').pop();
    //   return `http://localhost:8080/api/student/chat/files/${fileName}`;
    // }
    
    // Chuyển hướng từ API admin sang API student
    if (fileUrl && fileUrl.includes('/api/student/chat/files/')) {
      const fileName = fileUrl.split('/').pop();
      return `http://localhost:8080/api/admin/chat/files/${fileName}`;
    }
    
    // Chuyển hướng tương tự cho các URL ngắn (image_XXXX)
    // Sửa tại ChatWindow.jsx
    if (fileUrl && fileUrl.includes('image_')) {
      const imageId = fileUrl.includes('/') ? fileUrl.split('/').pop() : fileUrl;
      return `http://localhost:8080/api/admin/chat/files/${imageId}`;
    }
    
    // Các trường hợp khác giữ nguyên
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    
    if (fileUrl.startsWith('/api/')) {
      return `http://localhost:8080${fileUrl}`;
    }

    if (fileUrl.includes('/uploads/')) {
      return `http://localhost:8080${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    }
    
    if (!fileUrl.includes('/') && !fileUrl.includes(':\\')) {
      return `http://localhost:8080/uploads/${fileUrl}`;
    }
    
    return fileUrl;
  };

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
        console.warn(`Không thể tải ảnh cho người dùng ${userId}`);
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

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      // Sử dụng API student để lấy tin nhắn
      const response = await fetch(`http://localhost:8080/api/student/chat/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setMessages([]);
          return [];
        }
        throw new Error(`Không thể tải tin nhắn (${response.status})`);
      }

      const messageData = await response.json();
      console.log("Raw message data:", messageData); // Log để debug

      const formattedMessages = messageData.map(msg => {
        // Xử lý nếu content là chuỗi JSON
        let messageContent = msg.content;
        try {
          // Kiểm tra nếu content là JSON string, thì parse để lấy trường message
          const parsedContent = JSON.parse(msg.content);
          if (parsedContent && typeof parsedContent === 'object' && parsedContent.message) {
            messageContent = parsedContent.message;
          }
        } catch (e) {
          // Nếu không phải JSON, giữ nguyên content
        }

        // Format timestamp từ server - sử dụng createdAt
        const serverTimestamp = formatServerTimestamp(msg.createdAt);

        // Fetch avatar if needed
        if (msg.senderId) {
          fetchUserAvatar(msg.senderId);
        }

        // Đảm bảo URL file đầy đủ
        const fullFileUrl = getFullFileUrl(msg.fileUrl);

        return {
          id: msg.messageId,
          message: messageContent,
          isAdmin: msg.senderId === parseInt(localStorage.getItem("userId")),
          avatar: msg.senderAvatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
          timestamp: serverTimestamp, // Timestamp đã format từ server
          createdAt: msg.createdAt, // Lưu giá trị gốc để debug
          senderId: msg.senderId,
          senderName: msg.senderName,
          messageType: msg.messageType || 'TEXT',
          fileUrl: fullFileUrl
        };
      });
      
      setMessages(formattedMessages);
      setTimeout(scrollToBottom, 100);
      return formattedMessages;
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error(err.message);
      return [];
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRightClick = (e, messageId) => {
    e.preventDefault();
    if (messages.find(m => m.id === messageId)?.isAdmin) {
      setSelectedMessageId(messageId);
      setContextMenuPosition({ top: e.clientY, left: e.clientX });
      setShowContextMenu(true);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      if (!chatData?.chatId || !selectedMessageId) return;
      
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `http://localhost:8080/api/student/chat/${chatData.chatId}/messages/${selectedMessageId}`, 
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa tin nhắn");
      }

      // Xóa tin nhắn khỏi state
      setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
      toast.success("Đã xóa tin nhắn");
      
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error(err.message);
    } finally {
      setShowContextMenu(false);
    }
  };

  // Gửi tin nhắn
  const addMessage = async (content, fileUrl = null, messageType = 'TEXT') => {
    try {
      if (!chatData?.chatId || !selectedUser) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      // Trích xuất tin nhắn từ content (có thể là string hoặc object)
      let messageContent = "";
      if (typeof content === 'object') {
        // Nếu content là object có trường message, sử dụng nó
        if (content.message) {
          messageContent = content.message;
        } else {
          // Nếu không có trường message, chuyển đổi cả object thành string
          messageContent = JSON.stringify(content);
        }
      } else {
        // Nếu content là string, sử dụng trực tiếp
        messageContent = String(content || "");
      }

      // Đảm bảo URL file đầy đủ
      let processedFileUrl = getFullFileUrl(fileUrl);

      // RÚT GỌN fileUrl NẾU QUÁ DÀI
      let shortenedFileUrl = processedFileUrl;
      if (processedFileUrl && processedFileUrl.length > 200) {
        // Chỉ lấy phần tên file từ URL đầy đủ
        const urlParts = processedFileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        shortenedFileUrl = `/api/student/chat/files/${fileName}`;
        console.log("URL gốc quá dài, đã rút gọn thành:", shortenedFileUrl);
      }

      // Tạo timestamp tạm cho tin nhắn trước khi gửi
      const currentTimestamp = getCurrentTimeString();
      
      // Hiển thị tin nhắn tạm thời ngay lập tức
      const tempId = "temp-" + Date.now();
      const tempMessage = {
        id: tempId,
        message: messageContent,
        isAdmin: true,
        avatar: localStorage.getItem("userAvatar") || null,
        timestamp: currentTimestamp,
        senderId: parseInt(localStorage.getItem("userId")),
        messageType: messageType,
        fileUrl: processedFileUrl // Sử dụng URL đã xử lý
      };
      setMessages(prev => [...prev, tempMessage]);

      // Chuẩn bị dữ liệu đúng định dạng cho API
      const messageRequest = {
        content: messageContent,
        messageType: messageType,
        fileUrl: shortenedFileUrl || null // Sử dụng URL đã rút gọn
      };

      console.log("Sending message data:", messageRequest);

      // Send to server
      const response = await fetch(`http://localhost:8080/api/student/chat/${chatData.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageRequest)
      });

      if (!response.ok) {
        throw new Error(`Không thể gửi tin nhắn (${response.status})`);
      }

      // Lấy tin nhắn đã gửi từ response
      const sentMessage = await response.json();
      console.log("Server response for sent message:", sentMessage); // Log để debug
      
      // Đảm bảo URL file đầy đủ cho tin nhắn đã gửi
      let updatedFileUrl = sentMessage.fileUrl;
      if (updatedFileUrl) {
        updatedFileUrl = getFullFileUrl(updatedFileUrl);
      }
      
      // Cập nhật tin nhắn tạm thời với id thật và timestamp từ server
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? {
          ...msg,
          id: sentMessage.messageId,
          message: sentMessage.content || msg.message,
          // Sử dụng timestamp từ server nếu có
          timestamp: formatServerTimestamp(sentMessage.createdAt) || currentTimestamp,
          createdAt: sentMessage.createdAt,
          fileUrl: updatedFileUrl || msg.fileUrl
        } : msg
      ));

      // Cuộn xuống sau khi gửi tin nhắn
      setTimeout(scrollToBottom, 100);
      return sentMessage;

    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.message);
      // Xóa tin nhắn tạm nếu gửi thất bại
      setMessages(prev => prev.filter(msg => !msg.id.toString().startsWith("temp-")));
      throw err;
    }
  };

  // Send typing status
  const sendTypingStatus = (isTyping) => {
    if (!chatData?.chatId) return;
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return;
    
    try {
      // Đây là ví dụ - phần này cần được triển khai qua WebSocket
      const typingData = {
        chatId: chatData.chatId,
        userId: parseInt(userId),
        isTyping: isTyping
      };
      
      // Gửi qua WebSocket nếu được cấu hình
      // if (stompClient && stompClient.connected) {
      //   stompClient.send('/app/student/chat.typing', {}, JSON.stringify(typingData));
      // }
    } catch (err) {
      console.error("Error sending typing status:", err);
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'ROLE_ADMIN': return 'Quản trị viên';
      case 'INSTRUCTOR': return 'Giảng viên';
      case 'ROLE_INSTRUCTOR': return 'Giảng viên';
      case 'STUDENT': return 'Học viên';
      case 'ROLE_STUDENT': return 'Học viên';
      default: return role;
    }
  };

  const enlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const ChatHeader = () => {
    // Ưu tiên sử dụng avatar từ state nếu có
    const userAvatar = selectedUser && avatars[selectedUser.userId] 
      ? avatars[selectedUser.userId] 
      : selectedUser?.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";
      
    return (
      <div className="bg-blue-500 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">
              {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Chat'}
            </h3>
            <span className="text-sm text-blue-50">
              {isTyping ? 'Đang nhập...' : selectedUser ? getRoleText(selectedUser.role) : 'Đang hoạt động'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
            <Phone className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
            <Video className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-blue-600 rounded-full transition-colors">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const ChatMessage = ({ id, message, isAdmin, avatar, timestamp, createdAt, senderName, messageType, fileUrl, senderId }) => {
    // Ưu tiên sử dụng avatar từ state
    const userAvatar = avatars[senderId] || avatar;
    
    // Thêm state để theo dõi trạng thái tải hình ảnh
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    
    return (
      <div 
        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}
        onContextMenu={(e) => handleRightClick(e, id)}
      >
        <div className={`flex ${isAdmin ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
          {!isAdmin && (
            <img 
              src={userAvatar} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full mr-2 mb-1 object-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
              }}
            />
          )}
          <div>
            {messageType === 'IMAGE' ? (
              <div className={`rounded-2xl overflow-hidden ${isAdmin ? 'ml-2' : ''} bg-gray-100`}>
                {!imgLoaded && !imgError && (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
                {imgError ? (
                  <div className="w-48 h-48 flex items-center justify-center bg-gray-200 text-gray-500 text-sm p-4 text-center">
                    Không thể tải hình ảnh
                  </div>
                ) : (
                  <img 
                    src={fileUrl} 
                    alt="Shared image" 
                    className={`max-w-full h-auto max-h-64 rounded-2xl cursor-pointer ${imgLoaded ? 'block' : 'hidden'}`}
                    onClick={() => enlargeImage(fileUrl)}
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                      console.error("Image failed to load:", fileUrl);
                      setImgError(true);
                      setImgLoaded(false);
                    }} 
                  />
                )}
              </div>
            ) : messageType === 'VIDEO' ? (
              <div className={`rounded-2xl overflow-hidden ${isAdmin ? 'ml-2' : ''}`}>
                <video 
                  src={fileUrl} 
                  controls
                  className="max-w-full h-auto max-h-64 rounded-2xl"
                  onError={(e) => {
                    console.error("Video failed to load:", fileUrl);
                    e.target.onerror = null;
                    // Hiển thị message lỗi thay vì video không load được
                    e.target.parentNode.innerHTML = `<div class="bg-gray-200 p-3 rounded-2xl text-sm text-gray-500">Video không thể hiển thị</div>`;
                  }}
                />
              </div>
            ) : messageType === 'FILE' || messageType === 'DOCUMENT' ? (
              <div
              className={`p-3 rounded-2xl ${
                isAdmin
                  ? 'bg-blue-500 text-white ml-2'
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
                <span className="flex flex-col">
                  <span>{message || "Tập tin đính kèm"}</span>
                  <span className="text-xs mt-1 text-gray-300 break-all">{fileUrl}</span>
                </span>
              </a>
            </div>
            ) : (
              <div
                className={`p-3 rounded-2xl ${
                  isAdmin
                    ? 'bg-blue-500 text-white ml-2'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}
            <div className={`mt-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
              <span className="text-xs text-gray-500">
                {timestamp || getCurrentTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyChat = () => {
    // Ưu tiên sử dụng avatar từ state
    const userAvatar = selectedUser && avatars[selectedUser.userId] 
      ? avatars[selectedUser.userId] 
      : selectedUser?.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";
    
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {selectedUser ? (
          <>
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-32 h-32 rounded-full mb-4 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
              }}
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {`${selectedUser.firstName} ${selectedUser.lastName}`}
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              {getRoleText(selectedUser.role)}
            </p>
            <p className="text-sm text-gray-500">Hãy bắt đầu cuộc trò chuyện</p>
          </>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/192262/chat.svg"
              alt="Empty Chat"
              className="w-32 h-32 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có cuộc trò chuyện nào
            </h3>
            <p className="text-sm text-gray-500">
              Chọn một người dùng từ danh sách bên trái để bắt đầu chat
            </p>
          </>
        )}
      </div>
    );
  };

  // Load avatar for selected user
  useEffect(() => {
    if (selectedUser && selectedUser.userId) {
      fetchUserAvatar(selectedUser.userId);
    }
  }, [selectedUser]);

  return (
    <div className="flex flex-col h-screen bg-white relative">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={msg.id || index} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>

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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x600?text=Image+not+available";
              }}
            />
          </div>
        </div>
      )}

      {/* Context Menu for Message Actions */}
      {showContextMenu && (
        <div 
          className="absolute bg-white shadow-lg rounded-md py-2 z-50"
          style={{ 
            top: Math.min(contextMenuPosition.top, window.innerHeight - 100), 
            left: Math.min(contextMenuPosition.left, window.innerWidth - 150) 
          }}
        >
          <button 
            className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
            onClick={handleDeleteMessage}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa tin nhắn
          </button>
        </div>
      )}

      {/* Click anywhere to close context menu */}
      {showContextMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowContextMenu(false)}
        />
      )}

      <ChatInput 
  addMessage={addMessage} 
  setIsTyping={(isTyping) => {
    setIsTyping(isTyping);
    sendTypingStatus(isTyping);
  }} 
  disabled={!selectedUser || !chatData}
  chatId={chatData?.chatId} // Thêm dòng này để truyền chatId
/>
    </div>
  );
};

export default ChatWindow;