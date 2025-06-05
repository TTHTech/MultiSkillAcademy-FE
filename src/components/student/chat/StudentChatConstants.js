// Student Chat Constants
export const STUDENT_CHAT_CONSTANTS = {
  // API Endpoints
  API: {
    BASE: '/api/student/chat',
    GET_CHATS: '/api/student/chat',
    GET_CHAT_DETAIL: (chatId) => `/api/student/chat/${chatId}`,
    GET_CONTACTS: '/api/student/chat/contacts/available',
    SEARCH_INSTRUCTORS: '/api/student/chat/search/instructors',
    SEARCH_ADMINS: '/api/student/chat/search/admins',
    SEARCH_USERS: '/api/student/chat/search/users',
    CREATE_INDIVIDUAL: '/api/student/chat/create/individual',
    SEND_TEXT_MESSAGE: '/api/student/chat/message/text',
    SEND_MEDIA_MESSAGE: (chatId) => `/api/student/chat/${chatId}/message/media`,
    DELETE_MESSAGE: (chatId, messageId) => `/api/student/chat/${chatId}/message/${messageId}`,
    MARK_AS_READ: (chatId) => `/api/student/chat/${chatId}/read`,
    LEAVE_GROUP: (chatId) => `/api/student/chat/${chatId}/leave`,
    GET_USER_AVATAR: (userId) => `/api/student/chat/users/${userId}/avatar`,
    GET_CHAT_STATS: '/api/student/chat/stats',
    GET_CHAT_WITH_USER: (userId) => `/api/student/chat/with-user/${userId}`
  },

  // WebSocket Destinations
  WEBSOCKET: {
    SEND_MESSAGE: '/app/student/chat.send',
    TYPING: '/app/student/chat.typing',
    TOPIC_TYPING: (chatId) => `/topic/chat/${chatId}/typing`,
    TOPIC_NEW_MESSAGE: (chatId) => `/topic/chat/${chatId}/messages`
  },

  // Chat Types
  CHAT_TYPES: {
    INDIVIDUAL: 'INDIVIDUAL',
    GROUP: 'GROUP'
  },

  // Message Types
  MESSAGE_TYPES: {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    FILE: 'FILE',
    DOCUMENT: 'DOCUMENT'
  },

  // User Roles
  ROLES: {
    STUDENT: 'ROLE_STUDENT',
    INSTRUCTOR: 'ROLE_INSTRUCTOR', 
    ADMIN: 'ROLE_ADMIN'
  },

  // Role Display Names (Vietnamese)
  ROLE_DISPLAY: {
    'ROLE_STUDENT': 'Học viên',
    'STUDENT': 'Học viên',
    'ROLE_INSTRUCTOR': 'Giảng viên',
    'INSTRUCTOR': 'Giảng viên',
    'ROLE_ADMIN': 'Quản trị viên',
    'ADMIN': 'Quản trị viên'
  },

  // File Upload Limits
  FILE_LIMITS: {
    MAX_SIZE: 20 * 1024 * 1024, // 20MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
    ALLOWED_DOCUMENT_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]
  },

  // UI Constants
  UI: {
    SIDEBAR_WIDTH: 360,
    AVATAR_FALLBACK_COLORS: {
      STUDENT: 'bg-blue-500',
      INSTRUCTOR: 'bg-purple-500', 
      ADMIN: 'bg-red-500',
      DEFAULT: 'bg-gray-500'
    },
    THEME_COLORS: {
      PRIMARY: 'blue', // Student theme
      SECONDARY: 'gray',
      SUCCESS: 'green',
      WARNING: 'yellow',
      ERROR: 'red'
    }
  },

  // Error Messages (Vietnamese)
  ERRORS: {
    NETWORK: 'Lỗi kết nối mạng',
    AUTH: 'Vui lòng đăng nhập lại',
    FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
    NOT_FOUND: 'Không tìm thấy dữ liệu',
    FILE_TOO_LARGE: 'Kích thước file không được vượt quá 20MB',
    INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
    SEND_MESSAGE_FAILED: 'Không thể gửi tin nhắn',
    DELETE_MESSAGE_FAILED: 'Không thể xóa tin nhắn',
    LEAVE_GROUP_FAILED: 'Không thể rời khỏi nhóm',
    CREATE_CHAT_FAILED: 'Không thể tạo cuộc trò chuyện',
    LOAD_MESSAGES_FAILED: 'Không thể tải tin nhắn',
    LOAD_CHATS_FAILED: 'Không thể tải danh sách trò chuyện'
  },

  // Success Messages (Vietnamese)
  SUCCESS: {
    MESSAGE_SENT: 'Đã gửi tin nhắn',
    MESSAGE_DELETED: 'Đã xóa tin nhắn',
    MESSAGE_COPIED: 'Đã sao chép tin nhắn',
    LEFT_GROUP: 'Đã rời khỏi nhóm',
    CHAT_CREATED: 'Tạo cuộc trò chuyện thành công'
  },

  // Restrictions for Students
  STUDENT_RESTRICTIONS: {
    CANNOT_CREATE_GROUP: true,
    CANNOT_CHAT_WITH_STUDENTS: true,
    CANNOT_MANAGE_GROUP: true,
    CAN_ONLY_LEAVE_GROUP: true,
    ALLOWED_CONTACT_ROLES: ['INSTRUCTOR', 'ADMIN']
  },

  // Default Avatar URLs
  DEFAULT_AVATARS: {
    STUDENT: "https://ui-avatars.com/api/?name=H&background=3B82F6&color=ffffff&size=128&bold=true",
    INSTRUCTOR: "https://ui-avatars.com/api/?name=G&background=8B5CF6&color=ffffff&size=128&bold=true", 
    ADMIN: "https://ui-avatars.com/api/?name=Q&background=EF4444&color=ffffff&size=128&bold=true",
    GROUP: "https://ui-avatars.com/api/?name=N&background=10B981&color=ffffff&size=128&bold=true",
    DEFAULT: "https://ui-avatars.com/api/?name=U&background=6B7280&color=ffffff&size=128&bold=true"
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER_ID: 'userId', 
    USERNAME: 'username',
    ROLE: 'role',
    CHAT_SETTINGS: 'student_chat_settings'
  },

  // Date/Time Formats
  DATE_FORMATS: {
    MESSAGE_TIME: { hour: '2-digit', minute: '2-digit' },
    MESSAGE_DATE: { day: '2-digit', month: '2-digit' },
    FULL_DATE: { day: '2-digit', month: '2-digit', year: 'numeric' },
    WEEKDAY_DATE: { weekday: 'long', day: '2-digit', month: '2-digit' }
  }
};

