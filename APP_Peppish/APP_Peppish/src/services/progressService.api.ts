import { apiClient } from './apiClient'

export interface AvatarProgress {
  userId: string
  level: number
  experience: number
  maxExperience: number
  avatarUrl?: string
}

export interface DailyProgress {
  userId: string
  date: string
  completedChores: number
  totalChores: number
  approvedChores: number
}

export const progressServiceApi = {
  getAvatarProgress: async (): Promise<AvatarProgress> => {
    const res = await apiClient.get('/progress/avatar')
    return res.data as AvatarProgress
  },

  getDailyProgress: async (): Promise<DailyProgress> => {
    const res = await apiClient.get('/progress/daily')
    return res.data as DailyProgress
  },

  addExperience: async (amount: number): Promise<AvatarProgress> => {
    const res = await apiClient.post('/progress/experience', { amount })
    return res.data as AvatarProgress
  },
}
