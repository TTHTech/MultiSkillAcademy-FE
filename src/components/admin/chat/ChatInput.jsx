import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, FileText, Video, X, Smile } from 'lucide-react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const ChatInput = ({ chatId, addMessage, setIsTyping, disabled }) => {
  const [message, setMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 20MB');
      return;
    }

    setSelectedFile(file);
    
    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('IMAGE');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFilePreview(reader.result);
      };
    } else if (file.type.startsWith('video/')) {
      setFileType('VIDEO');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFilePreview(reader.result);
      };
    } else {
      setFileType('FILE');
      setFilePreview(null);
    }
    
    setShowAttachmentOptions(false);
  };

  const handleAttachmentClick = (type) => {
    if (fileInputRef.current) {
      // Set accept attribute based on selected file type
      switch (type) {
        case 'IMAGE':
          fileInputRef.current.accept = 'image/*';
          break;
        case 'VIDEO':
          fileInputRef.current.accept = 'video/*';
          break;
        case 'FILE':
          fileInputRef.current.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
          break;
        default:
          fileInputRef.current.accept = '*/*';
      }
      fileInputRef.current.click();
    }
    setShowAttachmentOptions(false);
  };

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const resetFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message for Admin
  const handleSendMessage = async () => {
    if (disabled || !chatId) {
      console.log("Cannot send message:", { disabled, chatId });
      return;
    }
    
    try {
      console.log("Starting to send message...", { 
        hasFile: !!selectedFile, 
        messageLength: message.trim().length,
        chatId 
      });

      // If a file is selected
      if (selectedFile) {
        setIsUploading(true);
        
        try {
          // Send file directly using message/media endpoint
          await addMessage(message.trim() || `[${selectedFile.name}]`, selectedFile, fileType);
          
          // Reset file selection
          resetFileSelection();
          
        } catch (error) {
          console.error('File send failed:', error);
          toast.error(`Không thể gửi file: ${error.message}`);
          return;
        }
        
      } else if (message.trim()) {
        console.log("Sending text message:", message.trim());
        // Send regular text message
        await addMessage(message.trim(), null, 'TEXT');
      } else {
        console.log("No message content to send");
        return;
      }
      
      // Reset message and typing status
      setMessage('');
      setIsTyping(false);
      setShowEmojiPicker(false);
      
      // Focus input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast.error(`Không thể gửi tin nhắn: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Send typing status via WebSocket for Admin
  const sendTypingStatus = (isTyping) => {
    const token = localStorage.getItem("token");
    if (!token || !chatId) return;
    
    try {
      const stompClient = window.stompClient;
      if (stompClient && stompClient.connected) {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username") || "Admin";
        
        stompClient.publish({
          destination: "/app/admin-chat.typing",
          body: JSON.stringify({
            chatId: chatId,
            userId: userId,
            username: username,
            isTyping: isTyping
          })
        });
      }
    } catch (error) {
      console.error("Error sending typing status:", error);
    }
  };

  // Send typing status when user types
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      sendTypingStatus(message.length > 0);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [message, chatId]);

  return (
    <div className="border-t p-3 relative bg-white">
      {/* Display selected file */}
      {selectedFile && (
        <div className="mb-2 p-3 bg-gray-50 rounded-lg relative border">
          <div className="flex items-center">
            {filePreview && fileType === 'IMAGE' ? (
              <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md mr-3" />
            ) : filePreview && fileType === 'VIDEO' ? (
              <video src={filePreview} className="w-16 h-16 object-cover rounded-md mr-3" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 animate-pulse" 
                    style={{width: '100%'}}>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Đang gửi...</div>
                </div>
              )}
            </div>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={resetFileSelection}
              disabled={isUploading}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        {/* Attachment button */}
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => {
              setShowAttachmentOptions(!showAttachmentOptions);
              setShowEmojiPicker(false);
            }}
            disabled={disabled || !chatId || isUploading}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Attachment options */}
          {showAttachmentOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 z-10 border">
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('IMAGE')}
              >
                <Image className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Hình ảnh</span>
              </button>
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('VIDEO')}
              >
                <Video className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Video</span>
              </button>
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('FILE')}
              >
                <FileText className="w-5 h-5 text-orange-500" />
                <span className="text-sm">Tài liệu</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Emoji button */}
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowAttachmentOptions(false);
            }}
            disabled={disabled || !chatId || isUploading}
          >
            <Smile className="w-5 h-5" />
          </button>
          
          {/* Emoji picker */}
          {showEmojiPicker && (
            <div 
              className="absolute bottom-full left-0 mb-2 z-50" 
              ref={emojiPickerRef}
            >
              <EmojiPicker 
                onEmojiClick={(emojiData) => onEmojiClick(emojiData)} 
                searchDisabled={false}
                skinTonesDisabled
                width={320}
                height={350}
              />
            </div>
          )}
        </div>
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
        />
        
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={disabled || !chatId ? "Chọn một người dùng để bắt đầu chat" : "Nhập tin nhắn..."}
          className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || !chatId || isUploading}
        />
        
        {/* Send button */}
        <button
          className={`p-2 rounded-full transition-colors ${
            !disabled && chatId && (message.trim() || selectedFile) && !isUploading
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSendMessage}
          disabled={disabled || !chatId || isUploading || (!message.trim() && !selectedFile)}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;