<template>
  <div class="py-8">
    <div class="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Welcome to the Application</h1>
        <p class="mt-2 text-gray-600">
          You are now signed in as <span class="font-medium">{{ user?.name }}</span>.
        </p>
      </div>

      <div class="p-6 bg-blue-50 rounded-lg mb-6">
        <h2 class="text-xl font-semibold text-blue-800 mb-3">Protected Content</h2>
        <p class="text-blue-700">
          This is a protected page that only authenticated users can access.
          If you try to access this page without being logged in, you will be redirected to the sign-in page.
        </p>
      </div>

      <div class="flex justify-end">
        <BaseButton @click="handleLogout" variant="secondary">
          Sign out
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useAuth } from '../composables/useAuth'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout } = useAuth()

const user = computed(() => authStore.user)

const handleLogout = () => {
  logout()
}

onMounted(() => {
  // If user is not authenticated, redirect to signin
  if (!authStore.isAuthenticated) {
    router.push('/signin')
  }
})
</script>