import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import AppView from '../views/ApplicationView.vue'
import { getRefreshToken, getToken } from '@/utils/token'
import { watch } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/app' // Redirect to the app view by default (This can be changed to the home component later)
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInView,
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/app',
    name: 'App',
    component: AppView,
    meta: { requiresAuth: true }
  },

  // Add a catch-all route to redirect to a 404 page or the home page
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create a function to get the auth store to avoid accessing it before Pinia is initialized
const getAuthStore = () => {
  try {
    return useAuthStore()
  } catch (error) {
    console.error('Failed to get auth store:', error)
    return null
  }
}

router.beforeEach(async (to, from, next) => {
  // Get the auth store inside the navigation guard where it will be properly initialized
  const authStore = getAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth)

  // If we couldn't get the auth store, consider the user not authenticated
  if (!authStore) {
    return requiresAuth ? next('/signin') : next()
  }

  // Step 1: Check if the user is authenticated
  if (!authStore.isAuthenticated) {
    // Step 2: If not authenticated, check if an access token exists
    const accessToken = getToken()
    if (accessToken) {
      try {
        await authStore.initAuth()
      } catch (error) {
        console.error('Failed to initialize authentication:', error)
        if (requiresAuth) {
          return next('/signin')
        }
      }
    }
    // Step 3: If no access token, check for refresh token
    else if (getRefreshToken()) {
      try {
        // Initiate refresh token flow to get a new access token
        await authStore.initAuth()
      } catch (error) {
        console.error('Failed to refresh authentication:', error)
        // If refresh fails, redirect to signin if the route requires auth
        if (requiresAuth) {
          return next('/signin')
        }
      }
    }
    // Step 4: If neither token is available and the route requires auth, redirect to signin
    else if (requiresAuth) {
      return next('/signin')
    }
  }

  // Handle redirection for authenticated users trying to access signup/signin
  if (redirectIfAuth && authStore.isAuthenticated) {
    return next('/app')
  }

  // Allow navigation to proceed
  next()
})

// Set up auth state change monitoring after the app is initialized
export function setupAuthWatcher() {
  const authStore = getAuthStore()
  if (!authStore) return

  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated, wasAuthenticated) => {
      // Only react to authentication state changes, not initial setup
      if (wasAuthenticated !== undefined) {
        const currentRoute = router.currentRoute.value

        // If user is no longer authenticated and is on a protected route,
        // redirect to signin
        if (!isAuthenticated &&
          currentRoute.meta.requiresAuth) {
          router.replace('/signin')
        }

        // If user becomes authenticated and is on signin/signup page,
        // redirect to app
        else if (isAuthenticated &&
          currentRoute.meta.redirectIfAuth) {
          router.push('/app')
        }
      }
    }
  )
}

export default router