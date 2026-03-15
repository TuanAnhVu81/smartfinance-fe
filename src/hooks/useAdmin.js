import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '../api/adminApi';
import { toast } from 'react-hot-toast';

/**
 * Hook to fetch all users for admin management
 */
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.getAllUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to toggle user active status
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }) => adminApi.toggleUserStatus(userId, isActive),
    onSuccess: (response) => {
      toast.success(response?.message || 'User status updated successfully');
      // Refetch user list to show latest status
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    }
  });
};

/**
 * Hook to fetch system summary for admin
 */
export const useAdminSummary = () => {
  return useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: adminApi.getAdminSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
