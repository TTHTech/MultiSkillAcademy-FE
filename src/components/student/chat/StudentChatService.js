import { STUDENT_CHAT_CONSTANTS } from './StudentChatConstants';

const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

class StudentChatService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.TOKEN);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Get auth headers for multipart
  getAuthHeadersMultipart() {
    const token = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.TOKEN);
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
        throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.AUTH);
      }
      
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      } catch {
        errorMessage = `HTTP ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // ========== CHAT MANAGEMENT ==========

  // Get all chats
  async getAllChats() {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_CHATS}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.LOAD_CHATS_FAILED);
    }
  }

  // Get chat detail
  async getChatDetail(chatId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_CHAT_DETAIL(chatId)}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching chat detail:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.LOAD_MESSAGES_FAILED);
    }
  }

  // Get chats by type
  async getChatsByType(type) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.BASE}/type/${type}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching chats by type:', error);
      throw error;
    }
  }

  // Get chat with specific user
  async getChatWithUser(userId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_CHAT_WITH_USER(userId)}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching chat with user:', error);
      throw error;
    }
  }

  // ========== CONTACTS & SEARCH ==========

  // Get available contacts (instructors and admins)
  async getAvailableContacts() {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_CONTACTS}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  // Search instructors
  async searchInstructors(keyword = '') {
    try {
      const url = `${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.SEARCH_INSTRUCTORS}${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`;
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching instructors:', error);
      throw error;
    }
  }

  // Search admins
  async searchAdmins(keyword = '') {
    try {
      const url = `${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.SEARCH_ADMINS}${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`;
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching admins:', error);
      throw error;
    }
  }

  // Search users (instructors and admins)
  async searchUsers(keyword = '') {
    try {
      const url = `${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.SEARCH_USERS}${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`;
      const response = await fetch(url, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // ========== CHAT CREATION ==========

  // Create individual chat
  async createIndividualChat(participantId, initialMessage = '') {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.CREATE_INDIVIDUAL}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          participantId,
          initialMessage: initialMessage || 'Xin chào! Đây là học viên.'
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating individual chat:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.CREATE_CHAT_FAILED);
    }
  }

  // ========== MESSAGING ==========

  // Send text message
  async sendTextMessage(chatId, content, messageType = 'TEXT') {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.SEND_TEXT_MESSAGE}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          chatId,
          content,
          messageType
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending text message:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.SEND_MESSAGE_FAILED);
    }
  }

  // Send media message (file, image, video)
  async sendMediaMessage(chatId, file, messageType) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('messageType', messageType);

      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.SEND_MEDIA_MESSAGE(chatId)}`, {
        method: 'POST',
        headers: this.getAuthHeadersMultipart(),
        body: formData
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending media message:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.SEND_MESSAGE_FAILED);
    }
  }

  // Delete message
  async deleteMessage(chatId, messageId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.DELETE_MESSAGE(chatId, messageId)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.DELETE_MESSAGE_FAILED);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.DELETE_MESSAGE_FAILED);
    }
  }

  // Mark messages as read
  async markAsRead(chatId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.MARK_AS_READ(chatId)}`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }
      
      return true;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  // ========== GROUP MANAGEMENT ==========

  // Leave group (students can only leave, not manage)
  async leaveGroup(chatId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.LEAVE_GROUP(chatId)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.LEAVE_GROUP_FAILED);
      }
      
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      throw new Error(STUDENT_CHAT_CONSTANTS.ERRORS.LEAVE_GROUP_FAILED);
    }
  }

  // ========== USER & AVATAR ==========

  // Get user avatar
  async getUserAvatar(userId) {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_USER_AVATAR(userId)}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user avatar:', error);
      // Return null instead of throwing, as avatar is not critical
      return null;
    }
  }

  // ========== STATISTICS ==========

  // Get chat statistics
  async getChatStats() {
    try {
      const response = await fetch(`${this.baseUrl}${STUDENT_CHAT_CONSTANTS.API.GET_CHAT_STATS}`, {
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }

  // ========== FILE VALIDATION ==========

  // Validate file before upload
  validateFile(file, messageType) {
    const errors = [];

    // Check file size
    if (!STUDENT_CHAT_CONSTANTS.STUDENT_CHAT_UTILS?.isValidFileSize(file.size)) {
      errors.push(STUDENT_CHAT_CONSTANTS.ERRORS.FILE_TOO_LARGE);
    }

    // Check file type
    if (!STUDENT_CHAT_CONSTANTS.STUDENT_CHAT_UTILS?.isValidFileType(file.type, messageType)) {
      errors.push(STUDENT_CHAT_CONSTANTS.ERRORS.INVALID_FILE_TYPE);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // ========== WEBSOCKET HELPERS ==========

  // Get WebSocket message payload
  getWebSocketMessagePayload(chatId, content, messageType = 'TEXT') {
    return {
      chatId,
      content,
      messageType,
      userId: parseInt(localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USER_ID)),
      username: localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USERNAME) || 'Student',
      timestamp: new Date().toISOString()
    };
  }

  // Get typing status payload
  getTypingStatusPayload(chatId, isTyping) {
    return {
      chatId,
      userId: parseInt(localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USER_ID)),
      username: localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USERNAME) || 'Student',
      isTyping
    };
  }

  // ========== UTILITY METHODS ==========

  // Get current user ID
  getCurrentUserId() {
    return parseInt(localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USER_ID)) || 0;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.TOKEN);
    const role = localStorage.getItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.ROLE);
    return !!(token && role === STUDENT_CHAT_CONSTANTS.ROLES.STUDENT);
  }

  // Clear authentication
  clearAuth() {
    localStorage.removeItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.USERNAME);
    localStorage.removeItem(STUDENT_CHAT_CONSTANTS.STORAGE_KEYS.ROLE);
  }

  // Build full file URL
  buildFileUrl(fileUrl) {
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
      return `${this.baseUrl}/api/student/chat/files/${fileName}`;
    }

    // Relative API path
    if (fileUrl.startsWith('/api/')) {
      return `${this.baseUrl}${fileUrl}`;
    }

    // Uploads directory
    if (fileUrl.includes('/uploads/')) {
      return `${this.baseUrl}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
    }

    // Default: assume it's in uploads
    if (!fileUrl.includes('/') && !fileUrl.includes(':\\')) {
      return `${this.baseUrl}/uploads/${fileUrl}`;
    }

    return fileUrl;
  }
}

// Export singleton instance
export default new StudentChatService();