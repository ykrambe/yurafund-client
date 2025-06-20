import { useAuthStore } from '~/stores/auth'

interface ILogin {
  email: string
  password: string
}

interface IApiResponse {
  meta : {
    message: string
    code: number
    status: string
  }
  data: any
}

export const useAuth = () => {
  const authStore = useAuthStore()
  const toast = useToast()
  
  const login = async (credentials: ILogin) => {
    try {
      const response:IApiResponse = await authStore.login(credentials)
      
      if (response.meta.status === 'error') {
        throw new Error(response.data.errors);

      }
      toast.add({ title: 'Login berhasil!', color: 'success' })
      await navigateTo('/dashboard')
    } catch (error:any) {
      toast.add({ title: 'Login failed', description: error.message, color: 'error' })
      throw error
    }

  }
  
  return { login }
}