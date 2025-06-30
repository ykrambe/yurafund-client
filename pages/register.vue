<script setup>
import { z } from 'zod'
import { useAuthStore } from '~/stores/auth'

// Define page meta
definePageMeta({
  layout: 'auth'
})

// Zod validation schema
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  occupation: z.string().min(1, 'Occupation is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
})

// Reactive data
const registerForm = reactive({
  name: '',
  email: '',
  occupation: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({})
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const authStore = useAuthStore()
const { api } = useApi()
const { register } = useAuth()

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Validate form
const validateForm = () => {
  try {
    registerSchema.parse(registerForm)
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.value = { confirmPassword: 'Passwords do not match' }
      return false
    }
    errors.value = {}
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.flatten().fieldErrors
    }
    return false
  }
}

// Validate individual field
const validateField = (fieldName) => {
  try {
    const fieldSchema = registerSchema.shape[fieldName]
    fieldSchema.parse(registerForm[fieldName])
    if (fieldName === 'confirmPassword' && registerForm.password !== registerForm.confirmPassword) {
      errors.value.confirmPassword = 'Passwords do not match'
      return
    }
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value[fieldName] = error.errors[0].message
    }
  }
}

// Register handler
const handleRegister = async () => {
  if (!validateForm()) {
    return
  }
  isLoading.value = true
  try {
    await register(registerForm)
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'YuraFund - Register',
  meta: [
    { name: 'description', content: 'Create your YuraFund account' }
  ]
})
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-secondary px-4 py-8">
    <div class="w-full max-w-md sm:max-w-lg">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-2">
            Sign Up Account
          </h2>
          <p class="text-gray-600 text-sm sm:text-base">
            Create your account to get started
          </p>
        </div>
        <UForm :state="registerForm" @submit="handleRegister" class="space-y-4">
          <div class="space-y-4">
            <UFormField 
              label="Full Name" 
              name="name" 
              required
              :error="errors.name"
            >
              <UInput
                v-model="registerForm.name"
                type="text"
                placeholder="Write Your Name"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-user"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.name }"
                @blur="validateField('name')"
                @input="validateField('name')"
              />
            </UFormField>
            <UFormField 
              label="Occupation" 
              name="occupation" 
              required
              :error="errors.occupation"
            >
              <UInput
                v-model="registerForm.occupation"
                type="text"
                placeholder="Write your occupation"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-briefcase"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.occupation }"
                @blur="validateField('occupation')"
                @input="validateField('occupation')"
              />
            </UFormField>
            <UFormField 
              label="Email Address" 
              name="email" 
              required
              :error="errors.email"
            >
              <UInput
                v-model="registerForm.email"
                type="email"
                placeholder="Write your email address"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-at-symbol"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.email }"
                @blur="validateField('email')"
                @input="validateField('email')"
              />
            </UFormField>
            <UFormField 
              label="Password" 
              name="password" 
              required
              :error="errors.password"
            >
              <UInput
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Type your password"
                size="xl"
                color="orange"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.password }"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                @blur="validateField('password')"
                @input="validateField('password')"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    :padded="false"
                    @click="togglePasswordVisibility"
                  />
                </template>
              </UInput>
            </UFormField>
            <UFormField 
              label="Confirm Password" 
              name="confirmPassword" 
              required
              :error="errors.confirmPassword"
            >
              <UInput
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                size="xl"
                color="orange"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.confirmPassword }"
                @keyup.enter="handleRegister"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                @blur="validateField('confirmPassword')"
                @input="validateField('confirmPassword')"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    :icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    :padded="false"
                    @click="toggleConfirmPasswordVisibility"
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
          <div class="pt-4">
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="isLoading || Object.keys(errors).length > 0 || !registerForm.name || !registerForm.email || !registerForm.occupation || !registerForm.password || !registerForm.confirmPassword"
              size="xl"
              block
              color="orange"
              variant="solid"
              class="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Sign Up</span>
              <span v-else>Signing Up...</span>
            </UButton>
          </div>
        </UForm>
        <div class="text-center mt-8 pt-6 border-t border-gray-100">
          <p class="text-gray-600 text-sm sm:text-base">
            Already have account?
            <NuxtLink 
              to="/login" 
              class="text-orange-500 hover:text-gray-500 font-semibold transition-colors duration-200 ml-1"
            >
              Sign In
            </NuxtLink>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>