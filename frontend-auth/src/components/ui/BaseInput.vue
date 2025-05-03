<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
        :disabled="disabled" :class="[
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        ]" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)" />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">

interface InputProps {
  id: string;
  label?: string;
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

defineProps<InputProps>();

defineEmits<{
  'update:modelValue': [value: string];
  'blur': [event: FocusEvent];
}>();
</script>