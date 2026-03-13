import axiosClient from './axiosClient';

const transactionApi = {
  /**
   * Get transactions with pagination and filters
   * @param {Object} params - Query params like { page, size, month, year, categoryId, type }
   * @returns Promise containing paginated data (Spring Page structure in response.data.data)
   */
  getTransactions: (params) => {
    return axiosClient.get('/transactions', { params }).then(response => response.data);
  },

  /**
   * Get transaction details by ID
   * @param {string|number} id 
   * @returns Promise
   */
  getTransactionById: (id) => {
    return axiosClient.get(`/transactions/${id}`).then(response => response.data);
  },

  /**
   * Create a new transaction
   * @param {Object} data - Transaction data { amount, date, note, categoryId, type }
   * @returns Promise
   */
  createTransaction: (data) => {
    return axiosClient.post('/transactions', data).then(response => response.data);
  },

  /**
   * Update an existing transaction
   * @param {string|number} id 
   * @param {Object} data 
   * @returns Promise
   */
  updateTransaction: (id, data) => {
    return axiosClient.put(`/transactions/${id}`, data).then(response => response.data);
  },

  /**
   * Delete a transaction
   * @param {string|number} id 
   * @returns Promise
   */
  deleteTransaction: (id) => {
    return axiosClient.delete(`/transactions/${id}`).then(response => response.data);
  },
};

export default transactionApi;
