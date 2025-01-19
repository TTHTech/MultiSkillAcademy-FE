import React, { useState } from "react";
import NotificationList from "../../components/admin/Notifications/NotificationList";
import Header from "../../components/admin/common/Header";
import { Bell, Settings, Filter, Inbox, AlertTriangle, CheckCircle, Archive } from "lucide-react";

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    {
      title: "System Update",
      message: "The system will be down for maintenance at 12 AM.",
      time: "10 minutes ago",
      type: "system",
      priority: "high"
    },
    {
      title: "New Message",
      message: "You have received a new message from John Doe.",
      time: "1 hour ago",
      type: "message",
      priority: "medium"
    },
    {
      title: "Reminder",
      message: "Don't forget the meeting at 3 PM.",
      time: "2 hours ago",
      type: "reminder",
      priority: "low"
    },
  ];

  const stats = [
    { title: "All Notifications", count: 28, icon: Inbox, color: "text-blue-500" },
    { title: "System Alerts", count: 5, icon: AlertTriangle, color: "text-red-500" },
    { title: "Read", count: 18, icon: CheckCircle, color: "text-green-500" },
    { title: "Archived", count: 45, icon: Archive, color: "text-gray-500" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#1a1f2b] min-h-screen">
      <Header title="Notifications" />
      
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-[#1E2432] rounded-lg p-4 shadow-lg hover:bg-[#252a3b] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{stat.count}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Controls Section */}
        <div className="bg-[#1E2432] rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeFilter === 'unread' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('unread')}
              >
                Unread
              </button>
              <button 
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeFilter === 'archived' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                onClick={() => setActiveFilter('archived')}
              >
                Archived
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                Mark All Read
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <NotificationList notifications={notifications} />

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center bg-[#1E2432] rounded-lg p-4 shadow-lg">
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Previous
          </button>
          <div className="text-gray-400">
            Page 1 of 3
          </div>
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;