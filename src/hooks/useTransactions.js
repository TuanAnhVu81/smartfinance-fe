import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import transactionApi from '../api/transactionApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { toast } from 'react-hot-toast';

/**
 * Hook to fetch paginated transactions based on filters
 * @param {Object} filters - Query parameters for pagination and filtering
 */
export const useTransactions = (filters) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.LIST(filters),
    queryFn: () => transactionApi.getTransactions(filters),
    // Keep previous data while fetching new pages to avoid UI flickering
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to create a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => transactionApi.createTransaction(data),
    onSuccess: () => {
      toast.success('Transaction added successfully!');
      // Invalidate relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to add transaction.');
    }
  });
};

/**
 * Hook to update an existing transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => transactionApi.updateTransaction(id, data),
    onSuccess: () => {
      toast.success('Transaction updated successfully!');
      // Invalidate relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update transaction.');
    }
  });
};

/**
 * Hook to delete a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => transactionApi.deleteTransaction(id),
    onSuccess: () => {
      toast.success('Transaction deleted successfully!');
      // Invalidate relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['aiInsight'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to delete transaction.');
    }
  });
};
