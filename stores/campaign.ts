import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface CampaignState {
  campaigns: any[]
  campaign: any
  pending: boolean
  error: any
}
export const useCampaignStore = defineStore('useCampaignStore', {
  state: (): CampaignState => ({
    campaigns: [],
    campaign: {
      id: 0,
      name: '',
      short_description: '',
      description: '',
      goal_amount: 0,
      perks: '',
      user_id: 0,
      created_at: '',
      updated_at: '',
    },
    pending: false,
    error: null
  }),

  getters: {
    getCampaigns: (state) => state.campaigns,
    getCampaign: (state) => state.campaign,
    isPending: (state) => state.pending,
    getError: (state) => state.error,
  },

  actions: {
    async getUserCampaigns() {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        let user = null
        if (process.client && localStorage.getItem('YurafundUser')) {
          user = JSON.parse(localStorage.getItem('YurafundUser')|| 'null')
        }
        
        const response: any = await api(`/campaigns?user_id=${user.id}`, {
          method: 'GET'
        })

        this.campaigns = response.data
        this.pending = false

        return response
      } catch (error: any) {
        this.error = error.data || error
        this.pending = false
        return error.data
      }
    },
    async getUserCampaignById(id:number) {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        let user = null
        if (localStorage.getItem('YurafundUser')) {
          user = JSON.parse(localStorage.getItem('YurafundUser')|| 'null')
        }
        
        const response: any = await api(`/campaigns/${id}?user_id=${user.id}`, {
          method: 'GET'
        })

        this.campaign = response.data
        this.pending = false

        return response
      } catch (error: any) {
        this.error = error.data || error
        this.pending = false
        return error.data
      }
    },

    async createCampaign(credentials:any) {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        const response: any = await api('/campaigns', {
          method: 'POST',
          body: credentials
        })
        return response
      } catch (error:any) {
        return error.data
      }
    },
    async updateCampaign(id:number, credentials:any) {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        const response: any = await api(`/campaigns/${id}`, {
          method: 'PUT',
          body: credentials
        })

        this.campaign = response.data
        this.pending = false

        return response
      } catch (error: any) {
        this.error = error.data || error
        this.pending = false
        return error.data
      }
    },
    async getCampaignToFund() {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        let user = null
        if (localStorage.getItem('YurafundUser')) {
          user = JSON.parse(localStorage.getItem('YurafundUser')|| 'null')
        }
        
        const response: any = await api(`/campaigns`, {
          method: 'GET'
        })

        this.campaigns = response.data
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
