import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
// Token utilities: getters, saver, remover, validity checker
import { getToken } from '@/utils/token';
// Pinia store for auth state (logout)
import { useAuthStore } from '@/store/auth';

// Base URL from environment or fallback
const API_URL = import.meta.env.VITE_API_URL;

// Create a dedicated Axios instance for API calls
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: run before every outgoing request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Attach existing access token if available
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Attach CSRF token from meta tag (if present)
    const csrf = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');
    if (csrf && config.headers) {
      config.headers['X-CSRF-Token'] = csrf;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: handle responses & errors globally
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    const url = error.config?.url || '';

    // Skip handling on logout endpoint
    if (url.includes('/api/auth/logout')) {
      return Promise.reject(error);
    }

    // On 401, force logout
    if (error.response?.status === 401) {
      useAuthStore().logout();
    }

    return Promise.reject(error);
  }
);

export default api;