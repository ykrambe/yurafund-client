<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">YuraFund</h1>
          </div>
          <nav class="flex space-x-8">
            <UButton variant="ghost" to="/">Home</UButton>
            <UButton variant="ghost" to="/about">About</UButton>
            <UButton variant="solid" to="/login">Login</UButton>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 sm:text-6xl">
          Welcome to <span class="text-primary">YuraFund</span>
        </h2>
        <p class="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Your modern frontend application built with Nuxt 3, Tailwind CSS, and Nuxt UI.
          Connected to your Golang backend at {{ config.public.apiBase }}
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <UButton size="lg" @click="testApiConnection">
            Test API Connection
          </UButton>
          <UButton variant="outline" size="lg" to="/about">
            Learn More
          </UButton>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="mt-20">
        <h3 class="text-2xl font-bold text-center text-gray-900 mb-12">
          Built with Modern Technologies
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard class="p-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-rocket-launch" class="w-6 h-6 text-primary" />
                <h4 class="text-lg font-semibold">Nuxt 3</h4>
              </div>
            </template>
            <p class="text-gray-600">
              The intuitive Vue framework with server-side rendering and auto-imports.
            </p>
          </UCard>

          <UCard class="p-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-paint-brush" class="w-6 h-6 text-primary" />
                <h4 class="text-lg font-semibold">Tailwind CSS</h4>
              </div>
            </template>
            <p class="text-gray-600">
              Utility-first CSS framework for rapid UI development.
            </p>
          </UCard>

          <UCard class="p-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-cube" class="w-6 h-6 text-primary" />
                <h4 class="text-lg font-semibold">Pinia</h4>
              </div>
            </template>
            <p class="text-gray-600">
              The Vue Store that you will enjoy using for state management.
            </p>
          </UCard>
        </div>
      </div>

      <!-- API Status -->
      <div class="mt-20">
        <UCard class="max-w-md mx-auto">
          <template #header>
            <h4 class="text-lg font-semibold text-center">API Status</h4>
          </template>
          <div class="text-center">
            <div class="flex items-center justify-center space-x-2 mb-4">
              <div 
                :class="[
                  'w-3 h-3 rounded-full',
                  apiStatus === 'connected' ? 'bg-green-500' : 
                  apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                ]"
              ></div>
              <span class="text-sm font-medium capitalize">{{ apiStatus }}</span>
            </div>
            <p class="text-sm text-gray-600">
              Backend: {{ config.public.apiBase }}
            </p>
          </div>
        </UCard>
      </div>
    </main>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { api } = useApi()

const apiStatus = ref('disconnected')

const testApiConnection = async () => {
  try {
    apiStatus.value = 'connecting'
    // Test endpoint - adjust according to your backend
    await api('/campaigns-limit')
    apiStatus.value = 'connected'
  } catch (error) {
    console.error('API connection failed:', error)
    apiStatus.value = 'error'
  }
}

// Test connection on mount
onMounted(() => {
  testApiConnection()
})

// SEO
useHead({
  title: 'YuraFund - Home',
  meta: [
    { name: 'description', content: 'YuraFund frontend application built with Nuxt 3' }
  ]
})
</script>