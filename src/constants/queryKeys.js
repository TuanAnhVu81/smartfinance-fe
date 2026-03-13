/**
 * Centralized keys for React Query caching
 */
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
  },
  CATEGORIES: {
    LIST: ['categories', 'list'],
    DETAIL: (id) => ['categories', 'detail', id],
  },
  TRANSACTIONS: {
    LIST: (filters) => ['transactions', 'list', filters],
    DETAIL: (id) => ['transactions', 'detail', id],
  },
  BUDGETS: {
    LIST: (month, year) => ['budgets', 'list', month, year],
  },
  DASHBOARD: {
    SUMMARY: (month, year) => ['dashboard', 'summary', month, year],
    CATEGORY_CHART: (month, year, type) => ['dashboard', 'categoryChart', month, year, type],
    MONTHLY_CHART: (year) => ['dashboard', 'monthlyChart', year],
  },
  AI_INSIGHT: {
    GET: (month, year) => ['aiInsight', 'get', month, year],
  },
};
