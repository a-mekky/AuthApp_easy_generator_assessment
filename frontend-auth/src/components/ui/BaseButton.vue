<template>
  <button :type="type" :disabled="disabled || loading" :class="[
    'py-2 px-4 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
    variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : '',
    variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500' : '',
    variant === 'danger' ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    block ? 'w-full' : '',
  ]">
    <div class="flex items-center justify-center">
      <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}

defineProps<ButtonProps>()
</script>