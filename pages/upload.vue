<template>
  <div class="min-h-screen flex justify-center items-center bg-secondary px-4 py-8">
    <div class="w-full max-w-md sm:max-w-lg">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mx-auto">
        <!-- Avatar Upload Section -->
        <div class="flex justify-center items-center mx-auto mb-6">
          <div class="relative w-32 h-32 sm:w-40 sm:h-40">
            <div class="cursor-pointer" @click="fileInput?.click()">
              <img 
                :src="avatarUrl" 
                alt="Avatar" 
                class="w-full h-full rounded-full border-4 border-orange-200 object-cover hover:border-orange-300 transition-colors duration-200" 
              />
              <div class="absolute -right-2 -bottom-2 bg-orange-500 rounded-full p-2 hover:bg-orange-600 transition-colors duration-200">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              accept="image/*"
              @change="onFileChange"
            />
          </div>
        </div>

        <!-- Welcome Text -->
        <div class="text-center mb-8">
          <h2 class="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">
            Hi, {{ authStore.user?.name || 'User' }}
          </h2>
          <p class="text-gray-600 text-sm sm:text-base">
            Please upload your selfie to complete your profile
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <UButton
            @click="handleUpload"
            :disabled="!selectedFile"
            :loading="isUploading"
            size="xl"
            block
            color="orange"
            variant="solid"
            class="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <span v-if="!isUploading">{{ selectedFile ? 'Upload & Continue' : 'Select a Photo First' }}</span>
            <span v-else>Uploading...</span>
          </UButton>

          <UButton
            @click="handleSkip"
            size="xl"
            block
            color="gray"
            variant="outline"
            class="transition-all duration-200 hover:scale-[1.02]"
          >
            Skip for Now
          </UButton>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-6">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
          <p class="text-center text-sm text-gray-600 mt-2">{{ uploadProgress }}% uploaded</p>
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
const avatarUrl = ref('/avatar.jpg')
const selectedFile = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

const authStore = useAuthStore()
const { api } = useApi()

// File change handler
const onFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
    avatarUrl.value = URL.createObjectURL(file)
  }
}

// Upload handler
const handleUpload = async () => {
  if (!selectedFile.value) return
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    const formData = new FormData()
    formData.append('avatar', selectedFile.value)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 100)
    
    const { api } = useApi()
    const response = await api('/avatars', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    // Update user avatar in store if needed
    if (response.data?.avatar_url) {
      authStore.updateUserAvatar(response.data.avatar_url)
    }
    
    // Navigate to success page
    await navigateTo('/register-success')
  } catch (error) {
    console.error('Upload failed:', error)
    // You might want to show an error toast here
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// Skip handler
const handleSkip = async () => {
  await navigateTo('/register-success')
}

// SEO
useHead({
  title: 'YuraFund - Upload Avatar',
  meta: [
    { name: 'description', content: 'Upload your profile picture to complete registration' }
  ]
})
</script>

<style scoped>
/* Custom styles if needed */
</style>