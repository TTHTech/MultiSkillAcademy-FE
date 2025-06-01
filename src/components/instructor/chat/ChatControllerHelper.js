import React from 'react';
import { toast } from 'react-toastify';

const ChatControllerHelper = {
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
  }
};

export default ChatControllerHelper;