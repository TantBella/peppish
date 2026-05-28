import { Chore, ChoreStatus, ChoreType, RewardType } from '../types'
import { choreServiceLocal } from './choreService.local'

interface CreateChorePayload {
  title: string
  description?: string
  type: ChoreType
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
  createdBy: string
}

export const choreService = {
  
  getChores: async (params?: { status?: ChoreStatus; assignedTo?: string }): Promise<Chore[]> => {
    return choreServiceLocal.getChores(params)
  },

  getChoreById: async (id: string): Promise<Chore> => {
    return choreServiceLocal.getChoreById(id)
  },

  createChore: async (payload: CreateChorePayload): Promise<Chore> => {
    const chore: Chore = {
      ...payload,
      id: '',
      status: 'available' as ChoreStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return choreServiceLocal.createChore(chore)
  },

  updateChore: async (id: string, payload: Partial<Chore>): Promise<Chore> => {
    return choreServiceLocal.updateChore(id, payload)
  },

  deleteChore: async (id: string): Promise<{ success: boolean }> => {
    return choreServiceLocal.deleteChore(id)
  },

  completeChore: async (id: string, actorId?: string): Promise<Chore> => {
    return choreServiceLocal.completeChore(id, actorId)
  },

  approveChore: async (id: string, approverRole?: string): Promise<Chore> => {
    return choreServiceLocal.approveChore(id, approverRole)
  },

  assignChore: async (id: string, userId: string): Promise<Chore> => {
    return choreServiceLocal.assignChore(id, userId)
  },

  scheduleChore: async (templateId: string, userId: string, dateStr: string): Promise<Chore> => {
    return choreServiceLocal.scheduleChore(templateId, userId, dateStr)
  },
}
