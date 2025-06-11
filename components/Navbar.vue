<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white" 
  >
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <NuxtLink to="/" class="flex items-center">
          <img src="/logo-footer-black.svg" alt="YuraFund Logo" class="h-10 mr-2" />
        </NuxtLink>
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        class="lg:hidden focus:outline-none transition-colors"
        :class="{'text-gray-800': scrolled, 'text-white': !scrolled}"
      >
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!showMobileMenu"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-1">
        <NuxtLink
          to="/"
          class="px-4 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
        >
          Home
        </NuxtLink>
        <a
          href="#projects"
          class="px-4 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
        >
          Projects
        </a>
        <a
          href="#features"
          class="px-4 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
        >
          Features
        </a>
        <a
          href="#testimonials"
          class="px-4 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
        >
          Success Stories
        </a>
      </nav>

      <!-- Auth Buttons (Desktop) -->
      <div class="hidden lg:flex items-center space-x-4">
        <template v-if="!authStore.isLoggedIn">
          <NuxtLink
            to="/login"
            class="px-4 py-2 rounded-md text-base font-medium transition-colors bg-gray-800  hover:text-white hover:bg-gray-500"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="px-4 py-2 rounded-md text-base font-medium transition-colors bg-gray-800  hover:text-white hover:bg-gray-500"
          >
            Sign Up
          </NuxtLink>
        </template>

        <!-- User Dropdown (Desktop) -->
        <div v-else class="relative">
          <button
            @click="toggleDropdown"
            class="flex items-center space-x-2 px-4 py-2 rounded-md transition-colors"
            :class="{'text-gray-800 hover:bg-gray-100': scrolled, 'text-white hover:bg-white hover:bg-opacity-20': !scrolled}"
          >
            <img
              v-if="authStore.user?.image_url"
              :src="config.public.apiBase + '/' + authStore.user.image_url"
              alt="User avatar"
              class="h-8 w-8 rounded-full object-cover"
            />
            <div v-else class="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
              {{ authStore.user?.name?.charAt(0) || 'U' }}
            </div>
            <span class="font-medium">{{ authStore.user?.name || 'User' }}</span>
            <svg
              class="h-4 w-4 transition-transform duration-200"
              :class="{'rotate-180': showDropdown}"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-show="showDropdown"
              v-click-outside="closeDropdown"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <NuxtLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600">
                My Dashboard
              </NuxtLink>
              <NuxtLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600">
                Account Settings
              </NuxtLink>
              <button @click="logout()" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600">
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="showMobileMenu" class="lg:hidden bg-white">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink
            to="/"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
            @click="showMobileMenu = false"
          >
            Home
          </NuxtLink>
          <a
            href="#projects"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
            @click="showMobileMenu = false"
          >
            Projects
          </a>
          <a
            href="#features"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
            @click="showMobileMenu = false"
          >
            Features
          </a>
          <a
            href="#testimonials"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors text-black hover:text-white hover:bg-gray-500"
            @click="showMobileMenu = false"
          >
            Success Stories
          </a>

          <!-- Auth Buttons (Mobile) -->
          <div v-if="!authStore.isLoggedIn" class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center px-3 space-x-3">
              <NuxtLink
                to="/login"
                class="block w-full px-3 py-2 rounded-md text-base font-medium text-center text-black border border-black hover:bg-gray-500 hover:text-white"
                @click="showMobileMenu = false"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="block w-full px-3 py-2 rounded-md text-base font-medium text-center text-black border border-black hover:bg-gray-500 hover:text-white"
                @click="showMobileMenu = false"
              >
                Sign Up
              </NuxtLink>
            </div>
          </div>

          <!-- User Profile (Mobile) -->
          <div v-else class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center px-3">
              <div class="flex-shrink-0">
                <img
                  v-if="authStore.user?.image_url"
                  :src="config.public.apiBase + '/' + authStore.user.image_url"
                  alt="User avatar"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div v-else class="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-medium">
                  {{ authStore.user?.name?.charAt(0) || 'U' }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium" :class="{'text-gray-800': scrolled, 'text-white': !scrolled}">
                  {{ authStore.user?.name || 'User' }}
                </div>
              </div>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <NuxtLink
                to="/dashboard"
                class="block px-3 py-2 rounded-md text-base font-medium"
                :class="{'text-gray-800 hover:text-teal-600 hover:bg-gray-100': scrolled, 'text-white hover:text-white hover:bg-white hover:bg-opacity-20': !scrolled}"
                @click="showMobileMenu = false"
              >
                My Dashboard
              </NuxtLink>
              <NuxtLink
                to="/dashboard"
                class="block px-3 py-2 rounded-md text-base font-medium"
                :class="{'text-gray-800 hover:text-teal-600 hover:bg-gray-100': scrolled, 'text-white hover:text-white hover:bg-white hover:bg-opacity-20': !scrolled}"
                @click="showMobileMenu = false"
              >
                Account Settings
              </NuxtLink>
              <button
                @click="logout(); showMobileMenu = false"
                class="w-full text-left block px-3 py-2 rounded-md text-base font-medium"
                :class="{'text-gray-800 hover:text-teal-600 hover:bg-gray-100': scrolled, 'text-white hover:text-white hover:bg-white hover:bg-opacity-20': !scrolled}"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Reactive data
const showMobileMenu = ref(false)
const showDropdown = ref(false)
const scrolled = ref(false)

// Store and config
const authStore = useAuthStore()
const config = useRuntimeConfig()

// Methods
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  // Close dropdown when opening mobile menu
  if (showMobileMenu.value) {
    showDropdown.value = false
  }
}

const logout = async () => {
  await authStore.logout()
  closeDropdown()
  await navigateTo('/')
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 10
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Initial check
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Click outside directive
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Add smooth transitions */
.transition-all {
  transition-property: all;
}

.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
}

.transition-transform {
  transition-property: transform;
}

.transition-opacity {
  transition-property: opacity;
}

.ease-linear {
  transition-timing-function: linear;
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.rotate-180 {
  transform: rotate(180deg);
}
</style>
