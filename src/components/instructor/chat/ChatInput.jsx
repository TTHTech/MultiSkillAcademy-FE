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
  const [uploadProgress, setUploadProgress] = useState(0);
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

  // Modified uploadFile function to fix upload issues
  const uploadFile = async (file) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");
      
      if (!chatId) throw new Error("Không có ID cuộc trò chuyện");
      
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);
      
      console.log("Uploading file to endpoint:", `${baseUrl}/api/instructor/chat/${chatId}/upload`);
      console.log("File type:", fileType);
      console.log("File size:", file.size);
      
      // Use XMLHttpRequest to track upload progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              console.error("Error parsing upload response:", error);
              console.log("Raw response:", xhr.responseText);
              reject(new Error("Invalid response format"));
            }
          } else {
            console.error("Upload error status:", xhr.status);
            console.error("Response text:", xhr.responseText);
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
        
        // Use instructor API
        xhr.open('POST', `${baseUrl}/api/instructor/chat/${chatId}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Không thể tải file lên: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
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

  // Modified handleSendMessage function to fix message sending issues
  const handleSendMessage = async () => {
    if (disabled || !chatId) return;
    
    try {
      // If a file is selected
      if (selectedFile) {
        setIsUploading(true);
        
        // Upload file to server
        const uploadResponse = await uploadFile(selectedFile);
        console.log('File uploaded successfully:', uploadResponse);
        
        // Create message content based on file type
        let messageContent = message || '';
        if (fileType === 'IMAGE') {
          messageContent = message || '[Hình ảnh]';
        } else if (fileType === 'VIDEO') {
          messageContent = message || '[Video]';
        } else {
          messageContent = message || `[Tập tin: ${selectedFile.name}]`;
        }
        
        // Shorten URL if too long
        let fileUrl = uploadResponse.fileUrl;
        if (fileUrl && fileUrl.length > 200) {
          const urlParts = fileUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          fileUrl = `/api/instructor/chat/files/${fileName}`;
          console.log("URL gốc quá dài, đã rút gọn thành:", fileUrl);
        }
        
        // Send message with file URL - Using the modified addMessage function
        await addMessage(messageContent, fileUrl, fileType);
        
        // Reset file selection
        resetFileSelection();
      } else if (message.trim()) {
        // Send regular text message with the proper format
        // Make sure the message format matches InstructorMessageRequestDTO
        await addMessage(message.trim(), null, 'TEXT');
      }
      
      // Reset message and typing status
      setMessage('');
      setIsTyping(false);
      setShowEmojiPicker(false);
      
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Không thể gửi tin nhắn: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Send typing status via WebSocket
  const sendTypingStatus = (isTyping) => {
    const token = localStorage.getItem("token");
    if (!token || !chatId) return;
    
    try {
      const stompClient = window.stompClient;
      if (stompClient && stompClient.connected) {
        const userId = localStorage.getItem("userId");
        const username = localStorage.getItem("username") || "Instructor";
        
        stompClient.publish({
          destination: "/app/instructor-chat.typing",
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
    <div className="border-t p-3 relative">
      {/* Display selected file */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md relative">
          <div className="flex items-center">
            {filePreview && fileType === 'IMAGE' ? (
              <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md mr-2" />
            ) : filePreview && fileType === 'VIDEO' ? (
              <video src={filePreview} className="w-16 h-16 object-cover rounded-md mr-2" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                <FileText className="w-8 h-8 text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full" 
                    style={{width: `${uploadProgress}%`}}>
                  </div>
                </div>
              )}
            </div>
            <button 
              className="p-1 hover:bg-gray-200 rounded-full"
              onClick={resetFileSelection}
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
            disabled={disabled || !chatId}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Attachment options */}
          {showAttachmentOptions && (
            <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 z-10">
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('IMAGE')}
              >
                <Image className="w-5 h-5 text-emerald-500" />
                <span>Hình ảnh</span>
              </button>
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('VIDEO')}
              >
                <Video className="w-5 h-5 text-blue-500" />
                <span>Video</span>
              </button>
              <button 
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md w-full text-left"
                onClick={() => handleAttachmentClick('FILE')}
              >
                <FileText className="w-5 h-5 text-orange-500" />
                <span>Tài liệu</span>
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
            disabled={disabled || !chatId}
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
          className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || !chatId || isUploading}
        />
        
        {/* Send button */}
        <button
          className={`p-2 rounded-full ${
            !disabled && chatId && (message.trim() || selectedFile) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
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