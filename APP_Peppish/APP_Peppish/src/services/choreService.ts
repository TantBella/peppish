import { Chore, ChoreStatus, ChoreType, RewardType } from '../types'
import { choreServiceLocal } from './choreService.local'
import { choreServiceApi } from './choreService.api'

interface CreateChorePayload {
  title: string
  description?: string
  type: ChoreType
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
  createdBy: string
}

// Use API-backed service when REACT_APP_API_URL is set; otherwise fallback to local
export const choreService = process.env.REACT_APP_API_URL ? choreServiceApi : choreServiceLocal
