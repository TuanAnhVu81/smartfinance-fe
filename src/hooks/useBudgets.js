import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import budgetApi from '../api/budgetApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { toast } from 'react-hot-toast';

/**
 * Hook to fetch budgets for a specific month and year
 * @param {number} month 
 * @param {number} year 
 */
export const useBudgets = (month, year) => {
  return useQuery({
    queryKey: QUERY_KEYS.BUDGETS.LIST(month, year),
    queryFn: () => budgetApi.getBudgets(month, year),
    enabled: !!month && !!year,
  });
};

/**
 * Hook to create a new budget
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => budgetApi.createBudget(data),
    onSuccess: () => {
      toast.success('Budget added successfully!');
      // Invalidate relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add budget.');
    }
  });
};

/**
 * Hook to update an existing budget
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => budgetApi.updateBudget(id, data),
    onSuccess: () => {
      toast.success('Budget updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update budget.');
    }
  });
};

/**
 * Hook to delete a budget
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => budgetApi.deleteBudget(id),
    onSuccess: () => {
      toast.success('Budget deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete budget.');
    }
  });
};
