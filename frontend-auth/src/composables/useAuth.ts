import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { validators } from '@/utils/validators';
import { logger } from '@/utils/logger';


export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const formErrors = ref<Record<string, string>>({});

  const isLoading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);
  const isAuthenticated = computed(() => authStore.isAuthenticated);

  // Login
  async function login(email: string, password: string) {
    const validationErrors: Record<string, string> = {};

    if (!validators.required(email)) {
      validationErrors.email = 'Email is required';
    } else if (!validators.email(email)) {
      validationErrors.email = 'Please enter a valid email';
    }

    if (!validators.required(password)) {
      validationErrors.password = 'Password is required';
    }

    formErrors.value = validationErrors;

    if (Object.keys(validationErrors).length === 0) {
      try {
        await authStore.login(email, password);
        // Make sure we're authenticated before redirecting
        if (isAuthenticated.value) {
          // Use nextTick to ensure the router navigation happens after Vue updates
          await router.push('/app');
        } else {
          logger.error('Authentication succeeded but isAuthenticated is false');
        }
      } catch (error) {
        logger.error('Login error', error);
        // Error is already handled in the store
      }
    }
  }

  // Register
  async function register(name: string, email: string, password: string) {
    const validationErrors: Record<string, string> = {};

    if (!validators.required(name)) {
      validationErrors.name = 'Name is required';
    } else if (!validators.minLength(name, 3)) {
      validationErrors.name = 'Name should be at least 3 characters';
    }

    if (!validators.required(email)) {
      validationErrors.email = 'Email is required';
    } else if (!validators.email(email)) {
      validationErrors.email = 'Please enter a valid email';
    }

    if (!validators.required(password)) {
      validationErrors.password = 'Password is required';
    } else if (!validators.strongPassword(password)) {
      validationErrors.password = 'Password must be at least 8 characters and include a letter, a number, and a special character';
    }

    formErrors.value = validationErrors;

    if (Object.keys(validationErrors).length === 0) {
      try {
        await authStore.register(name, email, password);

        await router.push('/signin');

      } catch (error) {
        logger.error('Registration error', error);
        // Error is already handled in the store
      }
    }
  }

  // Logout
  function logout() {
    authStore.logout();
    router.push('/signin');
  }

  async function initAuth() {
    const success = await authStore.initAuth();
    return success;
  }

  // Add a method to check if user is authenticated before accessing protected routes
  function requireAuth() {
    if (!isAuthenticated.value) {
      router.push('/signin');
    }
  }

  return {
    login,
    register,
    logout,
    initAuth,
    requireAuth,
    isLoading,
    error,
    isAuthenticated,
    formErrors
  };
}