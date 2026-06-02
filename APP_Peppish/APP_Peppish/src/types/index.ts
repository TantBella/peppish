export type Role = 'adult' | 'child'

export type ChoreType = 'daily' | 'weekly' | 'irregular'

export type ChoreStatus = 'available' | 'assigned' | 'completed' | 'approved'

export type RewardType = 'money' | 'progress'

export interface User {
  id: string
  email: string
  name?: string
  role: Role
  householdId?: string
}

export interface Chore {
  id: string
  title: string
  description?: string
  type: ChoreType
  status: ChoreStatus
  rewardType: RewardType
  rewardValue?: number
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  originId?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: any
}

export type UIChoreStatus = 'Pending' | 'Completed' | 'Approved'

export const canTransition = (from: ChoreStatus, to: ChoreStatus): boolean => {
  const transitions: Record<ChoreStatus, ChoreStatus[]> = {
    available: ['assigned'],
    assigned: ['completed', 'available'],
    completed: ['approved'],
    approved: [],
  }

  return transitions[from]?.includes(to)
}
