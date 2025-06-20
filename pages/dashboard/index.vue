<template>
  <div class="project-page">
    <!-- Dashboard Header -->
    <section class="dashboard-header">
      <div class="container mx-auto relative">
        <Navbar />
      </div>
    </section>

    <!-- Main Dashboard Content -->
    <section class="container mx-auto pt-8 px-4">
      <!-- Header Section -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div class="w-full lg:w-3/4">
          <h2 class="text-3xl lg:text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
          <ul class="flex mt-2 space-x-6">
            <li>
              <a class="text-gray-800 font-bold hover:text-orange-500 transition-colors" href="#">
                Your Projects
              </a>
            </li>
            <li>
              <NuxtLink
                class="text-gray-500 hover:text-gray-800 transition-colors"
                to="/dashboard/transactions"
              >
                Your Transactions
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div class="w-full lg:w-1/4 lg:text-right">
          <UButton
            to="/dashboard/projects/create"
            color="orange"
            variant="solid"
            size="lg"
            class="w-full lg:w-auto"
          >
            <Icon name="i-heroicons-plus" class="mr-2" />
            Create Campaign
          </UButton>
        </div>
      </div>


      <!-- Loading State -->
      <div v-if="pending" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-orange-500 text-2xl" />
        <span class="ml-2 text-gray-600">Loading your campaigns...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-3xl mb-4" />
        <p class="text-gray-600 mb-4">Failed to load campaigns</p>
        <UButton @click="refresh()" color="orange" variant="outline">
          Try Again
        </UButton>
      </div>

      <!-- Empty State -->
      <div v-else-if="!campaigns?.data?.length" class="text-center py-12">
        <UIcon name="i-heroicons-folder-open" class="text-gray-400 text-6xl mb-4" />
        <h3 class="text-xl font-medium text-gray-900 mb-2">No campaigns yet</h3>
        <p class="text-gray-600 mb-6">Create your first campaign to get started</p>
        <UButton to="/dashboard/projects/create" color="orange" size="lg">
          <Icon name="i-heroicons-plus" class="mr-2" />
          Create Your First Campaign
        </UButton>
      </div>

      <!-- Campaigns List -->
      <div v-else class="space-y-4">
        <div
          v-for="campaign in campaigns.data"
          :key="campaign.id"
          class="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div class="flex flex-col lg:flex-row">
            <!-- Campaign Image -->
            <div class="lg:w-64 h-48 lg:h-auto flex-shrink-0">
              <img
                :src="getCampaignImageUrl(campaign.image_url)"
                :alt="campaign.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <!-- Campaign Content -->
            <div class="flex-1 p-6 lg:p-8">
              <div class="flex flex-col justify-between h-full">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                    {{ campaign.name }}
                  </h3>
                  
                  <!-- Campaign Stats -->
                  <div class="flex flex-wrap items-center gap-4 mb-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <UIcon name="i-heroicons-currency-dollar" class="mr-1" />
                      <span class="font-medium">Rp {{ formatCurrency(campaign.goal_amount) }}</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <UIcon name="i-heroicons-chart-bar" class="mr-1" />
                      <span class="font-medium">{{ getProgressPercentage(campaign) }}%</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                      <UIcon name="i-heroicons-banknotes" class="mr-1" />
                      <span class="font-medium">Rp {{ formatCurrency(campaign.current_amount) }}</span>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: Math.min(getProgressPercentage(campaign), 100) + '%' }"
                    ></div>
                  </div>

                  <p class="text-gray-700 text-base line-clamp-2">
                    {{ campaign.short_description }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3">
                  <UButton
                    :to="`/dashboard/projects/${campaign.id}`"
                    color="orange"
                    variant="solid"
                    size="sm"
                  >
                    <UIcon name="i-heroicons-eye" class="mr-1" />
                    View Details
                  </UButton>
                  
                  <UButton
                    :to="`/dashboard/projects/${campaign.id}/edit`"
                    color="gray"
                    variant="outline"
                    size="sm"
                  >
                    <UIcon name="i-heroicons-pencil" class="mr-1" />
                    Edit
                  </UButton>

                  <UBadge
                    :color="campaign.current_amount >= campaign.goal_amount ? 'green' : 'orange'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ campaign.current_amount >= campaign.goal_amount ? 'Funded' : 'Active' }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <div class="cta-clip -mt-20 bg-black"></div>
    <section class="call-to-action bg-orange-progress pt-64 pb-10"></section>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

import { useAuthStore } from '~/stores/auth'

// Define page meta
definePageMeta({
  middleware: 'auth'
})
// Composables
const authStore = useAuthStore()
const { api } = useApi()

// Fetch campaigns data
const { data: campaigns, pending, error, refresh } = await useLazyAsyncData('user-campaigns', async () => {
  try {
console.log("🚀 ~ authStore:", authStore)
    
    const response = await api(`/campaigns?user_id=${authStore.getUser?.id}`, {
      method: 'GET'
    })
    return response
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    throw error
  }
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const getProgressPercentage = (campaign) => {
  if (!campaign.goal_amount || campaign.goal_amount === 0) return 0
  return Math.round((campaign.current_amount / campaign.goal_amount) * 100)
}

const getCampaignImageUrl = (imageUrl) => {
  if (!imageUrl) return '/project-thumbnail-1.jpg' // fallback image
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl
  
  // Otherwise, construct the full URL
  const { $config } = useNuxtApp()
  const baseURL = $config.public.apiBase || 'http://localhost:8080'
  return `${baseURL}/${imageUrl}`
}

const handleImageError = (event) => {
  event.target.src = '/project-thumbnail-1.jpg' // fallback image
}

// SEO
useHead({
  title: 'YuraFund - Dashboard',
  meta: [
    { name: 'description', content: 'Manage your campaigns and view your fundraising progress' }
  ]
})
</script>

<style scoped>
.dashboard-header {
  background-position: top right;
  background-color: #FBB117;
  background-size: 250px;
  height: 100px;
}

.cta-clip {
  position: relative;
  top: 200px;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 300px;
  background-position: top right;
  background-size: 300px;
  background-repeat: no-repeat;
  background-color: #fff;
  transform: skewY(4deg);
  transform-origin: bottom right;
}

.call-to-action {
  background-image: url('/auth-background.svg');
  background-position: top right;
  background-repeat: no-repeat;
  background-size: 450px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover effects for campaign cards */
.project-page .shadow-md:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Progress bar animation */
.bg-orange-500 {
  transition: width 0.5s ease-in-out;
}
</style>