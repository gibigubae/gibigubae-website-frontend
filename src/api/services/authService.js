import apiClient from '../apiClient';

/**
 * Authentication Service
 * Handles user sign-in and sign-up operations
 */

export const authService = {
  /**
   * Sign in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with user data and role
   */
  signIn: async (email, password) => {
    const response = await apiClient.post('/sign-in', { email, password });
    return response.data;
  },

  /**
   * Sign up a new user
   * @param {Object|FormData} userData - User registration data
   * @returns {Promise} Response with created user data
   */
  signUp: async (userData) => {
    // If userData is FormData, Axios will automatically set the correct Content-Type
    const config = userData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await apiClient.post('/sign-up', userData, config);
    return response.data;
  },
};

export default authService;
