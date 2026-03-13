import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';

/**
 * Custom hook to handle login logic
 * Uses React Query's useMutation to manage state
 */
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Based on ApiResponse structure: { success, code, data: { accessToken, refreshToken, user } }
      const authData = data.data;
      if (authData) {
        const { user, accessToken, refreshToken } = authData;
        
        // Save user info and tokens to store by calling method from global state
        useAuthStore.getState().setAuth(user, accessToken, refreshToken);
        
        toast.success('Login successful!');
        
        // Navigate to Dashboard and replace history to prevent going back to login page
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    },
    onError: () => {
      // Error handling is delegated to the component via setError('root', ...)
      // We don't toast here to avoid duplicate error messages with the form inline error
    }
  });
};

/**
 * Custom hook to handle registration logic
 */
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: () => {
      // Show success message and redirect to login page
      toast.success('Registration successful! Please login.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      const responseData = error.response?.data;
      // Only toast for general errors. Field-specific errors are handled by the component.
      if (!responseData?.errors || responseData.errors.length === 0) {
        const message = responseData?.message || 'Registration failed. Please try again!';
        toast.error(message);
      }
    }
  });
};
