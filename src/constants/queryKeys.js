/**
 * Centralized keys for React Query caching
 */
export const QUERY_KEYS = {
  auth: {
    me: 'auth/me',
  },
  categories: {
    list: 'categories/list',
    detail: (id) => ['categories/detail', id],
  },
  transactions: {
    list: (filters) => ['transactions/list', filters],
    detail: (id) => ['transactions/detail', id],
  },
  budgets: {
    list: (month, year) => ['budgets/list', { month, year }],
  },
  dashboard: {
    summary: (month, year) => ['dashboard/summary', { month, year }],
    categoryChart: (month, year, type) => ['dashboard/categoryChart', { month, year, type }],
    monthlyChart: (year) => ['dashboard/monthlyChart', { year }],
  },
  aiInsight: {
    get: (month, year) => ['aiInsight/get', { month, year }],
  },
};
