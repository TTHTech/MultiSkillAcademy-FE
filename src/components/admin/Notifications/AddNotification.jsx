import React, { useState } from 'react';
import { 
  Bell, 
  MessageSquare,
  Send,
  Info,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const AddNotification = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetType: 'ALL'  // Changed to match enum TargetType
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login first.");
      }

      const response = await fetch(`${baseUrl}/api/admin/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to create notification");
      }

      const data = await response.json();
      console.log('Notification created:', data);
      toast.success("Notification sent successfully!");
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        targetType: 'ALL'
      });
      
    } catch (err) {
      console.error('Error creating notification:', err);
      toast.error(err.message || "Failed to send notification");
    }
  };

  return (
    <div className="w-[1300px] mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="col-span-2 bg-[#1E2432] rounded-xl shadow-xl">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Create New Notification</h2>
                <p className="text-sm text-gray-400 mt-1">Send notifications to your users</p>
              </div>
            </div>
          </div>

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
                    required
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
                    required
                  />
                </div>
              </div>

              {/* Target Users */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Users
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-[#252a3b] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.targetType}
                  onChange={(e) => setFormData({...formData, targetType: e.target.value})}
                  required
                >
                  <option value="ALL">All Users</option>
                  <option value="STUDENT">Students</option>
                  <option value="INSTRUCTOR">Instructors</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-gray-700 flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  onClick={() => {
                    setFormData({
                      title: '',
                      message: '',
                      targetType: 'ALL'
                    });
                  }}
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
                    <span className="text-xs text-gray-400">To: {formData.targetType}</span>
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
                <span>Specify target audience clearly</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                <span>Double check message before sending</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;