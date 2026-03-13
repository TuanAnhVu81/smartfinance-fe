import { useQuery } from '@tanstack/react-query';
import categoryApi from '../api/categoryApi';
import { QUERY_KEYS } from '../constants/queryKeys';

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
