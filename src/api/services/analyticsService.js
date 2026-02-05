import apiClient from '../apiClient';

/**
 * Analytics Service
 * Handles analytics and reporting operations
 */

export const analyticsService = {
  /**
   * Get daily analytics overview
   * @returns {Promise} Response with daily attendance stats
   */
  getDailyOverview: async () => {
    const response = await apiClient.get('/analytics/daily/overview');
    return response.data;
  },
};

export default analyticsService;
