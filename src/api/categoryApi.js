import axiosClient from './axiosClient';

const categoryApi = {
  /**
   * Get list of all categories
   * @returns Promise containing category data
   */
  getAllCategories: () => {
    return axiosClient.get('/categories').then(response => response.data);
  },

  /**
   * Create a new category
   * @param {Object} data - { name, type, icon, color }
   * @returns Promise
   */
  createCategory: (data) => {
    return axiosClient.post('/categories', data).then(response => response.data);
  },

  /**
   * Update an existing category
   * @param {string|number} id 
   * @param {Object} data - { name, type, icon, color }
   * @returns Promise
   */
  updateCategory: (id, data) => {
    return axiosClient.put(`/categories/${id}`, data).then(response => response.data);
  },

  /**
   * Delete a category
   * @param {string|number} id 
   * @returns Promise
   */
  deleteCategory: (id) => {
    return axiosClient.delete(`/categories/${id}`).then(response => response.data);
  }
};

export default categoryApi;
