<script setup>
import { useCampaignStore } from '~/stores/campaign'
import { formatCurrency } from '~/helper/utils'

definePageMeta({
  layout: 'dashboard'
})

const campaignStore = useCampaignStore()
const toast = useToast()

onMounted(() => {
  campaignStore.getUserCampaigns()
})

const campaigns = computed(() => campaignStore.getCampaigns)
const pending = computed(() => campaignStore.isPending)
const error = computed(() => campaignStore.getError)

const getProgressPercentage = (campaign) => {
  if (!campaign.goal_amount || campaign.goal_amount === 0) return 0
  return Math.round((campaign.current_amount / campaign.goal_amount) * 100)
}

const getCampaignImageUrl = (imageUrl) => {
  if (!imageUrl) return '/no-image-project.jpg'
  if (imageUrl.startsWith('http')) return imageUrl
  const { $config } = useNuxtApp()
  const baseURL = $config.public.apiBase || 'http://localhost:8080'
  return `${baseURL}/${imageUrl}`
}

const handleImageError = (event) => {
  event.target.src = '/project-thumbnail-1.jpg'
}

const refresh = () => {
  campaignStore.getUserCampaigns()
}

useHead({
  title: 'YuraFund - Dashboard',
  meta: [
    { name: 'description', content: 'Manage your campaigns and view your fundraising progress' }
  ]
})
</script>

<template>
  <div class="project-page pt-10">
    <section class="container mx-auto pt-8">
      <div class="flex justify-between items-center mb-6">
        <div class="w-3/4 mr-6">
          <h2 class="text-4xl text-gray-900 mb-2 font-medium">Dashboard</h2>
          <ul class="flex mt-2">
            <li class="mr-6">
              <UBadge
              class="text-bold"
              >
                <NuxtLink  to="#">
                Your Projects
                </NuxtLink>
              </UBadge>
            </li>
            <li class="mr-6">
              <UBadge
              variant="subtle"
              color="warning"
              class="text-black"
              >
                <NuxtLink  to="/dashboard/transactions">
                Your Transactions
                </NuxtLink>
              </UBadge>
            </li>
            <li class="mr-6">
              <UBadge
              variant="subtle"
              color="warning"
              class="text-black"
              >
                <NuxtLink to="/dashboard/fund-project">
                Fund a Project
                </NuxtLink>
              </UBadge>
            </li>
          </ul>
        </div>
        <hr />
        <div class="w-full lg:w-1/4 lg:text-right">
          <UButton to="/dashboard/projects/create" color="primary" variant="solid" size="lg" class="w-full lg:w-auto">
            <Icon name="i-heroicons-plus" class="mr-2" />
            Create Campaign
          </UButton>
        </div>
      </div>
      <div v-if="pending" class="flex justify-center items-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-orange-500 text-2xl" />
        <span class="ml-2 text-gray-600">Loading your campaigns...</span>
      </div>
      <div v-else-if="error" class="text-center py-12">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-3xl mb-4" />
        <p class="text-gray-600 mb-4">Failed to load campaigns</p>
        <UButton @click="refresh" color="orange" variant="outline">Try Again</UButton>
      </div>
      <div v-else-if="!campaigns.length" class="text-center py-12">
        <UIcon name="i-heroicons-folder-open" class="text-gray-400 text-6xl mb-4" />
        <h3 class="text-xl font-medium text-gray-900 mb-2">No campaigns yet</h3>
        <p class="text-gray-600 mb-6">Create your first campaign to get started</p>
        <UButton to="/dashboard/projects/create" color="orange" size="lg">
          <Icon name="i-heroicons-plus" class="mr-2" />
          Create Your First Campaign
        </UButton>
      </div>
      <div v-else class="space-y-4">
        <div v-for="campaign in campaigns" :key="campaign.id" class="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-64 h-48 lg:h-auto flex-shrink-0">
              <img :src="getCampaignImageUrl(campaign.image_url)" :alt="campaign.name" class="w-full h-full object-cover" @error="handleImageError" />
            </div>
            <div class="flex-1 p-6 lg:p-8">
              <div class="flex flex-col justify-between h-full">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-orange-500 transition-colors">{{ campaign.name }}</h3>
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
                  <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div class="bg-orange-500 h-2 rounded-full transition-all duration-300" :style="{ width: Math.min(getProgressPercentage(campaign), 100) + '%' }"></div>
                  </div>
                  <p class="text-gray-700 text-base line-clamp-2">{{ campaign.short_description }}</p>
                </div>
                <div class="flex flex-wrap gap-3">
                  <UButton :to="`/dashboard/projects/${campaign.id}`" color="primary" variant="solid" class="text-black">
                    <UIcon name="i-heroicons-eye" class="mr-1" />
                    View
                  </UButton>
                  <UButton :to="`/dashboard/projects/${campaign.id}/edit`" color="primary" variant="solid" class="text-black">
                    <UIcon name="i-heroicons-pencil" class="mr-1" />
                    Edit
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
