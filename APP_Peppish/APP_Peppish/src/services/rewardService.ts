import { apiClient } from './apiClient'

export interface Reward {
  id: string
  userId: string
  choreId: string
  type: 'money' | 'progress'
  value: number
  createdAt: string
}

export interface UserBalance {
  userId: string
  totalMoney: number
  totalProgress: number
}

export const rewardService = {
  getUserBalance: async (): Promise<UserBalance> => {
    const response = await apiClient.get<UserBalance>('/rewards/balance')
    return response.data
  },

  getRewardHistory: async (limit?: number): Promise<Reward[]> => {
    const params = limit ? { limit } : {}
    const response = await apiClient.get<Reward[]>('/rewards/history', { params })
    return response.data
  },
}
