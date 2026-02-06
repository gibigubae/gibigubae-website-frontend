import { useMutation } from '@tanstack/react-query';
import authService from '../api/services/authService';

/**
 * Hook for user login
 * @param {Object} options - Optional callbacks (onSuccess, onError)
 * @returns {Object} Mutation object with mutate, isLoading, error, etc.
 */
export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: ({ email, password }) => authService.signIn(email, password),
    ...options,
  });
};
 
/**
 * Hook for user signup
 * @param {Object} options - Optional callbacks (onSuccess, onError)
 * @returns {Object} Mutation object with mutate, isLoading, error, etc.
 */
export const useSignup = (options = {}) => {
  return useMutation({
    mutationFn: (userData) => authService.signUp(userData),
    ...options,
  });
};

/**
 * Hook for user logout
 * @param {Object} options - Optional callbacks (onSuccess, onError)
 * @returns {Object} Mutation object with mutate, isLoading, error, etc.
 */
export const useLogout = (options = {}) => {
  return useMutation({
    mutationFn: () => authService.logout(),
    ...options,
  });
};
