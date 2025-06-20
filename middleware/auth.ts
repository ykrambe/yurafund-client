import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side rendering
  if (process.server) {
    return
  }

  const authStore = useAuthStore()

  // Check if user is authenticated using store state first
  if (!authStore.isLoggedIn) {
    // Double check with localStorage if store is not initialized
    const userData = localStorage.getItem('YurafundUser')
    if (!userData) {
      // Redirect to login page if not authenticated
      return navigateTo('/login')
    } else {
      try {
        const parsedUserData = JSON.parse(userData)
        authStore.setUser(parsedUserData)
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        localStorage.removeItem('YurafundUser')
        return navigateTo('/login')
      }
    }
  }
})