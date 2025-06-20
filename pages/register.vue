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
          <div class="">
            <UFormField 
              label="Full Name" 
              name="name" 
            >
              <UInput
                v-model="registerForm.name"
                type="text"
                placeholder="Write Your Name"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-user"
                class="w-full hover:scale-[1.02]"
              />
            </UFormField>
            
            <UFormField 
              label="Occupation" 
              name="occupation" 
            >
              <UInput
                v-model="registerForm.occupation"
                type="text"
                placeholder="Write your occupation"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-briefcase"
                class="w-full hover:scale-[1.02]"
              />
            </UFormField>
            
            <UFormField 
              label="Email Address" 
              name="email" 
            >
              <UInput
                v-model="registerForm.email"
                type="email"
                placeholder="Write your email address"
                size="xl"
                color="orange"
                trailing-icon="i-heroicons-at-symbol"
                class="w-full hover:scale-[1.02]"
              />
            </UFormField>
            
            <UFormField 
              label="Password" 
              name="password" 
            >
              <UInput
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Type your password"
                size="xl"
                color="orange"
                class="w-full hover:scale-[1.02]"
                :ui="{ icon: { trailing: { pointer: '' } } }"
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
            >
              <UInput
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your password"
                size="xl"
                color="orange"
                class="w-full hover:scale-[1.02]"
                @keyup.enter="handleRegister"
                :ui="{ icon: { trailing: { pointer: '' } } }"
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
              size="xl"
              block
              color="orange"
              variant="solid"
              class="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process"
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

<script setup>
import { useAuthStore } from '~/stores/auth'

// Define page meta
definePageMeta({
  layout: 'auth'
})

// Reactive data
const registerForm = reactive({
  name: '',
  email: '',
  occupation: '',
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const authStore = useAuthStore()
const { api } = useApi()

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Register handler
const handleRegister = async () => {
  if (!registerForm.name || !registerForm.email || !registerForm.occupation || !registerForm.password || !registerForm.confirmPassword) return
  
  if (registerForm.password !== registerForm.confirmPassword) {
    console.error('Passwords do not match')
    return
  }
  
  isLoading.value = true
  
  try {
    const { api } = useApi()
    const response = await api('/users', {
      method: 'POST',
      body: {
        name: registerForm.name,
        email: registerForm.email,
        occupation: registerForm.occupation,
        password: registerForm.password
      }
    })
    
    // Update auth store dengan response
    authStore.setToken(response.data.token)
    authStore.setUser(response.data.user)
    
    await navigateTo('/upload')
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

<style scoped>
/* Custom styles if needed */
</style>