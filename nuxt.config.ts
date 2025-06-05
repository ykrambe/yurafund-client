// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui'
  ],
  
  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**']
  },
  
  // Runtime config for API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : ''
    }
  },
  
  // CSS configuration
  css: ['~/assets/css/main.css'],
  
  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config'
  },
  
  // ESLint configuration
  eslint: {
    config: {
      stylistic: true
    }
  },
  
  // Image optimization
  image: {
    // Configure image domains if needed
  },
  
  // UI configuration
  ui: {
    global: true,
    icons: ['heroicons']
  }
})
