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

export const rewardServiceApi = {
  getUserBalance: async (): Promise<UserBalance> => {
    const res = await apiClient.get('/rewards/balance')
    return res.data as UserBalance
  },

  getRewardHistory: async (limit?: number): Promise<Reward[]> => {
    const res = await apiClient.get('/rewards', { params: { limit } })
    return res.data as Reward[]
  },

  addReward: async (choreId: string, type: 'money' | 'progress', value: number): Promise<Reward> => {
    const res = await apiClient.post('/rewards', { choreId, type, value })
    return res.data as Reward
  },
}
