import { useAuthStore } from '@/store/auth';
import { getRefreshToken, getTokenExpiry } from '@/utils/token';
import { logger } from '@/utils/logger';


export default {
  install: () => {
    const authStore = useAuthStore();
    
    // Initialize auth state when app starts
    authStore.initAuth().then(success => {
      if (success) {

        // Setup refresh interval only after successful auth
        setupRefreshInterval();
      }
    });
    
    // Setup automatic token refresh
    const refreshInterval: number | null = null;
    
    // Set up a periodic token refresh if we have a refresh token
    function setupRefreshInterval() {
      // Clear any existing interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      
      // If we have a token expiry and refresh token, set up auto-refresh
      if (getTokenExpiry() && getRefreshToken()) {
        const expiryTime = getTokenExpiry();
        const currentTime = Date.now();
        
        // If token is already expired, refresh immediately
        if (expiryTime <= currentTime) {
          authStore.refreshToken().then(success => {
            if (success) {
              // Check auth status to trigger reactivity
              const isAuth = authStore.isAuthenticated;
              logger.debug('Token refreshed successfully, auth status:', isAuth);
              setupRefreshInterval(); // Set up next refresh
            }
          });
        } else {
          // Otherwise, set up refresh for 5 minutes before expiry
          const timeToRefresh = Math.max(0, expiryTime - currentTime - 5 * 60 * 1000);
          
          logger.debug(`Token will refresh in ${Math.round(timeToRefresh / 1000 / 60)} minutes`);
          
          // Set a timeout to refresh the token
          setTimeout(() => {
            authStore.refreshToken().then(success => {
              if (success) {
                // Explicitly check auth status to trigger reactivity
                const isAuth = authStore.isAuthenticated;
                logger.debug('Token refreshed successfully, auth status:', isAuth);
              }
              // After refresh, set up the next interval
              setupRefreshInterval();
            });
          }, timeToRefresh);
        }
      }
    }
    
    // Handle page visibility change to refresh token when user comes back
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && authStore.isAuthenticated) {
        logger.debug('Page became visible, checking token status');
        // If token is expired or close to expiry (within 5 minutes), refresh it
        const currentTime = Date.now();
        const expiryTime = getTokenExpiry() || 0;
        
        if (expiryTime - currentTime < 5 * 60 * 1000) {
          authStore.refreshToken().then(success => {
            if (success) {
              // Explicitly check auth status to trigger reactivity
              const isAuth = authStore.isAuthenticated;
              logger.debug('Token refreshed after visibility change, auth status:', isAuth);
              setupRefreshInterval(); // Reset the refresh interval
            }
          });
        }
      }
    });
  }
};