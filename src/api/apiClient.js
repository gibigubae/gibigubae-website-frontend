import axios from 'axios';

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true, // Include credentials (cookies) in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding authentication or logging
apiClient.interceptors.request.use(
  (config) => {
    // You can add custom headers or tokens here if needed
    // For now, we're using cookie-based auth, so credentials: 'include' handles it
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - could redirect to login
          console.error('Unauthorized access - please log in');
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Request failed:', data?.message || error.message);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
