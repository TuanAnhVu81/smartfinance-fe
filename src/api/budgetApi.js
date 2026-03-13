import axiosClient from './axiosClient';

const budgetApi = {
  /**
   * Get all budgets for a specific month and year
   * @param {number} month 
   * @param {number} year 
   * @returns Promise containing array of budgets
   */
  getBudgets: (month, year) => {
    return axiosClient.get('/budgets', { params: { month, year } }).then(response => response.data);
  },

  /**
   * Create a new budget limit for a category
   * @param {Object} data - { categoryId, amountLimit, month, year }
   * @returns Promise
   */
  createBudget: (data) => {
    return axiosClient.post('/budgets', data).then(response => response.data);
  },

  /**
   * Update an existing budget limit
   * @param {string|number} id 
   * @param {Object} data - { amountLimit }
   * @returns Promise
   */
  updateBudget: (id, data) => {
    return axiosClient.put(`/budgets/${id}`, data).then(response => response.data);
  },

  /**
   * Delete a budget
   * @param {string|number} id 
   * @returns Promise
   */
  deleteBudget: (id) => {
    return axiosClient.delete(`/budgets/${id}`).then(response => response.data);
  },
};

export default budgetApi;
