import React from "react";
import { Bell, X, Star, Clock, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";

const NotificationItem = ({
  title,
  message,
  time,
  targetType, // Thay type bằng targetType để match với API
  priority = 'normal',
  isRead = false,
  onDelete // Thêm prop để handle delete
}) => {
  const getTypeIcon = () => {
    switch (targetType) {
      case 'STUDENT':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'INSTRUCTOR':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'ALL':
        return <Bell className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = () => {
    switch (targetType) { // Dùng targetType để set màu border
      case 'STUDENT':
        return 'border-l-blue-500';
      case 'INSTRUCTOR':
        return 'border-l-amber-500';
      case 'ALL':
        return 'border-l-purple-500';
      default:
        return 'border-l-transparent';
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case 'STUDENT':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full">
            Students
          </span>
        );
      case 'INSTRUCTOR':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-400 rounded-full">
            Instructors
          </span>
        );
      case 'ALL':
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full">
            All Users
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`
      bg-[#1E2432] hover:bg-[#252a3b] 
      rounded-lg border-l-4 ${getPriorityColor()}
      p-4 mb-3 transition-all duration-200
    `}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-medium text-white truncate">{title}</h4>
              {getTargetLabel()}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onDelete}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-300 line-clamp-2">{message}</p>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {time}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;