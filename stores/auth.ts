import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface User {
  id: number
  name: string
  email: string
  image_url?: string
  token: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

interface ILogin {
  email: string
  password: string
}

export const useAuthStore = defineStore('useAuthStore', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false
  }),

  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    },
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('YurafundToken')
      localStorage.removeItem('YurafundUser')
    },
  async login(credentials: ILogin) {
    const { api } = useApi()
    try {
      const response: any = await api('/sessions', {
        method: 'POST',
        body: credentials
      })
      
      // Update state setelah login berhasil
      this.setUser(response.data)

      localStorage.setItem('YurafundUser', JSON.stringify(response.data))
      
      return response
    } catch (error: any) {
      return error.data
    }
}
  }
})
