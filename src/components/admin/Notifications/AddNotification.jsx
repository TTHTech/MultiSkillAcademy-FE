import React, { useState } from 'react';
import { 
  Bell, 
  Users, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  Send,
  Info,
  X
} from 'lucide-react';

const AddNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'default',
    priority: 'normal',
    schedule: 'now',
    scheduledTime: '',
    targetUsers: 'all'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-[1300px] mx-auto">
      {/* Main Container */}
      <div className="grid grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="col-span-2 bg-[#1E2432] rounded-xl shadow-xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Create New Notification</h2>
                <p className="text-sm text-gray-400 mt-1">Send notifications to your users</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title & Message */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                    <span>Notification Title</span>
                    <span className="text-xs text-gray-500">Required</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter notification title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                    <span>Message Content</span>
                    <span className="text-xs text-gray-500">Required</span>
                  </label>
                  <textarea
                    rows="6"
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter notification message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Notification Type
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="default">Default</option>
                    <option value="system">System Update</option>
                    <option value="alert">Alert</option>
                    <option value="message">Message</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Scheduling & Target Users */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Schedule
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  >
                    <option value="now">Send Immediately</option>
                    <option value="schedule">Schedule for Later</option>
                  </select>
                  {formData.schedule === 'schedule' && (
                    <input
                      type="datetime-local"
                      className="mt-3 w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Users
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    value={formData.targetUsers}
                    onChange={(e) => setFormData({...formData, targetUsers: e.target.value})}
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Administrators</option>
                    <option value="teachers">Teachers</option>
                    <option value="students">Students</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-gray-700 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview & Info Section */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="bg-[#1E2432] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span>Preview</span>
            </h3>
            <div className="bg-[#252a3b] p-5 rounded-lg border border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-medium text-white">
                    {formData.title || 'Notification Title'}
                  </h4>
                  <p className="mt-1 text-sm text-gray-300">
                    {formData.message || 'Notification message will appear here'}
                  </p>
                  <div className="mt-3 flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Preview time • Now</span>
                    {formData.priority === 'high' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[#1E2432] rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-400" />
              <span>Tips</span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Keep titles clear and concise</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Use high priority sparingly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Schedule notifications during active hours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;