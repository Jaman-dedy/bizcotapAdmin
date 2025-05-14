// lib/api-client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  // AxiosRequestConfig, // No longer explicitly needed for the interceptor's direct signature
  AxiosResponse,
  InternalAxiosRequestConfig // Import and use this
} from 'axios';

// Global flag to prevent multiple logout redirects
let isRedirecting = false;

// Create API client instance
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: { // This is fine, Axios will convert it to AxiosHeaders internally
      'Content-Type': 'application/json',
    }
  });

  // Log API configuration in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('API Base URL:', apiClient.defaults.baseURL);
  }

  // Add request interceptor to attach auth token
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
      // Skip token for auth endpoints
      if (config.url?.includes('/auth/login') ||
          config.url?.includes('/auth/register') ||
          config.url?.includes('/auth/reset-password')) {
        return config;
      }

      // Add auth token if available
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');

        if (token) {
          // config.headers is typed as AxiosRequestHeaders (which is AxiosHeaders)
          // by InternalAxiosRequestConfig. It's guaranteed to exist.
          // Use the .set() method to add or update headers.
          config.headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return config;
    },
    (error: AxiosError) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !isRedirecting) {
        console.log('Unauthorized API response - clearing auth data');

        // Prevent multiple redirects
        isRedirecting = true;

        // Clear token and other auth data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          // Don't auto-redirect on login endpoint failures
          // Ensure error.config is defined before accessing its properties
          if (error.config && !error.config.url?.includes('/auth/login')) {
            console.log('Redirecting to login due to unauthorized response');

            // Use timeout to allow current code to complete
            setTimeout(() => {
              window.location.href = '/login';

              // Reset redirect flag after redirect
              setTimeout(() => {
                isRedirecting = false;
              }, 1000);
            }, 100);
          } else {
            // Reset the flag immediately for login failures or if error.config is undefined
            isRedirecting = false;
          }
        } else {
          // If not in a browser environment, reset the flag
          isRedirecting = false;
        }
      }

      // Handle server errors (500)
      if (error.response?.status && error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Export a singleton instance of the API client
export const apiClient = createApiClient();

export default apiClient;
