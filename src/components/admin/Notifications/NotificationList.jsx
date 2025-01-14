import React, { useState } from "react";
import { 
  Bell, 
  Settings, 
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronDown,
  Mail,
  Inbox
} from "lucide-react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const stats = [
    { label: 'All', count: notifications.length, icon: Inbox },
    { label: 'Unread', count: notifications.filter(n => !n.isRead).length, icon: Mail },
    { label: 'Important', count: notifications.filter(n => n.priority === 'high').length, icon: AlertCircle }
  ];

  return (
    <div className="bg-[#1E2432] rounded-lg shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <p className="text-sm text-gray-400 mt-1">
                You have {notifications.filter(n => !n.isRead).length} unread messages
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-400 hover:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400 hover:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => setActiveFilter(stat.label.toLowerCase())}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeFilter === stat.label.toLowerCase()
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <stat.icon className="w-4 h-4" />
              <span>{stat.label}</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
                {stat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-700 bg-[#252a3b]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full px-4 py-2 bg-[#1E2432] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select className="px-4 py-2 bg-[#1E2432] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500">
                <option value="all">All Types</option>
                <option value="system">System</option>
                <option value="message">Message</option>
                <option value="reminder">Reminder</option>
              </select>
              <select className="px-4 py-2 bg-[#1E2432] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500">
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Container */}
      <div className="divide-y divide-gray-700/50">
        {notifications.length > 0 ? (
          <div className="p-6 space-y-4">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                {...notification}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Inbox className="w-12 h-12 text-gray-600" />
              <p className="text-gray-400">No notifications found</p>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Showing {notifications.length} notifications
            </span>
            <button 
              className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View all notifications</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;