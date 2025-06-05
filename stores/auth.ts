import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    setToken(token: string) {
      this.token = token
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },

    async login(credentials: { email: string; password: string }) {
      try {
        const { $fetch } = useNuxtApp()
        const config = useRuntimeConfig()
        
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          baseURL: config.public.apiBase,
          body: credentials
        })
        
        // Handle successful login response
        // this.setToken(response.token)
        // this.setUser(response.user)
        
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    }
  }
})