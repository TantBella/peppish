export type Role = 'adult' | 'child'

export type ChoreType = 'daily' | 'weekly' | 'irregular'

export type ChoreStatus = 'available' | 'assigned' | 'completed' | 'approved'

export type RewardType = 'money' | 'progress'

export interface User {
  id: string
  email: string
  name?: string
  role: Role
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
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  code: string
  status: number
}

export type UIChoreStatus = 'Pending' | 'Completed' | 'Approved'
