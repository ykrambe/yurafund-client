<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCampaignStore } from '~/stores/campaign'
import Navbar from '~/components/Navbar.vue'
import CallToAction from '~/components/CallToAction.vue'
import Footer from '~/components/Footer.vue'

definePageMeta({
  layout: 'dashboard'
})


const route = useRoute()
const campaignStore = useCampaignStore()

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

const fund = () => {
  // Implement funding logic here
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
            style="top: 15px;"
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
    <div class="cta-clip -mt-20"></div>
    <CallToAction />
    <Footer />
  </div>
</template>

