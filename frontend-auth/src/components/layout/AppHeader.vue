<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-blue-600">AuthApp</h1>
          </div>
        </div>
        <div class="flex items-center" v-if="isAuthenticated">
          <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
            <div class="relative ml-3">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
                <BaseButton variant="secondary" @click="logout">
                  Sign out
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center" v-else>
          <router-link 
            to="/signin"
            class="text-gray-500 hover:text-gray-700 m-4 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-blue-600': $route.path === '/signin' }"
          >
            Sign in
          </router-link>
          <router-link 
            to="/signup"
            class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-blue-600': $route.path === '/signup' }"
          >
            Sign up
          </router-link>  
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth'
import { useAuth } from '../../composables/useAuth'
import BaseButton from '../ui/BaseButton.vue'

const authStore = useAuthStore()
const { logout } = useAuth()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)
</script>