// Utility functions
export const STUDENT_CHAT_UTILS = {
  // Get role display name
  getRoleDisplayName: (role) => {
    return STUDENT_CHAT_CONSTANTS.ROLE_DISPLAY[role] || role;
  },

  // Check if file size is valid
  isValidFileSize: (fileSize) => {
    return fileSize <= STUDENT_CHAT_CONSTANTS.FILE_LIMITS.MAX_SIZE;
  },

  // Check if file type is valid
  isValidFileType: (fileType, messageType) => {
    switch (messageType) {
      case 'IMAGE':
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(fileType);
      case 'VIDEO':
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_VIDEO_TYPES.includes(fileType);
      case 'FILE':
        return STUDENT_CHAT_CONSTANTS.FILE_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(fileType);
      default:
        return false;
    }
  },

  // Get avatar color by role
  getAvatarColor: (role) => {
    const cleanRole = role?.replace('ROLE_', '') || 'DEFAULT';
    return STUDENT_CHAT_CONSTANTS.UI.AVATAR_FALLBACK_COLORS[cleanRole] || 
           STUDENT_CHAT_CONSTANTS.UI.AVATAR_FALLBACK_COLORS.DEFAULT;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if user can chat with another user (student restrictions)
  canChatWithUser: (targetRole) => {
    const cleanRole = targetRole?.replace('ROLE_', '');
    return STUDENT_CHAT_CONSTANTS.STUDENT_RESTRICTIONS.ALLOWED_CONTACT_ROLES.includes(cleanRole);
  },

  // Generate default avatar URL
  generateDefaultAvatar: (name, role) => {
    const firstLetter = name?.charAt(0)?.toUpperCase() || 'U';
    const color = STUDENT_CHAT_UTILS.getAvatarColor(role).replace('bg-', '').replace('-500', '');
    const colorMap = {
      'blue': '3B82F6',
      'purple': '8B5CF6', 
      'red': 'EF4444',
      'gray': '6B7280',
      'green': '10B981'
    };
    const hexColor = colorMap[color] || '6B7280';
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=${hexColor}&color=ffffff&size=128&bold=true`;
  }
};

export default STUDENT_CHAT_CONSTANTS;