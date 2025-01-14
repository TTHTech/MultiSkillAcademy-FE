import React from "react";
import { Bell, X, Star, Clock, CheckCircle, AlertTriangle, MessageSquare } from "lucide-react";

const NotificationItem = ({ 
  title, 
  message, 
  time, 
  type = 'default', 
  priority = 'normal',
  isRead = false 
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'system':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-transparent';
    }
  };

  return (
    <div className={`
      bg-[#1E2432] hover:bg-[#252a3b] 
      rounded-lg border-l-4 ${getPriorityColor()}
      p-4 mb-3 transition-all duration-200
      ${!isRead ? 'shadow-lg' : 'opacity-80'}
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
              {priority === 'high' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-full">
                  High Priority
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <Star className="w-4 h-4 text-gray-400 hover:text-yellow-400" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
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
              {!isRead && (
                <button className="flex items-center text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Mark as read
                </button>
              )}
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