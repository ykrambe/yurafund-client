import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage on client-side
  if (process.client) {
    const userData = localStorage.getItem('YurafundUser')
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        authStore.setUser(parsedUserData)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        localStorage.removeItem('YurafundUser')
      }
    }
  }
})