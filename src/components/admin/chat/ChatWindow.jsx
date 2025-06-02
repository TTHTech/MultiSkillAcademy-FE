import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import EmptyChat from "./EmptyChat";

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatWindow = ({
  selectedUser,
  chatId,
  chatData,
  onMessageSent,
  isGroup = false,
  onGroupManagementClick,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [avatars, setAvatars] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages using getChatDetail endpoint
  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      console.log("Fetching chat details for chatId:", chatId);
      const response = await fetch(`${baseUrl}/api/admin/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log("Chat not found");
          setMessages([]);
          return [];
        }
        throw new Error(`Không thể tải chat (${response.status})`);
      }

      const chatDetails = await response.json();
      console.log("Fetched chat details:", chatDetails);

      // Extract messages from chat details
      const messageData = chatDetails.messages || [];
      console.log("Extracted messages:", messageData);

      const formattedMessages = messageData.map((msg) => {
        // Message content is already processed in backend
        const messageContent = msg.content || "";

        const serverTimestamp = formatServerTimestamp(msg.createdAt);

        if (msg.senderId) {
          fetchUserAvatar(msg.senderId);
        }

        const fullFileUrl = getFullFileUrl(msg.fileUrl);

        return {
          id: msg.messageId,
          message: messageContent,
          isAdmin: msg.senderId === parseInt(localStorage.getItem("userId")),
          avatar:
            msg.senderAvatar ||
            "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
          timestamp: serverTimestamp,
          createdAt: msg.createdAt,
          senderId: msg.senderId,
          senderName: msg.senderName,
          messageType: msg.messageType || "TEXT",
          fileUrl: fullFileUrl,
        };
      });

      setMessages(formattedMessages);
      setTimeout(scrollToBottom, 100);
      return formattedMessages;
    } catch (err) {
      console.error("Error fetching messages:", err);
      // Không hiển thị toast error nếu là 404
      if (!err.message.includes("404")) {
        toast.error(err.message);
      }
      return [];
    }
  };

  useEffect(() => {
    if (chatData?.chatId) {
      setLoading(true);
      fetchMessages(chatData.chatId).finally(() => setLoading(false));
    } else {
      setMessages([]);
    }
  }, [chatData]);

  // Time formatting functions
  const formatServerTimestamp = (dateTimeString) => {
    if (!dateTimeString) return getCurrentTimeString();

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        return getCurrentTimeString();
      }

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      const isThisYear = date.getFullYear() === today.getFullYear();

      const timeString = date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (isToday) {
        return timeString;
      } else if (isYesterday) {
        return `Hôm qua ${timeString}`;
      } else if (isThisYear) {
        const dateString = date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        return `${dateString} ${timeString}`;
      } else {
        const dateString = date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return `${dateString} ${timeString}`;
      }
    } catch (e) {
      return getCurrentTimeString();
    }
  };

  const getCurrentTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageDateGroup = (dateTimeString) => {
    if (!dateTimeString) return "";

    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "";

      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      const isThisYear = date.getFullYear() === today.getFullYear();

      if (isToday) {
        return "Hôm nay";
      } else if (isYesterday) {
        return "Hôm qua";
      } else if (isThisYear) {
        return date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        });
      } else {
        return date.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch (e) {
      return "";
    }
  };

  const getFullFileUrl = (fileUrl) => {
    if (!fileUrl) return null;

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    if (fileUrl.includes("firebasestorage.googleapis.com")) {
      const fullUrl = fileUrl.startsWith("https://")
        ? fileUrl
        : `https://${fileUrl}`;
      return fullUrl;
    }

    if (fileUrl && fileUrl.includes("/api/instructor/chat/files/")) {
      const fileName = fileUrl.split("/").pop();
      return `${baseUrl}/api/admin/chat/files/${fileName}`;
    }

    if (fileUrl && fileUrl.includes("image_")) {
      const imageId = fileUrl.includes("/")
        ? fileUrl.split("/").pop()
        : fileUrl;
      return `${baseUrl}/api/admin/chat/files/${imageId}`;
    }

    if (fileUrl.startsWith("/api/")) {
      return `${baseUrl}${fileUrl}`;
    }

    if (fileUrl.includes("/uploads/")) {
      return `${baseUrl}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
    }

    if (!fileUrl.includes("/") && !fileUrl.includes(":\\")) {
      return `${baseUrl}/uploads/${fileUrl}`;
    }

    return fileUrl;
  };

  const fetchUserAvatar = async (userId) => {
    try {
      if (!userId || avatars[userId]) return;

      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${baseUrl}/api/admin/chat/users/${userId}/avatar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Không thể tải ảnh cho người dùng ${userId}`);
        return;
      }

      const data = await response.json();
      if (data.avatarUrl) {
        setAvatars((prev) => ({
          ...prev,
          [userId]: data.avatarUrl,
        }));
      }
    } catch (err) {
      console.error(`Error fetching avatar for user ${userId}:`, err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message actions
  const handleCopyMessage = (message) => {
    if (message && message.message) {
      navigator.clipboard.writeText(message.message);
      toast.success("Đã sao chép tin nhắn");
    }
  };

  // Sửa lại hàm handleDeleteMessage
  // Quay lại logic xóa đơn giản ban đầu
  const handleDeleteMessage = async (messageId) => {
    try {
      if (!chatData?.chatId) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatData.chatId}/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xóa tin nhắn");
      }

      // Xóa khỏi state local NGAY LẬP TỨC (như code cũ có thể đã làm)
      setMessages((prev) => prev.filter((m) => m.id !== messageId));

      toast.success("Đã xóa tin nhắn");

      if (onMessageSent) {
        onMessageSent();
      }

      // Fetch lại messages sau một khoảng delay ngắn để đảm bảo consistency
      setTimeout(() => {
        fetchMessages(chatData.chatId);
      }, 500);
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error(err.message);
    }
  };

  const addMessage = async (content, file, messageType = "TEXT") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      let response, sentMessage;

      if (messageType === "TEXT") {
        response = await fetch(`${baseUrl}/api/admin/chat/message/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatId: chatData.chatId,
            content,
            messageType,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("messageType", messageType);

        response = await fetch(
          `${baseUrl}/api/admin/chat/${chatData.chatId}/message/media`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      }

      if (!response.ok) throw new Error("Không thể gửi tin nhắn");

      sentMessage = await response.json();

      // Add to messages immediately
      const newMessage = {
        id: sentMessage.messageId,
        message: sentMessage.content,
        isAdmin:
          sentMessage.senderId === parseInt(localStorage.getItem("userId")),
        avatar:
          sentMessage.senderAvatar ||
          avatars[sentMessage.senderId] ||
          "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain",
        timestamp: formatServerTimestamp(sentMessage.createdAt),
        createdAt: sentMessage.createdAt,
        senderId: sentMessage.senderId,
        senderName: sentMessage.senderName,
        messageType: sentMessage.messageType || messageType,
        fileUrl: getFullFileUrl(sentMessage.fileUrl),
      };

      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();

      if (onMessageSent) onMessageSent();

      return sentMessage;
    } catch (err) {
      toast.error(err.message);
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
        isTyping: isTyping,
      };

      const stompClient = window.stompClient;
      if (stompClient && stompClient.connected) {
        stompClient.publish({
          destination: "/app/admin-chat.typing",
          body: JSON.stringify(typingData),
        });
      }
    } catch (err) {
      console.error("Error sending typing status:", err);
    }
  };

  const getRoleText = (role) => {
    const roleMap = {
      ADMIN: "Quản trị viên",
      ROLE_ADMIN: "Quản trị viên",
      INSTRUCTOR: "Giảng viên",
      ROLE_INSTRUCTOR: "Giảng viên",
      STUDENT: "Học viên",
      ROLE_STUDENT: "Học viên",
    };
    return roleMap[role] || role;
  };

  const enlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  useEffect(() => {
    if (selectedUser && selectedUser.userId) {
      fetchUserAvatar(selectedUser.userId);
    }
  }, [selectedUser]);

  // Date separator component
  const DateSeparator = ({ dateString }) => (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {dateString}
      </div>
    </div>
  );

  // Group messages by date
  const renderMessagesWithDateSeparators = () => {
    if (messages.length === 0) return null;

    const groupedMessages = [];
    let currentDateGroup = null;

    messages.forEach((msg, index) => {
      const messageDate = getMessageDateGroup(msg.createdAt);

      if (messageDate !== currentDateGroup) {
        currentDateGroup = messageDate;
        if (messageDate) {
          groupedMessages.push(
            <DateSeparator key={`date-${index}`} dateString={messageDate} />
          );
        }
      }

      // Trong hàm renderMessagesWithDateSeparators() của ChatWindow
      groupedMessages.push(
        <ChatMessage
          key={msg.id || index}
          {...msg}
          avatars={avatars}
          onEnlargeImage={enlargeImage}
          getCurrentTimeString={getCurrentTimeString}
          onCopyMessage={handleCopyMessage}
          onDeleteMessage={handleDeleteMessage}
          isGroup={isGroup} // Thêm dòng này
        />
      );
    });

    return groupedMessages;
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <ChatHeader
        selectedUser={selectedUser}
        isGroup={isGroup}
        chatData={chatData}
        isTyping={isTyping}
        avatars={avatars}
        getRoleText={getRoleText}
        onGroupManagementClick={onGroupManagementClick}
      />

      {/* Messages Container with relative positioning */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto p-4 bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : messages.length > 0 ? (
            <>
              {renderMessagesWithDateSeparators()}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <EmptyChat
              selectedUser={selectedUser}
              isGroup={isGroup}
              chatData={chatData}
              avatars={avatars}
              getRoleText={getRoleText}
            />
          )}
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        chatId={chatData?.chatId}
        addMessage={addMessage}
        setIsTyping={(isTyping) => {
          setIsTyping(isTyping);
          sendTypingStatus(isTyping);
        }}
        disabled={!chatData || !chatData.chatId}
      />

      {/* Enlarged Image Modal - Outside main container */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeEnlargedImage}
        >
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
                e.target.src =
                  "https://via.placeholder.com/800x600?text=Image+not+available";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
