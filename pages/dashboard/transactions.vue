<script setup>
import { formatCurrency } from '~/helper/utils'
import { useTransactionStore } from '~/stores/transactions'

definePageMeta({
  layout: 'home'
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
  console.log('refresh');
  
}

useHead({
  title: 'YuraFund - Dashboard Transactions',
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
              <NuxtLink class="text-gray-500 hover:text-gray-800" to="/dashboard">
                Your Projects
              </NuxtLink>
            </li>
            <li class="mr-6">
              <a class="text-gray-800 font-bold" href="#">
                Your Transactions
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
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
        <div v-else-if="!transactions?.data?.length" class="text-center py-12">
          <UIcon name="i-heroicons-folder-open" class="text-gray-400 text-6xl mb-4" />
          <h3 class="text-xl font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p class="text-gray-600 mb-6">You have not made any transactions yet.</p>
        </div>
        <div v-else>
          <div
            class="w-full lg:max-w-full lg:flex mb-4"
            v-for="transaction in transactions.data"
            :key="transaction.id"
          >
            <div
              class="border h-48 lg:h-auto lg:w-64 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
              :style="{
                backgroundColor: '#bbb',
                backgroundPosition: 'center',
                backgroundImage: `url(${transaction.campaign.image_url?.startsWith('http') ? transaction.campaign.image_url : (useRuntimeConfig().public.apiBase || 'http://localhost:8080') + '/' + transaction.campaign.image_url})`
              }"
            ></div>
            <div
              class="w-full border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-8 flex flex-col justify-between leading-normal"
            >
              <div>
                <div class="text-gray-900 font-bold text-xl mb-1">
                  {{ transaction.campaign.name }}
                </div>
                <p class="text-sm text-gray-600 flex items-center mb-2">
                  Rp. {{ formatCurrency(transaction.amount) }}
                  &middot; {{ transaction.created_at }} &middot;
                  {{ transaction.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="cta-clip -mt-20"></div>
    <section class="call-to-action bg-orange-progress pt-64 pb-10"></section>
  </div>
</template>