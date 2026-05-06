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

export const progressService = {
  getAvatarProgress: async (): Promise<AvatarProgress> => {
    const response = await apiClient.get<AvatarProgress>('/progress/avatar')
    return response.data
  },

  getDailyProgress: async (): Promise<DailyProgress> => {
    const response = await apiClient.get<DailyProgress>('/progress/daily')
    return response.data
  },
}
