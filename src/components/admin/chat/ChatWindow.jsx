import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import ChatInput from './ChatInput';

const ChatWindow = ({ selectedUser, chatId, chatData }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch và format tin nhắn khi chatData thay đổi
  useEffect(() => {
    if (chatData) {
      setLoading(true);
      try {
        const formattedMessages = chatData.messages.map(msg => ({
          message: msg.content,
          isAdmin: msg.senderId === parseInt(localStorage.getItem("userId")),
          avatar: msg.senderAvatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain", 
          timestamp: new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error('Error formatting messages:', err);
        toast.error("Lỗi hiển thị tin nhắn");
      } finally {
        setLoading(false);
      }
    }
  }, [chatData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = async (content) => {
    try {
      if (!chatId || !selectedUser) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      // Add message locally first
      const tempMessage = {
        message: content,
        isAdmin: true,
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages(prev => [...prev, tempMessage]);

      // Send to server
      const response = await fetch(`http://localhost:8080/api/admin/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          messageType: 'TEXT'
        })
      });

      if (!response.ok) {
        throw new Error("Không thể gửi tin nhắn");
      }

      // Fetch lại tin nhắn sau khi gửi thành công
      const updatedResponse = await fetch(
        `http://localhost:8080/api/admin/chat/one-to-one/${selectedUser.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updatedResponse.ok) {
        const updatedChatData = await updatedResponse.json();
        const updatedMessages = updatedChatData.messages.map(msg => ({
          message: msg.content,
          isAdmin: msg.senderId === parseInt(localStorage.getItem("userId")),
          avatar: msg.senderAvatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
          timestamp: new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setMessages(updatedMessages);
      }

    } catch (err) {
      toast.error(err.message);
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const ChatHeader = () => (
    <div className="bg-emerald-500 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={selectedUser?.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold text-white">
            {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Chat'}
          </h3>
          <span className="text-sm text-emerald-50">
            {isTyping ? 'Đang nhập...' : 'Đang hoạt động'}
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

  const ChatMessage = ({ message, isAdmin, avatar, timestamp }) => (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isAdmin ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
        {!isAdmin && (
          <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2 mb-1" />
        )}
        <div>
          <div
            className={`p-3 rounded-2xl ${
              isAdmin
                ? 'bg-emerald-500 text-white ml-2'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm">{message}</p>
          </div>
          <div className={`mt-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const EmptyChat = () => (
    <div className="flex flex-col items-center justify-center h-full">
      {selectedUser ? (
        <>
          <img
            src={selectedUser.avatar || "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {`${selectedUser.firstName} ${selectedUser.lastName}`}
          </h3>
          <p className="text-sm text-gray-500">Bắt đầu cuộc trò chuyện</p>
        </>
      ) : (
        <>
          <img
            src="https://www.svgrepo.com/show/192262/chat.svg"
            alt="Empty Chat"
            className="w-32 h-32 rounded-full mb-4"
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

  return (
    <div className="flex flex-col h-screen bg-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>

      <ChatInput addMessage={addMessage} setIsTyping={setIsTyping} />
    </div>
  );
};

export default ChatWindow;