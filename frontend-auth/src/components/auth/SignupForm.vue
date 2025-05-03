<template>
  <div class="bg-white px-6 py-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>

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
        id="name"
        v-model="form.name"
        label="Full Name"
        placeholder="Enter your full name"
        required
        :error="formErrors.name"
        @input="validateName"
      />

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

      <div>
        <BaseInput
          id="password"
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="Create a password"
          required
          @input="validatePassword"
        />

        <!-- Password Requirements List -->
        <PasswordRequirementList :password="form.password" />
      </div>

      <div class="mt-6">
        <BaseButton 
          type="submit" 
          variant="primary" 
          :loading="isLoading" 
          :disabled="isLoading || !isFormValid"
          block
        >
          Create Account
        </BaseButton>
      </div>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/signin" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
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
import PasswordRequirementList from '../utils/PasswordRequirementList.vue';
import { validators, getValidationMessage } from '../../utils/validators';

interface FormData {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name: string;
  email: string;
  password: string;
}

const { register, isLoading, error, } = useAuth();
const localError = ref<string>('');

// Watch for changes to the error from useAuth and update localError
watch(error, (newError) => {
  if (newError) {
    localError.value = newError;
  }
});

const form = reactive<FormData>({
  name: '',
  email: '',
  password: ''
});

const formErrors = reactive<FormErrors>({
  name: '',
  email: '',
  password: ''
});

// Validate on input change to provide immediate feedback
const validateName = (): void => {
  if (!validators.required(form.name)) {
    formErrors.name = getValidationMessage.required('Name');
  } else if (!validators.minLength(form.name, 3)) {
    formErrors.name = getValidationMessage.minLength('Name', 3);
  } else {
    formErrors.name = '';
  }
};

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
  // We don't need to set error message for password as we use the requirements list instead
  formErrors.password = '';
};

const isPasswordValid = computed<boolean>(() => {
  return form.password.length >= 8 && 
         /[a-zA-Z]/.test(form.password) && 
         /[0-9]/.test(form.password) && 
         /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password);
});

const isFormValid = computed<boolean>(() => {
  return !formErrors.name && 
         !formErrors.email && 
         isPasswordValid.value;
});

const handleSubmit = async (): Promise<void> => {
  validateName();
  validateEmail();
  
  if (isFormValid.value) {
    try {
      await register(form.name, form.email, form.password);
    } catch (err: unknown) {
      const errorMessage = err as { message: string };
      localError.value = errorMessage.message || 'Registration failed. Please try again.';
    }
  }
};
</script>