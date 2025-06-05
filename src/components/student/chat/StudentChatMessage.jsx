import React, { useState } from 'react';
import { FileUp, MoreHorizontal, Copy, Reply, Trash2 } from 'lucide-react';

const StudentChatMessage = ({
  id,
  message,
  isStudent,
  avatar,
  timestamp,
  createdAt,
  senderName,
  messageType,
  fileUrl,
  senderId,
  avatars,
  onEnlargeImage,
  getCurrentTimeString,
  onCopyMessage,
  onDeleteMessage,
  isGroup = false
}) => {
  const userAvatar = avatars[senderId] || avatar;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleCopy = () => {
    onCopyMessage({ id, message });
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDeleteMessage(id);
    setShowMenu(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest('.message-menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  return (
    <div className={`group flex ${isStudent ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isStudent ? "flex-row-reverse" : "flex-row"} items-end max-w-[70%] relative`}>
        {!isStudent && (
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

        <div className="relative">
          {/* Hiển thị tên người gửi phía trên tin nhắn cho những người không phải student trong group chat */}
          {isGroup && !isStudent && senderName && (
            <div className="text-xs text-gray-500 mb-1 ml-1">
              {senderName}
            </div>
          )}

          {/* Message Content */}
          {messageType === "IMAGE" ? (
            <div className={`rounded-2xl overflow-hidden ${isStudent ? "ml-2" : ""} bg-gray-100`}>
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
                  className={`max-w-full h-auto max-h-64 rounded-2xl cursor-pointer ${imgLoaded ? "block" : "hidden"}`}
                  onClick={() => onEnlargeImage(fileUrl)}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => {
                    console.error("Image failed to load:", fileUrl);
                    setImgError(true);
                    setImgLoaded(false);
                  }}
                />
              )}
            </div>
          ) : messageType === "VIDEO" ? (
            <div className={`rounded-2xl overflow-hidden ${isStudent ? "ml-2" : ""}`}>
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
            <div className={`p-3 rounded-2xl ${isStudent ? "bg-blue-500 text-white ml-2" : "bg-gray-100 text-gray-900"}`}>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm"
              >
                <FileUp className="w-4 h-4 mr-2" />
                <span className="flex flex-col">
                  <span>{message || "Tập tin đính kèm"}</span>
                  <span className={`text-xs mt-1 break-all ${isStudent ? "text-blue-100" : "text-gray-500"}`}>
                    {fileUrl.split('/').pop()}
                  </span>
                </span>
              </a>
            </div>
          ) : (
            <div className={`p-3 rounded-2xl ${isStudent ? "bg-blue-500 text-white ml-2" : "bg-gray-100 text-gray-900"}`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Hover Menu Button - Only for student's own messages */}
          {isStudent && (
            <div className={`absolute top-0 ${isStudent ? "-left-10" : "-right-10"} opacity-0 group-hover:opacity-100 transition-opacity message-menu-container`}>
              <button
                onClick={handleMenuClick}
                className="bg-white shadow-lg rounded-full p-1 hover:bg-gray-50"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>

              {/* Inline Menu */}
              {showMenu && (
                <div className={`absolute ${isStudent ? "right-0" : "left-0"} top-8 bg-white shadow-lg rounded-lg py-2 z-50 border min-w-[160px]`}>
                  <button
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4 mr-3" />
                    Sao chép tin nhắn
                  </button>

                  <button
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
                    onClick={() => {/* TODO: Implement reply */}}
                  >
                    <Reply className="w-4 h-4 mr-3" />
                    Trả lời
                  </button>

                  <div className="border-t my-1"></div>

                  <button
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Xóa tin nhắn
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className={`mt-1 ${isStudent ? "text-right" : "text-left"}`}>
            <span className="text-xs text-gray-500">
              {timestamp || getCurrentTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChatMessage;