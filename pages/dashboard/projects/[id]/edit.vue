<script setup>
import { z } from 'zod'
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useCampaignStore } from '~/stores/campaign'
import { useToast } from '#imports'

definePageMeta({
  layout: 'dashboard'
})

const campaignStore = useCampaignStore()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const api = useApi()

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  short_description: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  goal_amount: z.coerce.number().min(1, 'Goal amount must be greater than 0'),
  perks: z.string().optional()
})

const campaignForm = reactive({
  name: '',
  short_description: '',
  description: '',
  goal_amount: '',
  perks: ''
})

const images = ref([])

const errors = ref({})
const pending = ref(false)

onMounted(async () => {
  await fetchCampaign()
})

const fetchCampaign = async() => {
  pending.value = true
  await campaignStore.getUserCampaignById(route.params.id)
  const data = campaignStore.getCampaign
  if (data) {
    campaignForm.name = data.name || ''
    campaignForm.short_description = data.short_description || ''
    campaignForm.description = data.description || ''
    campaignForm.goal_amount = data.goal_amount || ''
    campaignForm.perks = Array.isArray(data.perks) ? data.perks.join(', ') : (data.perks || '')
    images.value = data.images || []
  }
  pending.value = false
}

const validateForm = () => {
  try {
    campaignSchema.parse(campaignForm)
    errors.value = {}
    return true
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.flatten().fieldErrors
    }
    return false
  }
}

const validateField = (fieldName) => {
  try {
    const fieldSchema = campaignSchema.shape[fieldName]
    fieldSchema.parse(campaignForm[fieldName])
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value[fieldName] = error.errors[0].message
    }
  }
}

const save = async () => {
  if (!validateForm()) return
  pending.value = true
  try {
    await campaignStore.updateCampaign(route.params.id, {
      ...campaignForm,
      goal_amount: Number(campaignForm.goal_amount)
    })
    toast.add({ title: 'Campaign updated successfully!', color: 'success' })
    router.push('/dashboard')
  } catch (err) {
    toast.add({ title: 'Failed to update campaign', color: 'error' })
  } finally {
    pending.value = false
  }
}

useHead({
  title: 'Edit Campaign - YuraFund',
  meta: [
    { name: 'description', content: 'Edit your campaign details' }
  ]
})

const selectedFiles = ref(null)
const uploading = ref(false)

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFiles.value = file
    // avatarUrl.value = URL.createObjectURL(file
  }
}

const handleImageError = (event) => {
  event.target.src = '/project-thumbnail-1.jpg'
}

async function uploadImages() {
  if (!selectedFiles.value) {
    toast.add({ title: 'Please select an image', color: 'error' })
    return
  }
  try {
    const formData = new FormData()
    formData.append('file', selectedFiles.value)
    formData.append('campaign_id', route.params.id)
    formData.append('is_primary', true)

    const { api } = useApi()
    const response = await api('/campaign-images', {
      method: 'POST',
      body: formData
    })
    toast.add({ title: 'Images uploaded successfully!', color: 'success' })
    await fetchCampaign()
    selectedFiles.value = null
    formData.delete('file')
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const getCampaignImageUrl = (imageUrl) => {
  if (!imageUrl) return '/no-image-project.jpg'
  if (imageUrl.startsWith('http')) return imageUrl
  const { $config } = useNuxtApp()
  const baseURL = $config.public.apiBase || 'http://localhost:8080'
  return `${baseURL}/${imageUrl}`
}
</script>

<template>
  <div class="project-page pt-10">
    <section class="container mx-auto pt-8 px-4">
      <div class="flex flex-col gap-6">
        <h3 class="text-2xl text-gray-900">Edit Campaign {{ campaignForm.name }}</h3>
        <ul class="flex">
          <li>
            <UBadge icon="i-lucide-arrow-left"  color="primary" variant="solid" class="text-black">
              <NuxtLink to="/dashboard">
                back to dashboard
              </NuxtLink>
            </UBadge>
          </li>
        </ul>
        <!-- tamahkan komponen upload gambar -->
        <div class="flex justify-between items-center mb-6">
          <div class="w-2/4 mr-6">
            <h3 class="text-xl text-gray-900 mb-2 mt-2">Gallery</h3>
          </div>
          <div class="w-2/4 text-right">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="border p-1 rounded overflow-hidden"
            />
            <UButton
              @click="uploadImages"
              :loading="uploading" 
              type="submit" 
              color="orange" 
              size="lg" 
              :disabled="uploading"
              class=" mx-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="uploading">Uploading...</span>
              <span v-else>Upload</span>
            </UButton>
          </div>
        </div>
        <div class="flex -mx-2">
            <div
              v-for="image in images"
              :key="image.image_url"
              class="relative w-1/4 bg-white m-2 p-2 border border-gray-400 rounded-20"
            >
              <figure class="item-thumbnail cursor-pointer">
                <img :src="getCampaignImageUrl(image.image_url)" :alt="image.image_url" class="w-full h-full object-cover" @error="handleImageError" />
              </figure>
            </div>
          </div>
        <UForm :state="campaignForm" @submit="save" class="w-full space-y-6">
          <UFormField label="Campaign Name" name="name" required :error="errors.name">
            <UInput v-model="campaignForm.name" type="text" placeholder="Campaign Name" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.name }" @blur="validateField('name')" @input="validateField('name')" />
          </UFormField>
          <UFormField label="Short Description" name="short_description" required :error="errors.short_description">
            <UInput v-model="campaignForm.short_description" type="text" placeholder="Short Description of your project" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.short_description }" @blur="validateField('short_description')" @input="validateField('short_description')" />
          </UFormField>
          <UFormField label="Goal Amount" name="goal_amount" required :error="errors.goal_amount">
            <UInput v-model="campaignForm.goal_amount" type="number" placeholder="0" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.goal_amount }" @blur="validateField('goal_amount')" @input="validateField('goal_amount')" min="1" />
          </UFormField>
          <UFormField label="What will backers get" name="perks" :error="errors.perks">
            <UInput v-model="campaignForm.perks" type="text" placeholder="Backer Advantage" size="xl" color="orange" class="w-full hover:scale-[1.02]" @blur="validateField('perks')" @input="validateField('perks')" />
          </UFormField>
          <UFormField label="Description" name="description" required :error="errors.description">
            <UInput v-model="campaignForm.description" type="textarea" placeholder="Description of your project" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.description }" @blur="validateField('description')" @input="validateField('description')" rows="5" />
          </UFormField>
          <div v-if="errors.form" class="text-red-500 text-sm">{{ errors.form }}</div>
          <div class="flex justify-end">
            <UButton 
            :loading="pending" 
            type="submit" 
            color="orange" 
            size="lg" 
            :disabled="pending || Object.keys(errors).length > 0 || !campaignForm.name || !campaignForm.short_description || !campaignForm.description || !campaignForm.goal_amount"
            class="transition-all text-white duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Save
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
    
  </div>
</template>

