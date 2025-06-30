import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface CampaignState {
  campaigns: any[]
  pending: boolean
  error: any
}
export const useCampaignStore = defineStore('useCampaignStore', {
  state: (): CampaignState => ({
    campaigns: [],
    pending: false,
    error: null
  }),

  getters: {
    getCampaigns: (state) => state.campaigns,
    isPending: (state) => state.pending,
    getError: (state) => state.error
  },

  actions: {
    async getUserCampaigns() {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        let user = null
        if (localStorage.getItem('YurafundUser')) {
          user = JSON.parse(localStorage.getItem('YurafundUser')|| 'null')
        }
        
        const response: any = await api(`/campaigns?user_id=${user[0].id}`, {
          method: 'GET'
        })
        this.campaigns = response.data || []
        this.pending = false
        return response
      } catch (error: any) {
        this.error = error.data || error
        this.pending = false
        return error.data
      }
    }
  }
})
