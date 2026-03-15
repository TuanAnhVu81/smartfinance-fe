import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../api/userApi';
import { QUERY_KEYS } from '../constants/queryKeys';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to fetch current user's profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => userApi.getMe(),
    // Cache profile for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to update user profile information
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore(state => state.updateUser);

  return useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (response) => {
      toast.success('Profile updated successfully!');
      
      // Update global Zustand store immediately so Header/Sidebar updates without reload
      if (response && response.data) {
        updateUser(response.data);
      }
      
      // Invalidate query to keep React Query cache fresh
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile.');
    }
  });
};

/**
 * Hook to change user password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully! Please use it on your next login.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to change password. Please check your current password.');
    }
  });
};
