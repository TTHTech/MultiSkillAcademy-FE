import React, { useState } from 'react';
import { Plus, Image, Film, Gift, Smile, Send } from 'lucide-react';

const ChatInput = ({ addMessage, setIsTyping }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        message,
        isAdmin: true,
        avatar: '',
        timestamp: new Date().toLocaleTimeString(),
      };
      addMessage(newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
  };

  return (
    <div className="bg-white p-4 border-t">
      <div className="flex items-center">
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Plus className="w-6 h-6 text-emerald-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Image className="w-6 h-6 text-emerald-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Film className="w-6 h-6 text-emerald-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Gift className="w-6 h-6 text-emerald-500" />
          </button>
        </div>

        <div className="flex-1 mx-4 relative">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Aa"
            className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Smile className="w-6 h-6 text-emerald-500" />
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-2 rounded-full transition-colors ${
            message.trim()
              ? 'text-emerald-500 hover:bg-gray-100'
              : 'text-gray-400'
          }`}
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;