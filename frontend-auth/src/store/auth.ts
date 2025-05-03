import { defineStore } from 'pinia';
import type { AuthState } from '@/types/auth.interface';
import { AuthService } from '@/services/auth.service';
import { getToken, getRefreshToken, isTokenValid } from '@/utils/token';
import { logger } from '@/utils/logger';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    refreshInProgress: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.user && isTokenValid();
    },
  },

  actions: {
    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await AuthService.register({ name, email, password });
        this.user = response.user;
        return response;
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        this.error = err.response?.data?.message ?? err.message ?? 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await AuthService.login({ email, password });
        this.user = response.user;
        return response;
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        this.error = err.response?.data?.message ?? err.message ?? 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      try {
        AuthService.logout();
      } catch (error: unknown) {
        console.error('Error during logout:', error);
      } finally {
        this.user = null;
        this.error = null;
      }
    },

    async refreshToken() {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      if (this.refreshInProgress) {
        logger.debug('Token refresh already in progress');
        return false;
      }

      this.refreshInProgress = true;

      try {
        const result = await AuthService.refreshToken(refreshToken);
        return !!result;
      } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Token refresh failed:', err.message ?? 'Unknown error');
        this.logout();
        return false;
      } finally {
        this.refreshInProgress = false;
      }
    },

    async initAuth() {
      if (!isTokenValid()) {
        if (getRefreshToken()) {
          logger.debug('Token invalid, attempting refresh');
          try {
            const success = await this.refreshToken();
            if (!success) {
              logger.debug('Token refresh failed during init');
              return false;
            }
          } catch (error: unknown) {
            console.error('Error during token refresh at init:', error);
            return false;
          }
        } else {
          logger.debug('No refresh token available');
          return false;
        }
      }

      if (getToken()) {
        try {
          this.loading = true;
          const user = await AuthService.getCurrentUser();
          this.user = user;
          return true;
        } catch (error: unknown) {
          const err = error as { message?: string };
          console.error('Failed to load user profile:', err.message ?? 'Unknown error');
          this.logout();
          return false;
        } finally {
          this.loading = false;
        }
      }

      return false;
    },
  },
});
