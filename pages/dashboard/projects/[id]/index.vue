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

const errors = ref({})
const pending = ref(false)

onMounted(async () => {
  pending.value = true
  await campaignStore.getUserCampaignById(route.params.id)
  const data = campaignStore.getCampaign
  if (data) {
    campaignForm.name = data.name || ''
    campaignForm.short_description = data.short_description || ''
    campaignForm.description = data.description || ''
    campaignForm.goal_amount = data.goal_amount || ''
    campaignForm.perks = Array.isArray(data.perks) ? data.perks.join(', ') : (data.perks || '')
  }
  pending.value = false
})

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

useHead({
  title: 'Detail Campaign - YuraFund',
  meta: [
    { name: 'description', content: 'Detail your campaign' }
  ]
})
</script>

<template>
  <div class="project-page pt-10">
    <section class="container mx-auto pt-8 px-4">
      <div class="flex flex-col gap-6">
        <h3 class="text-2xl text-gray-900">Detail Campaign {{ campaignForm.name }}</h3>
        <ul class="flex">
          <li>
            <UBadge icon="i-lucide-arrow-left"  color="primary" variant="solid">
              <NuxtLink class="text-white" to="/dashboard">
                back to dashboard
              </NuxtLink>
            </UBadge>
          </li>
        </ul>
        <div>
          <UForm :state="campaignForm" class="w-full space-y-6">
            <UFormField label="Campaign Name" name="name" required :error="errors.name">
              <UInput disabled v-model="campaignForm.name" type="text" placeholder="Campaign Name" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.name }" @blur="validateField('name')" @input="validateField('name')" />
            </UFormField>
            <UFormField label="Short Description" name="short_description" required :error="errors.short_description">
              <UInput disabled v-model="campaignForm.short_description" type="text" placeholder="Short Description of your project" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.short_description }" @blur="validateField('short_description')" @input="validateField('short_description')" />
            </UFormField>
            <UFormField label="Goal Amount" name="goal_amount" required :error="errors.goal_amount">
              <UInput disabled v-model="campaignForm.goal_amount" type="number" placeholder="0" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.goal_amount }" @blur="validateField('goal_amount')" @input="validateField('goal_amount')" min="1" />
            </UFormField>
            <UFormField label="What will backers get" name="perks" :error="errors.perks">
              <UInput disabled v-model="campaignForm.perks" type="text" placeholder="Backer Advantage" size="xl" color="orange" class="w-full hover:scale-[1.02]" @blur="validateField('perks')" @input="validateField('perks')" />
            </UFormField>
            <UFormField label="Description" name="description" required :error="errors.description">
              <UInput disabled v-model="campaignForm.description" type="textarea" placeholder="Description of your project" size="xl" color="orange" class="w-full hover:scale-[1.02]" :class="{ 'border-red-500': errors.description }" @blur="validateField('description')" @input="validateField('description')" rows="5" />
            </UFormField>
          </UForm>
        </div>
      </div>
    </section>
    
  </div>
</template>

