import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', api.defaults.baseURL);
}

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/login') || 
        config.url?.includes('/auth/register') || 
        config.url?.includes('/auth/reset-password')) {
      return config;
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Global flag to prevent multiple logout redirects
let isRedirecting = false;

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
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
        if (!error.config.url?.includes('/auth/login')) {
          console.log('Redirecting to login due to unauthorized response');
          
          // Use timeout to allow current code to complete
          setTimeout(() => {
            window.location.href = '/';
            
            // Reset redirect flag after redirect
            setTimeout(() => {
              isRedirecting = false;
            }, 1000);
          }, 100);
        } else {
          // Reset the flag immediately for login failures
          isRedirecting = false;
        }
      }
    }
    
    // Handle server errors (500)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;