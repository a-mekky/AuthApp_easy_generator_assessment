import api from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth.interface';
import { logger } from '@/utils/logger';
import { saveToken, removeToken, getToken } from '@/utils/token';

// Define proper error types to replace any
interface ApiErrorResponse {
  status?: number;
  data?: unknown;
}

interface ApiError {
  response?: ApiErrorResponse;
  request?: unknown;
  message?: string;
}

export const AuthService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/signup', credentials);

    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/signin', credentials);

    if (response.data.accessToken) {
      saveToken(
        response.data.accessToken,
        response.data.refreshToken,
      );
    }

    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
  
    try {
      const response = await api.post<AuthResponse>('/api/auth/refresh', { refreshToken });
  
      if (response.data.accessToken) {
        saveToken(response.data.accessToken, response.data.refreshToken);
      }

      return response.data;
  
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response) {
        logger.error(
          '[refreshToken] Server responded with error',
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        logger.error('[refreshToken] No response received, request was:', err.request);
      } else {
        logger.error('[refreshToken] Error building request:', err.message);
      }
      throw error;
  
    }
  },
  

  logout(): void {
    try {
      const accessToken = getToken();
      if (accessToken) {
        api.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).catch((error: unknown) => {
          const err = error as ApiError;
          if (err.response?.status === 401) {
            logger.warn('Logout failed with 401, likely due to an invalid token.');
          } else {
            logger.error('Error during logout:', err.message ?? 'Unknown error');
          }
        });
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      logger.error('Error during logout:', err.message ?? 'Unknown error');
    } finally {
      removeToken();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/users/profile');
    return response.data;
  }
};
