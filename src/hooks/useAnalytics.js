import { useQuery } from '@tanstack/react-query';
import analyticsService from '../api/services/analyticsService';

// Query keys for analytics-related queries
export const analyticsKeys = {
  all: ['analytics'],
  dailyOverview: () => [...analyticsKeys.all, 'daily', 'overview'],
};

/**
 * Hook to get daily analytics overview
 * @returns {Object} Query object with data, isLoading, error, refetch, etc.
 */
export const useDailyOverview = () => {
  return useQuery({
    queryKey: analyticsKeys.dailyOverview(),
    queryFn: analyticsService.getDailyOverview,
    staleTime: 1 * 30 * 1000, // 30 seconds - very fresh data for analytics dashboard
    refetchOnMount: 'always', // Always refetch on mount, even if not stale
    refetchOnWindowFocus: true, // Refetch when user returns to window
  });
};
