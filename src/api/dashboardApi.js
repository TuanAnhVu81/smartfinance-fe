import axiosClient from './axiosClient';

const dashboardApi = {
  /**
   * Get financial summary (Total income, expense, balance)
   * @param {number} month 
   * @param {number} year 
   * @returns Promise containing summary data
   */
  getSummary: (month, year) => {
    const url = '/dashboard/summary';
    return axiosClient.get(url, { params: { month, year } }).then(response => response.data);
  },

  /**
   * Get category pie chart data (Income or Expense)
   * @param {number} month 
   * @param {number} year 
   * @param {string} type - 'INCOME' or 'EXPENSE' (REQUIRED)
   * @returns Promise containing category chart data
   */
  getCategoryChart: (month, year, type) => {
    const url = '/dashboard/chart/category';
    return axiosClient.get(url, { params: { month, year, type } }).then(response => response.data);
  },

  /**
   * Get monthly bar chart data for all 12 months in a year
   * @param {number} year 
   * @returns Promise containing 12 months chart data
   */
  getMonthlyChart: (year) => {
    const url = '/dashboard/chart/monthly';
    return axiosClient.get(url, { params: { year } }).then(response => response.data);
  }
};

export default dashboardApi;
