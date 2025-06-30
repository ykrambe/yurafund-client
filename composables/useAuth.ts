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
        throw new Error(response.meta.message);

      }
      toast.add({ title: 'Login success!', color: 'success' })
      await navigateTo('/dashboard')
    } catch (error:any) {
      toast.add({ title: 'Login failed', description: error.message, color: 'error' })
      throw error
    }

  }

  const register = async (credentials: any) => {
    try {
      const response:IApiResponse = await authStore.register(credentials)
      
      if (response.meta.status === 'error') {
        throw new Error(response.meta.message);
      }

      toast.add({ title: 'Register success!', color: 'success' })
      await navigateTo('/upload')
    } catch (error:any) {
      toast.add({ title: 'Register failed', description: error.message, color: 'error' })
      throw error
    }
  }

  const uploadAvatar = async (credentials: any) => {
    try {
      const response:IApiResponse = await authStore.uploadAvatar(credentials)
      
      if (response.meta.status === 'error') {
        throw new Error(response.meta.message);
      }

      toast.add({ title: 'Upload Avatar success!', color: 'success' })
      await navigateTo('/register-success')
    } catch (error:any) {
      toast.add({ title: 'Register failed', description: error.message, color: 'error' })
      throw error
    }
  }
  
  return { login, register, uploadAvatar }
}