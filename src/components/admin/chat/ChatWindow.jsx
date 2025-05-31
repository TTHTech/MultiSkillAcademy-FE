import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Trash2,
  FileUp,
  Send,
  X,
  MoreHorizontal,
  Copy,
  Reply,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";
import ChatInput from "./ChatInput";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatWindow = ({
  selectedUser,
  chatId,
  chatData,
  onMessageSent,
  isGroup = false,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const messagesEndRef = useRef(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [avatars, setAvatars] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatData?.chatId) {
      setLoading(true);
      fetchMessages(chatData.chatId).finally(() => setLoading(false));
    } else {
      setMessages([]);
    }
  }, [chatData]);

  // Enhanced time formatting with date and year
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

  // Enhanced date display for message grouping
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

    console.log("Processing file URL:", fileUrl);

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      console.log("External URL detected, returning as-is:", fileUrl);
      return fileUrl;
    }

    if (fileUrl.includes("firebasestorage.googleapis.com")) {
      const fullUrl = fileUrl.startsWith("https://")
        ? fileUrl
        : `https://${fileUrl}`;
      console.log("Firebase URL fixed:", fullUrl);
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

  const fetchMessages = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      console.log("Fetching messages for chatId:", chatId);
      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No messages found, setting empty array");
          setMessages([]);
          return [];
        }
        throw new Error(`Không thể tải tin nhắn (${response.status})`);
      }

      const messageData = await response.json();
      console.log("Fetched messages:", messageData);

      const formattedMessages = messageData.map((msg) => {
        let messageContent = msg.content;
        try {
          const parsedContent = JSON.parse(msg.content);
          if (
            parsedContent &&
            typeof parsedContent === "object" &&
            parsedContent.message
          ) {
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
      toast.error(err.message);
      return [];
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Modern message menu handlers
  const handleMessageHover = (messageId) => {
    setHoveredMessageId(messageId);
  };

  const handleMessageLeave = () => {
    // Keep hover state for a brief moment to allow menu access
    setTimeout(() => {
      if (!showMessageMenu) {
        setHoveredMessageId(null);
      }
    }, 200);
  };

  const handleShowMessageMenu = (messageId, event) => {
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - 150, // Offset menu to the left
    });
    setShowMessageMenu(messageId);
  };

  const handleCloseMessageMenu = () => {
    setShowMessageMenu(null);
    setHoveredMessageId(null);
  };

  // Message actions
  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.message);
    toast.success("Đã sao chép tin nhắn");
    handleCloseMessageMenu();
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      if (!chatData?.chatId) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");

      const response = await fetch(
        `${baseUrl}/api/admin/chat/${chatData.chatId}/messages/${messageId}`,
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

      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      toast.success("Đã xóa tin nhắn");

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error(err.message);
    } finally {
      handleCloseMessageMenu();
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
        // Gửi file qua FormData
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

      // Thêm vào danh sách tin nhắn
      setMessages((prev) => [
        ...prev,
        {
          ...sentMessage,
          timestamp: formatServerTimestamp(sentMessage.createdAt),
          isAdmin:
            sentMessage.senderId === parseInt(localStorage.getItem("userId")),
          // ...các trường khác (avatar, messageType...)
        },
      ]);
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
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "ROLE_ADMIN":
        return "Quản trị viên";
      case "INSTRUCTOR":
        return "Giảng viên";
      case "ROLE_INSTRUCTOR":
        return "Giảng viên";
      case "STUDENT":
        return "Học viên";
      case "ROLE_STUDENT":
        return "Học viên";
      default:
        return role;
    }
  };

  const enlargeImage = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const ChatHeader = () => {
    const userAvatar =
      selectedUser && avatars[selectedUser.userId]
        ? avatars[selectedUser.userId]
        : selectedUser?.avatar ||
          "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";

    const displayName = isGroup
      ? chatData?.groupName || "Nhóm chat"
      : selectedUser
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : "Chat";

    const displayStatus = isGroup
      ? `${chatData?.participants?.length || 0} thành viên`
      : isTyping
      ? "Đang nhập..."
      : selectedUser
      ? getRoleText(selectedUser.role)
      : "Đang hoạt động";

    return (
      <div className="bg-emerald-500 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">{displayName}</h3>
            <span className="text-sm text-emerald-50">{displayStatus}</span>
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

  // Date separator component
  const DateSeparator = ({ dateString }) => (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {dateString}
      </div>
    </div>
  );

  // Modern Message Component with hover menu
  const ChatMessage = ({
    id,
    message,
    isAdmin,
    avatar,
    timestamp,
    createdAt,
    senderName,
    messageType,
    fileUrl,
    senderId,
  }) => {
    const userAvatar = avatars[senderId] || avatar;
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const isHovered = hoveredMessageId === id;
    const isMenuOpen = showMessageMenu === id;

    return (
      <div
        className={`group flex ${
          isAdmin ? "justify-end" : "justify-start"
        } mb-4 relative`}
        onMouseEnter={() => handleMessageHover(id)}
        onMouseLeave={handleMessageLeave}
      >
        <div
          className={`flex ${
            isAdmin ? "flex-row-reverse" : "flex-row"
          } items-end max-w-[70%] relative`}
        >
          {!isAdmin && (
            <img
              src={userAvatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full mr-2 mb-1 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
              }}
            />
          )}

          <div className="relative">
            {messageType === "IMAGE" ? (
              <div
                className={`rounded-2xl overflow-hidden ${
                  isAdmin ? "ml-2" : ""
                } bg-gray-100`}
              >
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
                    className={`max-w-full h-auto max-h-64 rounded-2xl cursor-pointer ${
                      imgLoaded ? "block" : "hidden"
                    }`}
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
            ) : messageType === "VIDEO" ? (
              <div
                className={`rounded-2xl overflow-hidden ${
                  isAdmin ? "ml-2" : ""
                }`}
              >
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
            ) : messageType === "FILE" || messageType === "DOCUMENT" ? (
              <div
                className={`p-3 rounded-2xl ${
                  isAdmin
                    ? "bg-emerald-500 text-white ml-2"
                    : "bg-gray-100 text-gray-900"
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
                    <span className="text-xs mt-1 text-gray-300 break-all">
                      {fileUrl}
                    </span>
                  </span>
                </a>
              </div>
            ) : (
              <div
                className={`p-3 rounded-2xl ${
                  isAdmin
                    ? "bg-emerald-500 text-white ml-2"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Modern Hover Menu Button */}
            {(isHovered || isMenuOpen) && isAdmin && (
              <button
                onClick={(e) => handleShowMessageMenu(id, e)}
                className={`absolute top-0 ${
                  isAdmin ? "-left-10" : "-right-10"
                } bg-white shadow-lg rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50`}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            )}

            <div className={`mt-1 ${isAdmin ? "text-right" : "text-left"}`}>
              <span className="text-xs text-gray-500">
                {timestamp || getCurrentTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modern Message Menu
  const MessageMenu = ({ messageId, message }) => {
    if (showMessageMenu !== messageId) return null;

    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-40" onClick={handleCloseMessageMenu} />

        {/* Menu */}
        <div
          className="fixed bg-white shadow-lg rounded-lg py-2 z-50 border min-w-[160px]"
          style={{
            top: Math.min(menuPosition.top, window.innerHeight - 200),
            left: Math.max(menuPosition.left, 10),
          }}
        >
          <button
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
            onClick={() => handleCopyMessage(message)}
          >
            <Copy className="w-4 h-4 mr-3" />
            Sao chép tin nhắn
          </button>

          <button
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
            onClick={() => {
              /* TODO: Implement reply */
            }}
          >
            <Reply className="w-4 h-4 mr-3" />
            Trả lời
          </button>

          <div className="border-t my-1"></div>

          <button
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm"
            onClick={() => handleDeleteMessage(messageId)}
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Xóa tin nhắn
          </button>
        </div>
      </>
    );
  };

  const EmptyChat = () => {
    const userAvatar =
      selectedUser && avatars[selectedUser.userId]
        ? avatars[selectedUser.userId]
        : selectedUser?.avatar ||
          "https://th.bing.com/th/id/OIP.7fheetEuM-hyJg1sEyuqVwHaHa?rs=1&pid=ImgDetMain";

    const displayName = isGroup
      ? chatData?.groupName || "Nhóm chat"
      : selectedUser
      ? `${selectedUser.firstName} ${selectedUser.lastName}`
      : null;

    const displayRole = isGroup
      ? `${chatData?.participants?.length || 0} thành viên`
      : selectedUser
      ? getRoleText(selectedUser.role)
      : null;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        {displayName ? (
          <>
            <img
              src={userAvatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full mb-4 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=U&background=3B82F6&color=ffffff&size=128&bold=true";
              }}
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {displayName}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{displayRole}</p>
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

  // Group messages by date for date separators
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

      groupedMessages.push(<ChatMessage key={msg.id || index} {...msg} />);
    });

    return groupedMessages;
  };

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
            {renderMessagesWithDateSeparators()}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>

      {/* Enlarged Image Modal */}
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

      {/* Modern Message Menu */}
      {showMessageMenu && (
        <MessageMenu
          messageId={showMessageMenu}
          message={messages.find((m) => m.id === showMessageMenu)}
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
