<template>
  <div class="bg-white px-6 py-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Sign in to your account</h2>

    <BaseAlert
      v-if="localError" 
      variant="error"
      :message="localError"
      :show="!!localError"
      class="mb-6"
      dismissible
      @close="localError = ''"
    />

    <form @submit.prevent="handleSubmit">
      <BaseInput
        id="email"
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        required
        :error="formErrors.email"
        @input="validateEmail"
      />

      <BaseInput
        id="password"
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
        :error="formErrors.password"
        @input="validatePassword"
      />

      <div class="flex items-center justify-between mt-4 mb-6">
        <div class="flex items-center">
          <input
            id="remember-me"
            v-model="rememberMe"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <BaseButton 
          type="submit" 
          variant="primary" 
          :loading="isLoading" 
          :disabled="isLoading || !isFormValid"
          block
        >
          Sign in
        </BaseButton>
      </div>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/signup" class="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useAuth } from '../../composables/useAuth';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseAlert from '../ui/BaseAlert.vue';
import { validators, getValidationMessage } from '../../utils/validators';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignInFormErrors {
  email: string;
  password: string;
}

const { login, isLoading, error } = useAuth();
const localError = ref<string>('');
const rememberMe = ref<boolean>(false);

// Watch for changes to the error from useAuth and update localError
watch(error, (newError) => {
  if (newError) {
    localError.value = newError;
  }
});

const form = reactive<SignInFormData>({
  email: '',
  password: ''
});

const formErrors = reactive<SignInFormErrors>({
  email: '',
  password: ''
});

// Validate on input change to provide immediate feedback
const validateEmail = (): void => {
  if (!validators.required(form.email)) {
    formErrors.email = getValidationMessage.required('Email');
  } else if (!validators.email(form.email)) {
    formErrors.email = getValidationMessage.email();
  } else {
    formErrors.email = '';
  }
};

const validatePassword = (): void => {
  if (!validators.required(form.password)) {
    formErrors.password = getValidationMessage.required('Password');
  } else {
    formErrors.password = '';
  }
};

const isFormValid = computed<boolean>(() => {
  return !formErrors.email && 
         !formErrors.password &&
         !!form.email &&
         !!form.password;
});

const handleSubmit = async (): Promise<void> => {
  validateEmail();
  validatePassword();
  
  if (isFormValid.value) {
    try {
      await login(form.email, form.password, 
      // TODO: This is a placeholder for Implement rememberMe functionality in the cookies saving
      // rememberMe.value
    );
    } catch (err: unknown) {
      const errorMessage = err as { message: string };
      localError.value = errorMessage.message || 'Sign in failed. Please try again.';
    }
  }
};
</script>