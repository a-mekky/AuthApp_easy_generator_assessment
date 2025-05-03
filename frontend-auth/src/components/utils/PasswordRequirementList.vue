<template>
  <div class="mt-2 space-y-1">
    <div v-for="(requirement, index) in requirements" :key="index" class="flex items-center text-sm"
      :class="requirement.met ? 'text-green-600' : 'text-gray-500'">
      <svg v-if="requirement.met" class="h-4 w-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clip-rule="evenodd" />
      </svg>
      <svg v-else class="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clip-rule="evenodd" />
      </svg>
      {{ requirement.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Requirement {
  text: string;
  met: boolean;
}

interface PasswordRequirementListProps {
  password: string;
}

const props = defineProps<PasswordRequirementListProps>();

const requirements = computed<Requirement[]>(() => [
  {
    text: 'At least 8 characters',
    met: props.password.length >= 8
  },
  {
    text: 'Contains a letter',
    met: /[a-zA-Z]/.test(props.password)
  },
  {
    text: 'Contains a number',
    met: /[0-9]/.test(props.password)
  },
  {
    text: 'Contains a special character',
    met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(props.password)
  }
]);
</script>