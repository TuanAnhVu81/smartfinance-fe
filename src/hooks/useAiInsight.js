import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aiInsightApi from '../api/aiInsightApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { toast } from 'react-hot-toast';

/**
 * Hook to fetch AI Insight data
 * @param {number} month 
 * @param {number} year 
 */
export const useAiInsight = (month, year) => {
  return useQuery({
    queryKey: QUERY_KEYS.AI_INSIGHT.GET(month, year),
    queryFn: () => aiInsightApi.getInsight(month, year),
    enabled: !!month && !!year,
    // AI data might take a while to generate initially, give it a longer stale time
    staleTime: 5 * 60 * 1000, 
    // Don't retry automatically too many times if it fails (it can be expensive)
    retry: 1, 
  });
};

/**
 * Hook to force refresh/regenerate AI Insight
 */
export const useRefreshAiInsight = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ month, year }) => aiInsightApi.refreshInsight(month, year),
    onSuccess: (data, variables) => {
      toast.success('AI analysis refreshed successfully!');
      // Explicitly invalidate the query with matching month and year
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.AI_INSIGHT.GET(variables.month, variables.year) 
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to refresh AI analysis. Please try again later.');
    }
  });
};
