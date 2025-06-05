import React from 'react';
import { toast } from 'react-toastify';

const StudentChatControllerHelper = {
  handleRequest: async (requestFunc) => {
    try {
      const result = await requestFunc();
      return { status: 200, data: result };
    } catch (error) {
      console.error('Request error:', error);
      return { 
        status: error.response?.status || 500, 
        error: error.message || 'An error occurred' 
      };
    }
  },

  handleVoidRequest: async (requestFunc) => {
    try {
      await requestFunc();
      return { status: 200 };
    } catch (error) {
      console.error('Request error:', error);
      return { 
        status: error.response?.status || 500, 
        error: error.message || 'An error occurred' 
      };
    }
  },

  extractTokenFromRequest: (request) => {
    const authHeader = request.headers.Authorization || request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
};

export default StudentChatControllerHelper;