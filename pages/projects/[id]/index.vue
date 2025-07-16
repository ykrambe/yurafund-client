<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCampaignStore } from '~/stores/campaign'
import { useTransactionStore } from '~/stores/transactions'
import Navbar from '~/components/Navbar.vue'
import CallToAction from '~/components/CallToAction.vue'
import Footer from '~/components/Footer.vue'
import { useToast } from '#imports'


definePageMeta({
  layout: 'dashboard'
})


const route = useRoute()
const toast = useToast()
const campaignStore = useCampaignStore()
const transactionStore = useTransactionStore()

const projectForm = reactive({
  name: '',
  short_description: '',
  description: '',
  goal_amount: 0,
  current_amount: 0,
  perks: '',
  images: [],
  image_url: '',
  user_name: '',
  user_image_url: '',
  backer_count: 0,
  fund_amount: 0
})

const totalFund = ref(0)

const fund = async () => {
  if (totalFund.value < 10000) {
    toast.add('Minimum funding amount is Rp 10.000')
    return
  }
  
  try {
    const payload = {
      amount: totalFund.value,
      campaign_id: Number.parseInt(route.params.id)
    }
    const response = await transactionStore.fundProject(payload)
    if (response.data) {
      window.location = response.data.payment_url
    }
  } catch (error) {
    toast.add({title: 'Failed to fund project', color: 'error'})
  }
}

const getCampaignImageUrl = (imageUrl) => {
  if (!imageUrl) return '/no-image-project.jpg'
  if (imageUrl.startsWith('http')) return imageUrl
  const { $config } = useNuxtApp()
  const baseURL = $config.public.apiBase || 'http://localhost:8080'
  return `${baseURL}/${imageUrl}`
}

onMounted(async () => {
  await campaignStore.getUserCampaignById(route.params.id)
  const data = campaignStore.getCampaign
  if (data) {
    console.log("🚀 ~ onMounted ~ data:", data)
    projectForm.name = data.name || ''
    projectForm.short_description = data.short_description || ''
    projectForm.description = data.description || ''
    projectForm.goal_amount = data.goal_amount || 0
    projectForm.current_amount = data.current_amount || 0
    projectForm.perks = Array.isArray(data.perks) ? data.perks.join(', ') : (data.perks || '')
    projectForm.images = data.images ? data.images.map(img => img.image_url) : []
    projectForm.image_url = projectForm.images[0] || '/project-image.jpg'
    projectForm.user_name = data.user?.name || ''
    projectForm.user_image_url = data.user?.image_url || '/avatar.jpg'
    projectForm.backer_count = data.backer_count || 0
  }
})
</script>


<template>
  <div class="project-page pt-10">
    <section class="container project-container mx-auto pt-8 px-4">
      <div class="w-3/4 mr-6">
        <h2 class="text-4xl text-gray-900 mb-2 font-medium">Fund {{ projectForm.name }}</h2>
        <ul class="flex mt-2">
          <li class="mr-6">
            <UBadge icon="i-lucide-arrow-left"  color="primary" variant="solid" class="text-black">
              <NuxtLink to="/dashboard">
                back to dashboard
              </NuxtLink>
            </UBadge>
          </li>
        </ul>
        </div>

      <div class="flex mt-3">
        <div class="w-3/4 mr-6">
          <div class="bg-white p-3 mb-3 border border-gray-400 rounded-20">
            <figure class="item-image">
              <img :src="getCampaignImageUrl(projectForm.image_url) || '/project-image.jpg'" alt="" class="rounded-20 w-full" />
            </figure>
          </div>
          <div class="flex -mx-2">
            <div
              v-for="image in projectForm.images || []"
              :key="image"
              class="relative w-1/4 bg-white m-2 p-2 border border-gray-400 rounded-20"
            >
              <figure class="item-thumbnail cursor-pointer">
                <img
                  :src="getCampaignImageUrl(image)"
                  @click="projectForm.image_url = image"
                  alt=""
                  class="rounded-20 w-full"
                />
              </figure>
            </div>
          </div>
        </div>
        <div class="w-1/4">
          <div
            class="bg-white w-full p-5 border border-gray-400 rounded-20 sticky"
            style="top: 30px;"
          >
            <h3>Project Leader:</h3>
            <div class="flex mt-3">
              <div class="w-1/4">
                <img
                  :src="projectForm.user_image_url || '/avatar.jpg'"
                  alt=""
                  class="w-full inline-block rounded-full"
                />
              </div>
              <div class="w-3/4 ml-5 mt-1">
                <div class="font-semibold text-xl text-gray-800">
                  {{ projectForm.user_name }}
                </div>
                <div class="font-light text-md text-gray-400">
                  {{ projectForm.backer_count || 0 }} backer
                </div>
              </div>
            </div>
            <h4 class="mt-5 font-semibold">What will you get:</h4>
            <ul class="list-check mt-3">
              <li v-for="perk in (projectForm.perks ? projectForm.perks.split(',') : [])" :key="perk">
                {{ perk }}
              </li>
            </ul>
            <div class="mt-8 flex flex-col gap-4">
              <label for="fund-amount" class="block text-sm font-medium text-gray-700 mb-1">Enter donation amount</label>
              <div class="relative">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">Rp</span>
                <input
                  id="fund-amount"
                  type="number"
                  min="10000"
                  step="1000"
                  class="border border-gray-300 block w-full pl-14 pr-6 py-3 rounded-full text-gray-800 text-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-300 ease-in-out placeholder-gray-400"
                  placeholder="e.g. 100000"
                  v-model.number="totalFund"
                  @keyup.enter="fund"
                  aria-label="Donation amount in Rupiah"
                />
              </div>
              <UButton
                @click="fund"
                color="orange"
                size="lg"
                class="w-full flex items-center justify-center transition-all text-white duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg py-3 rounded-full mt-2"
                :disabled="!totalFund || totalFund < 10000"
              >
                Fund Now
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto pt-8">
      <div class="flex justify-between items-center">
        <div class="w-full md:w-3/4 mr-6">
          <h2 class="text-4xl text-gray-900 mb-2 font-medium">
            {{ projectForm.name }}
          </h2>
          <p class="font-light text-xl mb-5">
            {{ projectForm.short_description }}
          </p>
          <div class="relative progress-bar">
            <div
              class="overflow-hidden mb-4 text-xs flex rounded-full bg-gray-200 h-6"
            >
              <div
                :style="'width: ' + ((projectForm.current_amount / projectForm.goal_amount) * 100) + '%'"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-progress progress-striped"
              ></div>
            </div>
          </div>
          <div class="flex progress-info mb-6">
            <div class="text-2xl">
              {{ ((projectForm.current_amount / projectForm.goal_amount) * 100).toFixed(2) }}%
            </div>
            <div class="ml-auto font-semibold text-2xl">
              Rp {{ new Intl.NumberFormat().format(projectForm.goal_amount) }}
            </div>
          </div>
          <p class="font-light text-xl mb-5">
            {{ projectForm.description }}
          </p>
        </div>
        <div class="w-1/4 hidden md:block"></div>
      </div>
    </section>
  </div>
</template>

