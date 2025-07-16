<script setup>
import { formatCurrency } from '~/helper/utils'
import { useTransactionStore } from '~/stores/transactions'
import { useToast } from '#imports'

definePageMeta({
  layout: 'dashboard'
})

const transactionStore = useTransactionStore()
const toast = useToast()

onMounted(() => {
  transactionStore.getUserTransaction()
})

const transactions = computed(() => transactionStore.getTransactions)
const pending = computed(() => transactionStore.isPending)
const error = computed(() => transactionStore.getError)

const refresh = async () => {
  try {
    await transactionStore.getUserTransaction()
    toast.add({title: 'Successfully refresh transactions', color: 'success'})
  } catch (error) {
    toast.add({title: 'Failed to refresh transactions', color: 'error'})
  }
  
}

useHead({
  title: 'YuraFund - Dashboard Transactions',
  meta: [
    { name: 'description', content: 'Manage your campaigns and view your fundraising progress' }
  ]
})

const columns = ref([
  { accessorKey: 'campaign', header: 'Image', sortable: false },
  { accessorKey: 'campaign.name', header: 'Campaign Name', sortable: true },
  { accessorKey: 'amount', header: 'Amount', sortable: true },
  { accessorKey: 'created_at', header: 'Date', sortable: true },
  { accessorKey: 'status', header: 'Status', sortable: true }
])

const getCampaignImageUrl = (imageUrl) => {
  if (!imageUrl) return '/no-image-project.jpg'
  if (imageUrl.startsWith('http')) return imageUrl
  const { $config } = useNuxtApp()
  const baseURL = $config.public.apiBase || 'http://localhost:8080'
  return `${baseURL}/${imageUrl}`
}

const returnColor = (status) => {
  if (status === 'pending') return 'warning'
  if (status === 'paid') return 'success'
  if (status === 'failed') return 'error'
  return 'red'
}

const tableRows = computed(() => {
  if (!transactions.value?.data) return []
  return transactions.value.data.map(t => ({
    image: t.campaign.image_url?.startsWith('http') ? t.campaign.image_url : (useRuntimeConfig().public.apiBase || 'http://localhost:8080') + '/' + t.campaign.image_url,
    name: t.campaign.name,
    amount: `Rp. ${formatCurrency(t.amount)}`,
    created_at: t.created_at,
    status: t.status
  }))
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
              <UBadge variant="subtle" color="warning" class="text-black">
                <NuxtLink to="/dashboard">
                Your Projects
                </NuxtLink>
              </UBadge>
            </li>
            <li class="mr-6">
              <UBadge class="text-bold">
                <NuxtLink to="#">
                Your Transactions
                </NuxtLink>
              </UBadge>
            </li>
            <li class="mr-6">
              <UBadge variant="subtle" color="warning" class="text-black">
                <NuxtLink to="/dashboard/fund-project">
                Fund a Project
                </NuxtLink>
              </UBadge>
            </li>
          </ul>
        </div>
      </div>
      <div class="block mb-2">
        <div v-if="pending" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin text-orange-500 text-2xl" />
          <span class="ml-2 text-gray-600">Loading your transactions...</span>
        </div>
        <div v-else-if="error" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-3xl mb-4" />
          <p class="text-gray-600 mb-4">Failed to load transactions</p>
          <UButton @click="refresh" color="orange" variant="outline">Try Again</UButton>
        </div>
        <div v-else>
          <UTable :columns="columns" :data="transactions" class="rounded-lg shadow-sm border border-gray-200">
          <template #status-cell="{ row }">
              <UBadge 
              :label="row.original.status"
              variant= 'subtle'
              :color="returnColor(row.original.status)"
              />
          </template>
          <template #created_at-cell="{ row }">
              {{new Date(row.original.created_at).toLocaleString()}}

          </template>
          <template #amount-cell="{ row }">
              Rp. {{formatCurrency(row.original.amount)}}


          </template>
          <template #campaign-cell="{ row }">
            <img :src="getCampaignImageUrl(row.original.campaign.image_url)" alt="Campaign Image" class="w-12 h-12 object-cover rounded" />
          </template>
          </UTable>
        </div>
      </div>
    </section>
  </div>
</template>