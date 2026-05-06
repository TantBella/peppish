import { apiClient } from './apiClient'
import { Chore, ChoreStatus, ChoreType, RewardType } from '../types'

interface CreateChorePayload {
  title: string
  description?: string
  type: ChoreType
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
}

export const choreService = {
  getChores: async (params?: { status?: ChoreStatus; assignedTo?: string }): Promise<Chore[]> => {
    const response = await apiClient.get<Chore[]>('/chore-instances', { params })
    return response.data
  },

  getChoreById: async (id: string): Promise<Chore> => {
    const response = await apiClient.get<Chore>(`/chores/${id}`)
    return response.data
  },

  createChore: async (payload: CreateChorePayload): Promise<Chore> => {
    const response = await apiClient.post<Chore>('/chores', payload)
    return response.data
  },

  updateChore: async (id: string, payload: Partial<Chore>): Promise<Chore> => {
    const response = await apiClient.patch<Chore>(`/chores/${id}`, payload)
    return response.data
  },

  deleteChore: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(`/chores/${id}`)
    return response.data
  },

  completeChore: async (id: string): Promise<Chore> => {
    const response = await apiClient.post<Chore>(`/chores/${id}/complete`)
    return response.data
  },

  approveChore: async (id: string): Promise<Chore> => {
    const response = await apiClient.post<Chore>(`/chores/${id}/approve`)
    return response.data
  },
}
