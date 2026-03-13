import axiosClient from './axiosClient';

const aiInsightApi = {
  /**
   * Get AI financial insights for a specific month and year
   * @param {number} month 
   * @param {number} year 
   * @returns Promise containing insight data { aiResponse, updatedAt, isOutdated }
   */
  getInsight: (month, year) => {
    return axiosClient.get('/ai-insights', { params: { month, year } }).then(response => response.data);
  },

  /**
   * Force refresh AI analysis for a specific month and year
   * @param {number} month 
   * @param {number} year 
   * @returns Promise containing updated insight data
   */
  refreshInsight: (month, year) => {
    return axiosClient.post('/ai-insights/refresh', null, { params: { month, year } }).then(response => response.data);
  },
  /**
   * Send a follow-up question to the AI
   */
  chat: (message, month, year) => {
    return axiosClient.post('/ai-insights/chat', { message, month, year }).then(response => response.data);
  },
};

export default aiInsightApi;
