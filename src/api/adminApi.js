import axiosClient from './axiosClient';

/**
 * Admin API service for system management
 */
const adminApi = {
  /**
   * Get all users in the system (Admin only)
   * @param {Object} params - pagination and filter params
   */
  getAllUsers: (params) => {
    return axiosClient.get('/admin/users', { params }).then(response => response.data);
  },

  /**
   * Toggle user status (Active/Locked)
   * @param {number} userId 
   * @param {boolean} isActive 
   */
  toggleUserStatus: (userId, isActive) => {
    return axiosClient.put(`/admin/users/${userId}/status`, null, {
      params: { enabled: isActive }
    }).then(response => response.data);
  },

  /**
   * Get system summary stats (Admin only)
   */
  getAdminSummary: () => {
    return axiosClient.get('/admin/summary').then(response => response.data);
  }
};

export default adminApi;
