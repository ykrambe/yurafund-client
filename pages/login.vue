<script setup>
import { z } from 'zod'

// Define page meta
definePageMeta({
  layout: 'auth'
})

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
})

// Reactive data
const loginForm = reactive({
  email: '',
  password: ''
})

// Validation errors
const errors = ref({})

// ➡️data
const isLoading = ref(false)
const { login } = useAuth()
const showPassword = ref(false)
const showToast = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Validate form
const validateForm = () => {
  try {
    loginSchema.parse(loginForm)
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
    const fieldSchema = loginSchema.shape[fieldName]
    fieldSchema.parse(loginForm[fieldName])
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value[fieldName] = error.errors[0].message
    }
  }
}

// Login handler
const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  try {
    await login(loginForm)
  } catch (error) {
    // Handle login errors here if needed
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

// SEO
useHead({
  title: 'YuraFund - Login',
  meta: [
    { name: 'description', content: 'Sign in to your YuraFund account' }
  ]
})
</script>


<template>
  <div class="min-h-screen flex justify-center items-center bg-secondary px-4 py-8">
    <div class="w-full max-w-md sm:max-w-lg">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 mb-2">
            Sign In to Your Account
          </h2>
          <p class="text-gray-600 text-sm sm:text-base">
            Welcome back! Please enter your credentials
          </p>
        </div>
        
        <UForm :state="loginForm" @submit="handleLogin" class="space-y-4">
          <div class="space-y-4">
            <UFormField 
              label="Email Address" 
              name="email" 
              required
              :error="errors.email"
            >
              <UInput
                v-model="loginForm.email"
                type="email"
                placeholder="Your Email"
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
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your Password"
                size="xl"
                color="orange"
                class="w-full hover:scale-[1.02]"
                :class="{ 'border-red-500': errors.password }"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                @keyup.enter="handleLogin"
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
            

          </div>
          
          <div class="pt-4">
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="isLoading || Object.keys(errors).length > 0 || !loginForm.email || !loginForm.password"
              size="xl"
              block
              color="orange"
              variant="solid"
              class="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">Sign In</span>
              <span v-else>Signing In...</span>
            </UButton>
          </div>
        </UForm>
        
        <div class="text-center mt-8 pt-6 border-t border-gray-100">
          <p class="text-gray-600 text-sm sm:text-base">
            Don't have an account?
            <NuxtLink 
              to="/register" 
              class="text-orange-500 hover:text-gray-500 font-semibold transition-colors duration-200 ml-1"
            >
              Sign Up
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Custom styles if needed */
</style>