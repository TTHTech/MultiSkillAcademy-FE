import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, FileText, Video, X, Smile } from 'lucide-react';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ addMessage, setIsTyping, disabled }) => {
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

  // Đóng emoji picker khi click ra ngoài
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
    
    // Kiểm tra kích thước file (tối đa 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 20MB');
      return;
    }

    setSelectedFile(file);
    
    // Xác định loại file
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
      // Thiết lập accept attribute dựa trên loại file được chọn
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

  // Xử lý khi người dùng chọn emoji
  const onEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const uploadFile = async (file) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập lại");
      
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);
      
      // Sử dụng XMLHttpRequest để tracking tiến trình upload
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
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
        
        xhr.open('POST', 'http://localhost:8080/api/admin/chat/upload');
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

  const handleSendMessage = async () => {
    if (disabled) return;
    
    try {
      // Nếu có file được chọn
      if (selectedFile) {
        setIsUploading(true);
        
        // Upload file lên server
        const uploadResponse = await uploadFile(selectedFile);
        console.log('File uploaded successfully:', uploadResponse);
        
        // Tạo nội dung tin nhắn dựa trên loại file
        let messageContent = message || '';
        if (fileType === 'IMAGE') {
          messageContent = message || '[Hình ảnh]';
        } else if (fileType === 'VIDEO') {
          messageContent = message || '[Video]';
        } else {
          messageContent = message || `[Tập tin: ${selectedFile.name}]`;
        }
        
        // Rút gọn URL nếu quá dài
        let fileUrl = uploadResponse.fileDownloadUri;
        if (fileUrl && fileUrl.length > 200) {
          const urlParts = fileUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          fileUrl = `/api/admin/chat/files/${fileName}`;
          console.log("URL gốc quá dài, đã rút gọn thành:", fileUrl);
        }
        
        // Gửi tin nhắn với file URL
        await addMessage(messageContent, fileUrl, fileType);
        
        // Reset file selection
        resetFileSelection();
      } else if (message.trim()) {
        // Gửi tin nhắn văn bản thông thường
        await addMessage(message.trim());
      }
      
      // Reset tin nhắn và typing status
      setMessage('');
      setIsTyping(false);
      setShowEmojiPicker(false);
      
      // Focus lại input sau khi gửi
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

  return (
    <div className="border-t p-3 relative">
      {/* Hiển thị file đã chọn */}
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
            disabled={disabled}
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
            disabled={disabled}
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
          placeholder={disabled ? "Chọn một người dùng để bắt đầu chat" : "Nhập tin nhắn..."}
          className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isUploading}
        />
        
        {/* Send button */}
        <button
          className={`p-2 rounded-full ${
            !disabled && (message.trim() || selectedFile) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={handleSendMessage}
          disabled={disabled || isUploading || (!message.trim() && !selectedFile)}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;