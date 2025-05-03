<template>
  <transition enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="show" :class="[
      'mb-6 p-4 rounded-lg shadow-sm border-l-4 flex items-start',
      borderAndShadowClasses,
      elevated ? 'shadow-md' : ''
    ]" role="alert">
      <!-- Icon -->
      <div class="flex-shrink-0 mt-0.5">
        <svg v-if="variant === 'success'" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <svg v-else-if="variant === 'error'" class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <svg v-else-if="variant === 'warning'" class="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd" />
        </svg>
        <svg v-else class="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Content -->
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-base font-medium" :class="textColorClass">
          {{ title }}
        </h3>

        <div :class="[
          textColorClass,
          title ? 'mt-1' : '',
          'text-sm leading-relaxed'
        ]">
          <slot>{{ message }}</slot>
        </div>
      </div>

      <!-- Close button -->
      <div v-if="dismissible" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button type="button" :class="[
            'inline-flex rounded-full p-1.5 focus:outline-none focus:ring-2',
            closeButtonClasses
          ]" @click="$emit('close')">
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  show?: boolean;
  variant?: AlertVariant;
  title?: string;
  message?: string;
  dismissible?: boolean;
  elevated?: boolean;
}

const props = withDefaults(defineProps<AlertProps>(), {
  show: true,
  variant: 'info',
  title: '',
  message: '',
  dismissible: false,
  elevated: false
});

defineEmits<{
  (e: 'close'): void;
}>();

const borderAndShadowClasses = computed<string>(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-50 border-green-500 border-t border-r border-b';
    case 'error':
      return 'bg-red-50 border-red-500 border-t border-r border-b';
    case 'warning':
      return 'bg-amber-50 border-amber-500 border-t border-r border-b';
    default:
      return 'bg-indigo-50 border-indigo-500 border-t border-r border-b';
  }
});

const textColorClass = computed<string>(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    default:
      return 'text-blue-800';
  }
});

const closeButtonClasses = computed<string>(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50';
    case 'error':
      return 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50';
    case 'warning':
      return 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50';
    default:
      return 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50';
  }
});
</script>
