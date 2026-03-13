import { useMutation } from '@tanstack/react-query';
import aiInsightApi from '../api/aiInsightApi';
import { toast } from 'react-hot-toast';

/**
 * Hook to handle chat conversation with AI
 */
export const useAiChat = () => {
  return useMutation({
    mutationFn: ({ message, month, year }) => aiInsightApi.chat(message, month, year),
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to communicate with AI.');
    }
  });
};
