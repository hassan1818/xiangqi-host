// ensures all requests use a single configured client with credentials enabled (for cookies).

import axios from "axios";

const API = axios.create({
  baseURL: "https://xiangchi-api.onrender.com/api/v1",
  withCredentials: true, // very important for cookies this ensures cookies (JWT) are sent
  timeout: 10000, // 10 second timeout
});

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ 
  resolve: (value?: unknown) => void; 
  reject: (reason?: unknown) => void 
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for automatic token refresh
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return API(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const refreshResponse = await API.post('/auth/refresh-token');
        
        if (refreshResponse.status === 200) {
          processQueue(null, 'refreshed');
          isRefreshing = false;
          
          // Retry the original request
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Clear any stored user data and redirect to login
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    // If error is not 401 or refresh failed, reject the promise
    return Promise.reject(error);
  }
);

// Request interceptor for debugging (optional)
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default API;
