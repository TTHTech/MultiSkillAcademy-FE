import React, { useState } from 'react';
import { FileUp, MoreHorizontal } from 'lucide-react';

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
  avatars,
  hoveredMessageId,
  showMessageMenu,
  onMessageHover,
  onMessageLeave,
  onShowMessageMenu,
  onEnlargeImage,
  getCurrentTimeString
}) => {
  const userAvatar = avatars[senderId] || avatar;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isHovered = hoveredMessageId === id;
  const isMenuOpen = showMessageMenu === id;

  return (
    <div
      className={`group flex ${isAdmin ? "justify-end" : "justify-start"} mb-4 relative`}
      onMouseEnter={() => onMessageHover(id)}
      onMouseLeave={onMessageLeave}
    >
      <div className={`flex ${isAdmin ? "flex-row-reverse" : "flex-row"} items-end max-w-[70%] relative`}>
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

        <div className="relative">
          {messageType === "IMAGE" ? (
            <div className={`rounded-2xl overflow-hidden ${isAdmin ? "ml-2" : ""} bg-gray-100`}>
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
                  className={`max-w-full h-auto max-h-64 rounded-2xl cursor-pointer ${imgLoaded ? "block" : "hidden"}`}
                  onClick={() => onEnlargeImage(fileUrl)}
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
            <div className={`rounded-2xl overflow-hidden ${isAdmin ? "ml-2" : ""}`}>
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
            <div className={`p-3 rounded-2xl ${isAdmin ? "bg-emerald-500 text-white ml-2" : "bg-gray-100 text-gray-900"}`}>
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
            <div className={`p-3 rounded-2xl ${isAdmin ? "bg-emerald-500 text-white ml-2" : "bg-gray-100 text-gray-900"}`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Modern Hover Menu Button */}
          {(isHovered || isMenuOpen) && isAdmin && (
            <button
              onClick={(e) => onShowMessageMenu(id, e)}
              className={`absolute top-0 ${isAdmin ? "-left-10" : "-right-10"} bg-white shadow-lg rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-gray-50`}
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

export default ChatMessage;