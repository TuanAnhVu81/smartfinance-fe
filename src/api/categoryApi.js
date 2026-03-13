import axiosClient from './axiosClient';

const categoryApi = {
  /**
   * Get list of all categories
   * @returns Promise containing category data
   */
  getAllCategories: () => {
    return axiosClient.get('/categories').then(response => response.data);
  },
};

export default categoryApi;
