import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

interface TransactionState {
  transactions: any[]
  pending: boolean
  error: any
}
export const useTransactionStore = defineStore('useTransactionStore', {
  state: (): TransactionState => ({
    transactions: [],
    pending: false,
    error: null
  }),

  getters: {
    getTransactions: (state) => state.transactions,
    isPending: (state) => state.pending,
    getError: (state) => state.error
  },

  actions: {
    async getUserTransaction() {
      const { api } = useApi()
      this.pending = true
      this.error = null
      try {
        let user = null
        if (localStorage.getItem('YurafundUser')) {
          user = JSON.parse(localStorage.getItem('YurafundUser')|| 'null')
        }
        
        const response: any = await api('/transactions', {
          method: 'GET'
        })
        this.transactions = response.data || []
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
