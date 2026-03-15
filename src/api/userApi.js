import axiosClient from './axiosClient';

const userApi = {
  /**
   * Get current user profile information
   * @returns Promise containing user data
   */
  getMe: () => {
    return axiosClient.get('/users/me').then(response => response.data);
  },

  /**
   * Update user profile information (like name, avatarUrl)
   * @param {Object} data 
   * @returns Promise containing updated user data
   */
  updateProfile: (data) => {
    return axiosClient.put('/users/me', data).then(response => response.data);
  },

  /**
   * Change user password
   * @param {Object} data - { currentPassword, newPassword, confirmPassword }
   * @returns Promise
   */
  changePassword: (data) => {
    return axiosClient.put('/users/me/password', data).then(response => response.data);
  }
};

export default userApi;
