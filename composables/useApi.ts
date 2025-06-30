export const useApi = () => {
  const config = useRuntimeConfig()
  const api = $fetch.create({
    baseURL: config.public.apiBase + '/api/v1',
    onRequest({ request, options }) {
      // Add auth token if available
      const user = JSON.parse(localStorage.getItem('YurafundUser') || '{}')
      
      console.log("🚀 ~ onRequest ~ user:", user)
      if (user.token) {
        options.headers = {
          Authorization: `Bearer ${user.token}`
        }
      }
    },
    onRequestError({ request, options, error }) {
      console.log("🚀 ~ onRequestError ~ error:", error)
      console.log("🚀 ~ onRequestError ~ options:", options)
      console.log("🚀 ~ onRequestError ~ request:", request)
      console.error('Request error:', error)
    },
    onResponse({ request, response, options }) {
      return response._data
    },
    onResponseError({ request, response, options }) {
      // Handle 401 unauthorized
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        navigateTo('/login')
      }

      return response._data
    }
  })
  
  return {
    api
  }
}