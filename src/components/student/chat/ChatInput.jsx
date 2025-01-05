import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile } from 'lucide-react';

const ChatInput = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full" title="Đính kèm file">
          <Paperclip className="w-5 h-5 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full" title="Gửi ảnh">
          <Image className="w-5 h-5 text-gray-500" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="p-2 hover:bg-gray-100 rounded-full" title="Chọn emoji">
          <Smile className="w-5 h-5 text-gray-500" />
        </button>
        <button 
          className={`p-2 rounded-full transition-colors duration-200 ${
            message.trim() 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;