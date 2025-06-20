export const useApi = () => {
  const config = useRuntimeConfig()
  const api = $fetch.create({
    baseURL: config.public.apiBase + '/api/v1',
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ request, options }) {
      // Add auth token if available
      const authStore = useAuthStore()
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`
        }
      }
    },
    onRequestError({ request, options, error }) {
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