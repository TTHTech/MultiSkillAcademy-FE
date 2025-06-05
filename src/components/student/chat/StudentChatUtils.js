import { STUDENT_CHAT_CONSTANTS } from './StudentChatConstants';

/**
 * Student Chat Utility Functions
 * Provides validation, formatting, and helper functions for student chat system
 */

export const StudentChatUtils = {
  
  // ========== VALIDATION FUNCTIONS ==========
  
  /**
   * Validate file for upload
   * @param {File} file - File to validate
   * @param {string} messageType - Type of message (IMAGE, VIDEO, FILE)
   * @returns {Object} Validation result with isValid and errors
   */
  validateFile: (file, messageType) => {
    const errors = [];
    
    if (!file) {
      errors.push('Không có file được chọn');
      return { isValid: false, errors };
    }
    
    // Check file size
    if (file.size > STUDENT_CHAT_CONSTANTS.FILE_LIMITS.MAX_SIZE) {
      errors.push(STUDENT_CHAT_CONSTANTS.ERRORS.FILE_TOO_LARGE);
    }
    
    // Check file type
    const allowedTypes = StudentChatUtils.getAllowedFileTypes(messageType);
    if (!allowedTypes.includes(file.type)) {
      errors.push(STUDENT_CHAT_CONSTANTS.ERRORS.INVALID_FILE_TYPE);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Get allowed file types for message type
   * @param {string} messageType - MESSAGE_TYPES constant
   * @returns {Array} Array of allowed MIME types
   */
  getAllowedFileTypes: (messageType) => {
    switch (messageType) {
      case STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.IMAGE:
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES;
      case STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.VIDEO:
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_VIDEO_TYPES;
      case STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.FILE:
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_DOCUMENT_TYPES;
      default:
        return [];
    }
  },
  
  /**
   * Validate message content
   * @param {string} content - Message content
   * @returns {Object} Validation result
   */
  validateMessageContent: (content) => {
    const errors = [];
    
    if (!content || content.trim().length === 0) {
      errors.push('Tin nhắn không được để trống');
    }
    
    if (content.length > 5000) {
      errors.push('Tin nhắn quá dài (tối đa 5000 ký tự)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  /**
   * Check if user can chat with target role
   * @param {string} targetRole - Role of target user
   * @returns {boolean} Whether chat is allowed
   */
  canChatWithRole: (targetRole) => {
    const cleanRole = targetRole?.replace('ROLE_', '');
    return STUDENT_CHAT_CONSTANTS.STUDENT_RESTRICTIONS.ALLOWED_CONTACT_ROLES.includes(cleanRole);
  },
  
  // ========== FORMATTING FUNCTIONS ==========
  
  /**
   * Format file size to human readable string
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  /**
   * Format timestamp for message display
   * @param {string|Date} timestamp - Timestamp to format
   * @returns {string} Formatted time string
   */
  formatMessageTime: (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const timeString = date.toLocaleTimeString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.MESSAGE_TIME);
      
      if (messageDate.getTime() === today.getTime()) {
        return timeString;
      } else if (messageDate.getTime() === yesterday.getTime()) {
        return `Hôm qua ${timeString}`;
      } else if (date.getFullYear() === now.getFullYear()) {
        const dateString = date.toLocaleDateString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.MESSAGE_DATE);
        return `${dateString} ${timeString}`;
      } else {
        const dateString = date.toLocaleDateString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.FULL_DATE);
        return `${dateString} ${timeString}`;
      }
    } catch (error) {
      console.error('Error formatting message time:', error);
      return '';
    }
  },
  
  /**
   * Format timestamp for chat list (last message time)
   * @param {string|Date} timestamp - Timestamp to format
   * @returns {string} Formatted time string
   */
  formatChatTime: (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.MESSAGE_TIME);
      } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'Hôm qua';
      } else {
        return date.toLocaleDateString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.MESSAGE_DATE);
      }
    } catch (error) {
      console.error('Error formatting chat time:', error);
      return '';
    }
  },
  
  /**
   * Get message date group for date separators
   * @param {string|Date} timestamp - Timestamp
   * @returns {string} Date group string
   */
  getMessageDateGroup: (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (messageDate.getTime() === today.getTime()) {
        return 'Hôm nay';
      } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'Hôm qua';
      } else if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('vi-VN', STUDENT_CHAT_CONSTANTS.DATE_FORMATS.WEEKDAY_DATE);
      } else {
        return date.toLocaleDateString('vi-VN', {
          ...STUDENT_CHAT_CONSTANTS.DATE_FORMATS.WEEKDAY_DATE,
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Error getting message date group:', error);
      return '';
    }
  },
  
  /**
   * Get role display name
   * @param {string} role - User role
   * @returns {string} Localized role name
   */
  getRoleDisplayName: (role) => {
    return STUDENT_CHAT_CONSTANTS.ROLE_DISPLAY[role] || role || '';
  },
  
  // ========== UI HELPER FUNCTIONS ==========
  
  /**
   * Generate default avatar URL
   * @param {string} name - User name
   * @param {string} role - User role
   * @returns {string} Avatar URL
   */
  generateDefaultAvatar: (name, role) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || 'U';
    const colorClass = StudentChatUtils.getAvatarColorClass(role);
    
    // Convert Tailwind class to hex color
    const colorMap = {
      'bg-blue-500': '3B82F6',
      'bg-purple-500': '8B5CF6',
      'bg-red-500': 'EF4444',
      'bg-gray-500': '6B7280',
      'bg-green-500': '10B981'
    };
    
    const hexColor = colorMap[colorClass] || '6B7280';
    
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=${hexColor}&color=ffffff&size=128&bold=true`;
  },
  
  /**
   * Get avatar color class by role
   * @param {string} role - User role
   * @returns {string} Tailwind CSS color class
   */
  getAvatarColorClass: (role) => {
    const cleanRole = role?.replace('ROLE_', '') || 'DEFAULT';
    return STUDENT_CHAT_CONSTANTS.UI.AVATAR_FALLBACK_COLORS[cleanRole] || 
           STUDENT_CHAT_CONSTANTS.UI.AVATAR_FALLBACK_COLORS.DEFAULT;
  },
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncateText: (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  },
  
  /**
   * Get message type from file
   * @param {File} file - File object
   * @returns {string} Message type constant
   */
  getMessageTypeFromFile: (file) => {
    if (!file) return STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.TEXT;
    
    const { type } = file;
    
    if (STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(type)) {
      return STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.IMAGE;
    }
    
    if (STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_VIDEO_TYPES.includes(type)) {
      return STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.VIDEO;
    }
    
    if (STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(type)) {
      return STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.FILE;
    }
    
    return STUDENT_CHAT_CONSTANTS.MESSAGE_TYPES.FILE;
  },
  
  // ========== SEARCH AND FILTER FUNCTIONS ==========
  
  /**
   * Filter chats by search term and type
   * @param {Array} chats - Array of chats
   * @param {string} searchTerm - Search query
   * @param {string} filter - Chat type filter
   * @param {number} currentUserId - Current user ID
   * @returns {Array} Filtered chats
   */
  filterChats: (chats, searchTerm, filter, currentUserId) => {
    return chats.filter(chat => {
      // Type filter
      if (filter !== 'ALL') {
        if (filter === 'GROUP' && chat.chatType !== STUDENT_CHAT_CONSTANTS.CHAT_TYPES.GROUP) return false;
        if (filter === 'INDIVIDUAL' && chat.chatType !== STUDENT_CHAT_CONSTANTS.CHAT_TYPES.INDIVIDUAL) return false;
      }
      
      // Search filter
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Search in group name
      if (chat.chatType === STUDENT_CHAT_CONSTANTS.CHAT_TYPES.GROUP && chat.groupName) {
        if (chat.groupName.toLowerCase().includes(searchLower)) return true;
      }
      
      // Search in participant names
      const participantMatch = chat.participants?.some(p => {
        if (p.userId === currentUserId) return false; // Exclude self
        
        const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
        return fullName.includes(searchLower) ||
               p.firstName?.toLowerCase().includes(searchLower) ||
               p.lastName?.toLowerCase().includes(searchLower);
      });
      
      return participantMatch;
    });
  },
  
  /**
   * Filter users for contact search
   * @param {Array} users - Array of users
   * @param {string} searchTerm - Search query
   * @param {string} roleFilter - Role filter
   * @returns {Array} Filtered users
   */
  filterUsers: (users, searchTerm, roleFilter) => {
    return users.filter(user => {
      // Only allow instructors and admins for students
      const userRole = user.role?.replace('ROLE_', '');
      if (!StudentChatUtils.canChatWithRole(user.role)) return false;
      
      // Role filter
      if (roleFilter !== 'ALL' && userRole !== roleFilter) return false;
      
      // Search filter
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      
      return fullName.includes(searchLower) ||
             user.firstName?.toLowerCase().includes(searchLower) ||
             user.lastName?.toLowerCase().includes(searchLower) ||
             user.username?.toLowerCase().includes(searchLower);
    });
  },
  
  // ========== URL AND FILE HELPERS ==========
  
  /**
   * Build full file URL from relative path
   * @param {string} fileUrl - File URL or path
   * @param {string} baseUrl - Base URL
   * @returns {string|null} Full file URL
   */
  buildFullFileUrl: (fileUrl, baseUrl) => {
    if (!fileUrl) return null;
    
    // Already full URL
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      return fileUrl;
    }
    
    // Firebase storage
    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      return fileUrl.startsWith('https://') ? fileUrl : `https://${fileUrl}`;
    }
    
    // API file URL
    if (fileUrl.includes('/api/student/chat/files/')) {
      const fileName = fileUrl.split('/').pop();
      return `${baseUrl}/api/student/chat/files/${fileName}`;
    }
    
    // Relative API path
    if (fileUrl.startsWith('/api/')) {
      return `${baseUrl}${fileUrl}`;
    }
    
    // Uploads directory
    if (fileUrl.includes('/uploads/')) {
      return `${baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    }
    
    // Default: assume it's in uploads
    if (!fileUrl.includes('/') && !fileUrl.includes(':\\')) {
      return `${baseUrl}/uploads/${fileUrl}`;
    }
    
    return fileUrl;
  },
  
  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  },
  
  // ========== STORAGE HELPERS ==========
  
  /**
   * Get current user info from localStorage
   * @returns {Object|null} User info object
   */
  getCurrentUser: () => {
    const userId = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USER_ID);
    const username = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USERNAME);
    const role = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.ROLE);
    
    if (userId && username && role) {
      return {
        userId: parseInt(userId),
        username,
        role
      };
    }
    
    return null;
  },
  
  /**
   * Check if current user is authenticated as student
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.TOKEN);
    const role = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.ROLE);
    return !!(token && role === STUDENT_CHAT_CONSTANTS.ROLES.STUDENT);
  }
};

export default StudentChatUtils;