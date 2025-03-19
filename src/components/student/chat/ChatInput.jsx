import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import axios from 'axios';
import ChatMessages from './ChatMessages'; // Điều chỉnh đường dẫn nếu cần

const ChatInput = ({ chatId, onMessageSent, stompClient }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Gửi tin nhắn văn bản
  const sendTextMessage = async () => {
    if (!message.trim() || !chatId) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      // Tạo tin nhắn tạm thời để hiển thị ngay lập tức
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        messageId: tempId,
        content: message,
        senderId: parseInt(localStorage.getItem('userId')),
        senderName: localStorage.getItem('username') || 'Bạn',
        messageType: 'TEXT',
        createdAt: new Date().toISOString()
      };
      
      // Gọi callback để hiển thị tin nhắn tạm thời ngay lập tức
      if (onMessageSent) {
        onMessageSent(tempMessage);
      }
      
      // Không bao gồm chatId trong body
      const response = await axios.post(`http://localhost:8080/api/student/chat/${chatId}/messages`, {
        content: message,
        messageType: 'TEXT'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Xử lý thành công
      if (response.data) {
        // Gọi callback để cập nhật tin nhắn tạm thời thành tin nhắn thật
        if (onMessageSent) {
          onMessageSent(response.data, tempId);
        }
        
        // Xóa tin nhắn sau khi gửi thành công
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response && error.response.data) {
        console.error('Error message:', error.response.data.message || error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // Thông báo đang gõ tin nhắn (gửi qua websocket)
  const handleTyping = () => {
    if (stompClient && stompClient.connected && chatId) {
      try {
        // Sửa lại đường dẫn WebSocket - không sử dụng URL đầy đủ
        stompClient.send(
          '/app/student/chat.typing', // Chỉ sử dụng đường dẫn tương đối
          {},
          JSON.stringify({
            chatId,
            userId: parseInt(localStorage.getItem('userId')),
            username: localStorage.getItem('username'),
            isTyping: true
          })
        );
      } catch (error) {
        console.error("Error sending typing notification:", error);
      }
    }
  };

  // Xử lý upload file
  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file || !chatId) {
      return;
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedDocTypes = [
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    let messageType;
    if (allowedImageTypes.includes(file.type)) {
      messageType = 'IMAGE';
    } else if (allowedDocTypes.includes(file.type)) {
      messageType = 'DOCUMENT';
    } else {
      messageType = 'FILE';
    }

    try {
      setIsLoading(true);
      
      // Tạo tin nhắn tạm thời để hiển thị ngay lập tức
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        messageId: tempId,
        content: file.name,
        senderId: parseInt(localStorage.getItem('userId')),
        senderName: localStorage.getItem('username') || 'Bạn',
        messageType: messageType,
        createdAt: new Date().toISOString()
      };
      
      // Gọi callback để hiển thị tin nhắn tạm thời ngay lập tức
      if (onMessageSent) {
        onMessageSent(tempMessage);
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', messageType);

      const token = localStorage.getItem('token');
      
      // Bỏ Content-Type để axios tự động thiết lập
      const response = await axios.post(`http://localhost:8080/api/student/chat/${chatId}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Xử lý thành công
      if (response.data) {
        // Gọi callback để cập nhật tin nhắn tạm thời thành tin nhắn thật
        if (onMessageSent) {
          onMessageSent(response.data, tempId);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response && error.response.data) {
        console.error('Error details:', error.response.data);
      }
    } finally {
      setIsLoading(false);
      // Reset input file
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, 'file')}
          className="hidden"
        />
        <button 
          className="p-2 hover:bg-gray-100 rounded-full" 
          title="Đính kèm file"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || !chatId}
        >
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>
        
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'image')}
          className="hidden"
        />
        <button 
          className="p-2 hover:bg-gray-100 rounded-full" 
          title="Gửi ảnh"
          onClick={() => imageInputRef.current?.click()}
          disabled={isLoading || !chatId}
        >
          <Image className="w-5 h-5 text-gray-500" />
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onInput={handleTyping}
          placeholder={chatId ? "Nhập tin nhắn..." : "Chọn cuộc trò chuyện để bắt đầu"}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || !chatId}
        />
        
        <button 
          className="p-2 hover:bg-gray-100 rounded-full" 
          title="Chọn emoji"
          disabled={isLoading || !chatId}
        >
          <Smile className="w-5 h-5 text-gray-500" />
        </button>
        
        <button
          onClick={sendTextMessage}
          disabled={!message.trim() || isLoading || !chatId}
          className={`p-2 rounded-full transition-colors duration-200 ${
            message.trim() && !isLoading && chatId
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {isLoading && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Đang gửi tin nhắn...
        </div>
      )}
    </div>
  );
};

export default ChatInput;