import { Chore, ChoreStatus, ChoreType, RewardType } from '../types'
import { apiClient } from './apiClient'

interface CreateChorePayload {
  title: string
  description?: string
  type: ChoreType
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
  createdBy: string
}

export const choreServiceApi = {
  getChores: async (params?: { status?: ChoreStatus; assignedTo?: string }): Promise<Chore[]> => {
    const res = await apiClient.get('/chore-instances', { params })
    return res.data as Chore[]
  },

  getChoreById: async (id: string): Promise<Chore> => {
    const res = await apiClient.get(`/chores/${id}`)
    return res.data as Chore
  },

  createChore: async (payload: CreateChorePayload): Promise<Chore> => {
    const res = await apiClient.post('/chores', payload)
    return res.data as Chore
  },

  updateChore: async (id: string, payload: Partial<Chore>): Promise<Chore> => {
    const res = await apiClient.patch(`/chores/${id}`, payload)
    return res.data as Chore
  },

  deleteChore: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete(`/chores/${id}`)
    return res.data as { success: boolean }
  },

  completeChore: async (id: string, actorId?: string): Promise<Chore> => {
    const res = await apiClient.post(`/chores/${id}/complete`, { actorId })
    return res.data as Chore
  },

  approveChore: async (id: string, approverRole?: string): Promise<Chore> => {
    const res = await apiClient.post(`/chores/${id}/approve`, { approverRole })
    return res.data as Chore
  },

  assignChore: async (id: string, userId: string): Promise<Chore> => {
    const res = await apiClient.patch(`/chores/${id}`, { assignedTo: userId, status: 'assigned' as ChoreStatus })
    return res.data as Chore
  },

  scheduleChore: async (templateId: string, userId: string, dateStr: string): Promise<Chore> => {
    // Best-effort: create a new occurrence via POST /chores using originId and createdAt
    const payload = {
      originId: templateId,
      assignedTo: userId,
      createdAt: new Date(dateStr).toISOString(),
      // Other fields expected by API should be provided by caller or defaulted server-side
    } as any
    const res = await apiClient.post('/chores', payload)
    return res.data as Chore
  },
}
