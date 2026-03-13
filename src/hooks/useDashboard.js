import { useQuery } from '@tanstack/react-query';
import dashboardApi from '../api/dashboardApi';
import { QUERY_KEYS } from '../constants/queryKeys';

/**
 * Custom hook to fetch all dashboard data concurrently
 * @param {number} month 
 * @param {number} year 
 * @returns Object containing all queries (summary, income chart, expense chart, monthly chart)
 */
const useDashboard = (month, year) => {
  // Query for summary data (Total income, expense, balance)
  const summaryQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY(month, year),
    queryFn: () => dashboardApi.getSummary(month, year),
    enabled: !!month && !!year,
  });

  // Query for income category chart data
  const incomeChartQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.CATEGORY_CHART(month, year, 'INCOME'),
    queryFn: () => dashboardApi.getCategoryChart(month, year, 'INCOME'),
    enabled: !!month && !!year,
  });

  // Query for expense category chart data
  const expenseChartQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.CATEGORY_CHART(month, year, 'EXPENSE'),
    queryFn: () => dashboardApi.getCategoryChart(month, year, 'EXPENSE'),
    enabled: !!month && !!year,
  });

  // Query for monthly chart data based on year
  const monthlyChartQuery = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.MONTHLY_CHART(year),
    queryFn: () => dashboardApi.getMonthlyChart(year),
    enabled: !!year,
  });

  return { summaryQuery, incomeChartQuery, expenseChartQuery, monthlyChartQuery };
};

export default useDashboard;
