<script setup>
import { z } from 'zod'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

// Define page meta
definePageMeta({
  layout: 'dashboard'
})

// Zod validation schema
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
const api = useApi()
const router = useRouter()
const { createCampaign } = useCampaign()

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
    await createCampaign({
      ...campaignForm,
      goal_amount: Number(campaignForm.goal_amount)
    })
  } catch (err) {
    console.error('Create Campaign error:', err)
  } finally {
    pending.value = false
  }
}

useHead({
  title: 'Create Campaign - YuraFund',
  meta: [
    { name: 'description', content: 'Create a new fundraising campaign on YuraFund' }
  ]
})
</script>

<template>
  <div class="project-page pt-10">
    <section class="container mx-auto pt-8 px-4">
      <div class="flex flex-col gap-6">
        <h3 class="text-2xl text-gray-900">Create New Project</h3>
        <ul class="flex">
            <li class="">
              <UBadge icon="i-lucide-arrow-left"  color="primary" variant="solid" class="text-black">
                <NuxtLink to="/dashboard">
                  back to dashboard
                </NuxtLink>
              </UBadge>
            </li>
          </ul>
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
            class="transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-primary-process disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Save
            </UButton>
          </div>
        </UForm>
      </div>
    </section>
    
  </div>
</template>