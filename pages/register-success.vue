<script setup>
definePageMeta({
  layout: 'success'
})

useHead({
  title: 'YuraFund - Registration Success',
  meta: [
    { name: 'description', content: 'Your account has been successfully registered.' }
  ]
})
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-secondary px-4 py-8">
    <div class="w-full max-w-md sm:max-w-lg">
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mx-auto">
        <div class="flex justify-center items-center mx-auto mt-6 mb-8">
          <img src="/success-illustration.svg" alt="Success" class="w-full" />
        </div>
        <h2 class="font-medium mb-3 text-3xl text-center">Welcome onboard!</h2>
        <p class="text-center font-light">
          Your account just registered<br />into our system
        </p>
        <div class="mb-4 mt-6">
          <div class="mb-3">
            <UButton
              @click="navigateTo('dashboard')"
              block
              variant="solid"
              size="xl"
              class="transition-all duration-200 hover:scale-[1.02] bg-primary-process text-white font-semibold px-6 py-4 text-lg rounded-full"
            >
              Start Explore
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>