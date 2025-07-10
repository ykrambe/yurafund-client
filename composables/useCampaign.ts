import { useCampaignStore } from '~/stores/campaign'

interface IApiResponse {
  meta : {
    message: string
    code: number
    status: string
  }
  data: any
}

export const useCampaign = () => {
  const campaignStore = useCampaignStore()
  const toast = useToast()
  
  const createCampaign = async (credentials: any) => {
    try {
      const response:IApiResponse = await campaignStore.createCampaign(credentials)
      
      if (response.meta.status === 'error') {
        throw new Error(response.meta.message);

      }
      toast.add({ title: 'Create Campaign success!', color: 'success' })
      await navigateTo('/dashboard')
    } catch (error:any) {
      toast.add({ title: 'Create Campaign failed', description: error.message, color: 'error' })
      throw error
    }
  }

  
  return { createCampaign }
}