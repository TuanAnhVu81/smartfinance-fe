import axiosClient from './axiosClient';

const exportApi = {
  /**
   * Export transactions to CSV format
   * @param {Object} params - Query params { month, year }
   * @returns Promise containing a Blob
   */
  exportToCsv: (params) => {
    return axiosClient.get('/exports/csv', { 
      params,
      responseType: 'blob' // CRITICAL for handling binary files
    });
  },

  /**
   * Export transactions to PDF format
   * @param {Object} params - Query params { month, year }
   * @returns Promise containing a Blob
   */
  exportToPdf: (params) => {
    return axiosClient.get('/exports/pdf', { 
      params,
      responseType: 'blob' // CRITICAL for handling binary files
    });
  }
};

export default exportApi;
