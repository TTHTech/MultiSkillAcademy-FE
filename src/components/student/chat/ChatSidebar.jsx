import React from 'react';
import { Search, MessageSquare, Shield, BookOpen } from 'lucide-react';

const ChatSidebar = () => {
  const chats = [
    {
      id: 1,
      name: 'Admin Support',
      lastMessage: 'Vâng, tôi sẽ kiểm tra ngay!',
      role: 'admin',
      unread: 2,
      timestamp: '10:05 AM'
    },
    {
      id: 2,
      name: 'John Smith',
      lastMessage: 'Bạn đã hoàn thành bài tập chưa?',
      role: 'instructor',
      unread: 0,
      timestamp: '09:30 AM'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      lastMessage: 'Deadline của project là thứ 6 nhé',
      role: 'instructor',
      unread: 1,
      timestamp: 'Yesterday'
    },
    {
      id: 4,
      name: 'Technical Support',
      lastMessage: 'Đã xử lý xong vấn đề của bạn',
      role: 'admin',
      unread: 0,
      timestamp: 'Yesterday'
    }
  ];

  const getRoleIcon = (role) => {
    if (role === 'admin') {
      return <Shield className="w-5 h-5 text-red-500" />;
    }
    return <BookOpen className="w-5 h-5 text-green-500" />;
  };

  return (
    <div className="w-80 border-r bg-white">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              {getRoleIcon(chat.role)}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{chat.name}</p>
                  <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mt-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {chat.role === 'admin' ? 'Admin Support' : 'Course Instructor'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;