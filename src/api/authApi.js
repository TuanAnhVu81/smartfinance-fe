import axiosClient from './axiosClient';

/**
 * Authentication API Endpoints
 * API functions for login and registration processes
 */
export const authApi = {
  /**
   * User login
   * @param {Object} credentials - Login information { username, password }
   * @returns {Promise<Object>} Promise containing response data
   */
  login: async (credentials) => {
    // Call login API via axiosClient
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} data - Registration information { username, email, password }
   * @returns {Promise<Object>} Promise containing response data
   */
  register: async (data) => {
    // Call register API via axiosClient
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  }
};
