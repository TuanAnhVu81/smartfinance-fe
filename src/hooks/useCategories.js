import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../api/categoryApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { toast } from 'react-hot-toast';

/**
 * Custom hook to fetch and cache the list of categories
 * Categories are used in filters and forms, so caching them is efficient
 */
export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST,
    queryFn: () => categoryApi.getAllCategories(),
    // Cache categories for 5 minutes since they don't change very frequently
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => categoryApi.createCategory(data),
    onSuccess: () => {
      toast.success('Category created successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.LIST });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to create category.');
    }
  });
};

/**
 * Hook to update an existing category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully!');
      // Invalidate related queries where categories might be used
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.LIST({})[0] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BUDGETS.LIST()[0] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY()[0] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update category.');
    }
  });
};

/**
 * Hook to delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted successfully!');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.LIST({})[0] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BUDGETS.LIST()[0] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.SUMMARY()[0] });
    },
    onError: (error) => {
      const msg = error?.response?.data?.message;
      if (msg === 'CATEGORY_HAS_TRANSACTIONS' || error?.response?.status === 409 || msg?.includes('transaction')) {
         toast.error('Cannot delete this category because there are transactions associated with it. Please delete the related transactions first.');
      } else {
         toast.error(msg || 'Failed to delete category.');
      }
    }
  });
};
