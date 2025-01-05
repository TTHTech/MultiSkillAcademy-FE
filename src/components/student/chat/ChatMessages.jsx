import React from 'react';
import { User, Shield, BookOpen } from 'lucide-react';

const ChatMessages = () => {
  const messages = [
    {
      id: 1,
      text: 'Xin chào, tôi cần hỗ trợ về khóa học Python!',
      sender: 'user',
      timestamp: '10:00 AM',
      senderName: 'Bạn'
    },
    {
      id: 2,
      text: 'Chào bạn, tôi là giảng viên khóa học Python. Bạn cần hỗ trợ gì ạ?',
      sender: 'instructor',
      timestamp: '10:01 AM',
      senderName: 'John Smith',
      role: 'instructor'
    },
    {
      id: 3,
      text: 'Tôi không thể truy cập bài học số 5, có lỗi gì không ạ?',
      sender: 'user',
      timestamp: '10:02 AM',
      senderName: 'Bạn'
    },
    {
      id: 4,
      text: 'Để tôi chuyển vấn đề này cho admin hỗ trợ bạn nhé.',
      sender: 'instructor',
      timestamp: '10:03 AM',
      senderName: 'John Smith',
      role: 'instructor'
    },
    {
      id: 5,
      text: 'Xin chào, tôi là admin. Tôi đã kiểm tra và khắc phục lỗi truy cập. Bạn thử lại nhé!',
      sender: 'admin',
      timestamp: '10:05 AM',
      senderName: 'Admin Support',
      role: 'admin'
    }
  ];

  const getMessageStyle = (sender, role) => {
    if (sender === 'user') {
      return 'bg-blue-500 text-white justify-end';
    } else if (role === 'admin') {
      return 'bg-red-100 text-gray-800 justify-start';
    } else {
      return 'bg-green-100 text-gray-800 justify-start';
    }
  };

  const getIcon = (role) => {
    if (role === 'admin') {
      return <Shield className="w-4 h-4 text-red-500" />;
    } else if (role === 'instructor') {
      return <BookOpen className="w-4 h-4 text-green-500" />;
    }
    return <User className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col space-y-1">
          <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender !== 'user' && (
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  {getIcon(message.role)}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {message.senderName}
                </span>
              </div>
            )}
          </div>
          <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${getMessageStyle(
                message.sender,
                message.role
              )}`}
            >
              {message.text}
              <div className="text-xs mt-1 opacity-75">{message.timestamp}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;