import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the base URL for your backend API
export const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5001';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request. Token might be expired.');
      // In a real app, you'd try to refresh the token here before retrying the request
      // For this example, we'll just log the error
    }
    return Promise.reject(error);
  }
);

// Utility for authenticated requests
export async function apiRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response: AxiosResponse<T> = await api(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Convenience methods for common HTTP operations
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => apiRequest<T>({ ...config, method: 'GET', url }),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>({ ...config, method: 'POST', url, data }),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>({ ...config, method: 'PUT', url, data }),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => apiRequest<T>({ ...config, method: 'DELETE', url }),
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>({ ...config, method: 'PATCH', url, data }),
};

// Legacy function for backward compatibility (if needed)
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { 
    ...options, 
    headers: { ...headers, ...options.headers } 
  });

  // Handle 401 Unauthorized (e.g., token expired)
  if (response.status === 401) {
    console.error('Unauthorized request. Token might be expired.');
  }

  return response;
}
