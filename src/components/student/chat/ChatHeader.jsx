import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import axios from 'axios';

const ChatHeader = ({ currentChat }) => {
  const [participant, setParticipant] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    // Thêm debug logs
    console.log("Full current chat data:", currentChat);
    if (currentChat && currentChat.participants) {
      console.log("All participants:", currentChat.participants);
    }
    
    // Nếu có thông tin người nhận từ currentChat
    if (currentChat && currentChat.participants) {
      // Lọc ra người tham gia không phải là sinh viên hiện tại
      const otherParticipant = currentChat.participants.find(
        p => (p.role && !p.role.includes('STUDENT')) && p.userId !== parseInt(localStorage.getItem('userId'))
      );
      
      console.log("Selected participant:", otherParticipant);
      
      if (otherParticipant) {
        setParticipant(otherParticipant);
        
        // Lấy avatar của người dùng nếu cần
        axios.get(`http://localhost:8080/api/student/chat/users/${otherParticipant.userId}/avatar`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          console.log("Avatar response:", response.data);
          setParticipant(prev => ({
            ...prev,
            avatarUrl: response.data.avatarUrl
          }));
        })
        .catch(error => {
          console.error('Error fetching avatar:', error);
        });
        
        // Giả lập trạng thái online
        setIsOnline(true);
      }
    }
  }, [currentChat]);

  // Lấy tên hiển thị cho người dùng
  const getDisplayName = () => {
    if (!participant) return 'Chat Room';
    
    // Nếu có firstName hoặc lastName, sử dụng chúng
    const firstName = participant.firstName || '';
    const lastName = participant.lastName || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    // Fallback tới username
    if (participant.username) {
      return participant.username;
    }
    
    // Nếu không có thông tin, hiển thị theo role
    const role = participant.role || '';
    if (role.includes('ADMIN')) {
      return 'Admin Support';
    }
    if (role.includes('INSTRUCTOR')) {
      return 'Course Instructor';
    }
    
    return 'Chat Room';
  };
  
  // Lấy role display
  const getRoleDisplay = () => {
    if (!participant || !participant.role) return '';
    
    if (participant.role.includes('ADMIN')) {
      return 'Admin Support';
    }
    if (participant.role.includes('INSTRUCTOR')) {
      return 'Course Instructor';
    }
    
    return '';
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {participant && participant.avatarUrl ? (
            <img src={participant.avatarUrl} alt={getDisplayName()} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">
            {getDisplayName()}
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            <p className="text-sm text-gray-500">{isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {getRoleDisplay()}
      </div>
    </header>
  );
};

export default ChatHeader;