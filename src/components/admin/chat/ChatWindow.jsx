import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Trash2, FileUp, Send, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ChatInput from './ChatInput';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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

  useEffect(() => {
    if (chatData?.chatId) {
      setLoading(true);
      fetchMessages(chatData.chatId)
        .finally(() => setLoading(false));
    } else {
      setMessages([]);
    }
  }, [chatData]);

  const formatServerTimestamp = (dateTimeString) => {
    if (!dateTimeString) return getCurrentTimeString();
    
    try {
      const date = new Date(dateTimeString);
      
      if (isNaN(date.getTime())) {
        return getCurrentTimeString();
      }
      
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return getCurrentTimeString();
    }
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getFullFileUrl = (fileUrl) => {
    if (!fileUrl) return null;
    
    console.log("Processing file URL:", fileUrl);
    
    // ✅ KIỂM TRA NẾU LÀ EXTERNAL URL (Firebase, HTTP, HTTPS) THÌ TRẢ VỀ NGUYÊN
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      console.log("External URL detected, returning as-is:", fileUrl);
      return fileUrl;
    }
    
    // ✅ KIỂM TRA NẾU LÀ FIREBASE URL BỊ MẤT PROTOCOL
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      const fullUrl = fileUrl.startsWith('https://') ? fileUrl : `https://${fileUrl}`;
      console.log("Firebase URL fixed:", fullUrl);
      return fullUrl;
    }
    
    // Chuyển hướng từ API instructor sang API admin cho local files
    if (fileUrl && fileUrl.includes('/api/instructor/chat/files/')) {
      const fileName = fileUrl.split('/').pop();
      return `${baseUrl}/api/admin/chat/files/${fileName}`;
    }
    
    // Chuyển hướng tương tự cho các URL ngắn (image_XXXX)
    if (fileUrl && fileUrl.includes('image_')) {
      const imageId = fileUrl.includes('/') ? fileUrl.split('/').pop() : fileUrl;
      return `${baseUrl}/api/admin/chat/files/${imageId}`;
    }
    
    // Xử lý local API URLs
    if (fileUrl.startsWith('/api/')) {
      return `${baseUrl}${fileUrl}`;
    }

    // Xử lý uploads folder
    if (fileUrl.includes('/uploads/')) {
      return `${baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    }
    
    // Default cho local files
    if (!fileUrl.includes('/') && !fileUrl.includes(':\\')) {
      return `${baseUrl}/uploads/${fileUrl}`;
    }
    
    return fileUrl;
  };

  const fetchUserAvatar = async (userId) => {
    try {
      if (!userId || avatars[userId]) return;
      
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${baseUrl}/api/admin/chat/users/${userId}/avatar`, {
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

      const response = await fetch(`${baseUrl}/api/admin/chat/${chatId}/messages`, {
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

      const formattedMessages = messageData.map(msg => {
        let messageContent = msg.content;
        try {
          const parsedContent = JSON.parse(msg.content);
          if (parsedContent && typeof parsedContent === 'object' && parsedContent.message) {
            messageContent = parsedContent.message;
          }
        } catch (e) {
          // Nếu không phải JSON, giữ nguyên content
        }

        const serverTimestamp = formatServerTimestamp(msg.createdAt);

        if (msg.senderId) {
          fetchUserAvatar(msg.senderId);
        }

        const fullFileUrl = getFullFileUrl(msg.fileUrl);

        return {
          id: msg.messageId,
          message: messageContent,
          isAdmin: msg.senderId === parseInt(localStorage.getItem("userId")),
          avatar: msg.senderAvatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
          timestamp: serverTimestamp,
          createdAt: msg.createdAt,
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
        `${baseUrl}/api/admin/chat/${chatData.chatId}/messages/${selectedMessageId}`, 
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

      setMessages(prev => prev.filter(m => m.id !== selectedMessageId));
      toast.success("Đã xóa tin nhắn");
      
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error(err.message);
    } finally {
      setShowContextMenu(false);
    }
  };

  const addMessage = async (content, fileUrl = null, messageType = 'TEXT') => {
    try {
      if (!chatData?.chatId || !selectedUser) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      let messageContent = "";
      if (typeof content === 'object') {
        if (content.message) {
          messageContent = content.message;
        } else {
          messageContent = JSON.stringify(content);
        }
      } else {
        messageContent = String(content || "");
      }

      let processedFileUrl = getFullFileUrl(fileUrl);

      let shortenedFileUrl = processedFileUrl;
      if (processedFileUrl && processedFileUrl.length > 200) {
        const urlParts = processedFileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        shortenedFileUrl = `/api/admin/chat/files/${fileName}`;
        processedFileUrl = getFullFileUrl(shortenedFileUrl);
      }

      const currentTimestamp = getCurrentTimeString();
      
      const tempId = "temp-" + Date.now();
      const tempMessage = {
        id: tempId,
        message: messageContent,
        isAdmin: true,
        avatar: localStorage.getItem("userAvatar") || null,
        timestamp: currentTimestamp,
        senderId: parseInt(localStorage.getItem("userId")),
        messageType: messageType,
        fileUrl: processedFileUrl
      };
      setMessages(prev => [...prev, tempMessage]);

      const messageRequest = {
        content: messageContent,
        messageType: messageType || "TEXT",
        fileUrl: shortenedFileUrl || null
      };

      const response = await fetch(`${baseUrl}/api/admin/chat/${chatData.chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể gửi tin nhắn (${response.status}): ${errorText || response.statusText}`);
      }

      const sentMessage = await response.json();
      
      let updatedFileUrl = sentMessage.fileUrl;
      if (updatedFileUrl) {
        updatedFileUrl = getFullFileUrl(updatedFileUrl);
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? {
          ...msg,
          id: sentMessage.messageId,
          message: sentMessage.content || msg.message,
          timestamp: formatServerTimestamp(sentMessage.createdAt) || currentTimestamp,
          createdAt: sentMessage.createdAt,
          fileUrl: updatedFileUrl || msg.fileUrl
        } : msg
      ));

      setTimeout(scrollToBottom, 100);
      return sentMessage;

    } catch (err) {
      console.error("Error sending message:", err);
      toast.error(err.message);
      setMessages(prev => prev.filter(msg => !msg.id.toString().startsWith("temp-")));
      throw err;
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (!chatData?.chatId) return;
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (!token || !userId) return;
    
    try {
      const typingData = {
        chatId: chatData.chatId,
        userId: parseInt(userId),
        isTyping: isTyping
      };
      
      const stompClient = window.stompClient;
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: "/app/admin-chat.typing",
          body: JSON.stringify(typingData)
        });
      }
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
    const userAvatar = selectedUser && avatars[selectedUser.userId] 
      ? avatars[selectedUser.userId] 
      : selectedUser?.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";
      
    return (
      <div className="bg-emerald-500 p-4 flex items-center justify-between">
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
            <span className="text-sm text-emerald-50">
              {isTyping ? 'Đang nhập...' : selectedUser ? getRoleText(selectedUser.role) : 'Đang hoạt động'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-white hover:bg-emerald-600 rounded-full transition-colors">
            <Phone className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-emerald-600 rounded-full transition-colors">
            <Video className="w-6 h-6" />
          </button>
          <button className="p-2 text-white hover:bg-emerald-600 rounded-full transition-colors">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const ChatMessage = ({ id, message, isAdmin, avatar, timestamp, createdAt, senderName, messageType, fileUrl, senderId }) => {
    const userAvatar = avatars[senderId] || avatar;
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
                    e.target.parentNode.innerHTML = `<div class="bg-gray-200 p-3 rounded-2xl text-sm text-gray-500">Video không thể hiển thị</div>`;
                  }}
                />
              </div>
            ) : messageType === 'FILE' || messageType === 'DOCUMENT' ? (
              <div
              className={`p-3 rounded-2xl ${
                isAdmin
                  ? 'bg-emerald-500 text-white ml-2'
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
                    ? 'bg-emerald-500 text-white ml-2'
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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

      {showContextMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowContextMenu(false)}
        />
      )}

      <ChatInput 
        chatId={chatData?.chatId}
        addMessage={addMessage} 
        setIsTyping={(isTyping) => {
          setIsTyping(isTyping);
          sendTypingStatus(isTyping);
        }} 
        disabled={!selectedUser || !chatData}
      />
    </div>
  );
};

export default ChatWindow;