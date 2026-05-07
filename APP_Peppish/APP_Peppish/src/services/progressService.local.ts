import { Chore } from '../types'

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

const PROGRESS_STORAGE_KEY = 'peppish_progress'
const MAX_EXPERIENCE_PER_LEVEL = 1000

const getUserId = (): string => {
  const user = localStorage.getItem('user')
  if (!user) throw new Error('User not authenticated')
  return JSON.parse(user).id
}

const getProgress = () => {
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

const getChores = (): Chore[] => {
  const stored = localStorage.getItem('peppish_chores')
  return stored ? JSON.parse(stored) : []
}

export const progressServiceLocal = {
  getAvatarProgress: async (): Promise<AvatarProgress> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userId = getUserId()
    const progress = getProgress()
    const userProgress = progress[userId] || {
      experience: 0,
      level: 1
    }
    
    return {
      userId,
      level: userProgress.level || 1,
      experience: userProgress.experience || 0,
      maxExperience: MAX_EXPERIENCE_PER_LEVEL,
      avatarUrl: undefined
    }
  },

  getDailyProgress: async (): Promise<DailyProgress> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userId = getUserId()
    const chores = getChores()
    const today = new Date().toISOString().split('T')[0]
    
    const todayChores = chores.filter(c => {
      const choreDate = c.createdAt.split('T')[0]
      return choreDate === today
    })
    
    const completedChores = todayChores.filter(c => c.status === 'completed' || c.status === 'approved').length
    const approvedChores = todayChores.filter(c => c.status === 'approved').length
    const totalChores = todayChores.length
    
    return {
      userId,
      date: today,
      completedChores,
      totalChores,
      approvedChores
    }
  },

  addExperience: async (amount: number): Promise<AvatarProgress> => {
    const userId = getUserId()
    const progress = getProgress()
    const userProgress = progress[userId] || {
      experience: 0,
      level: 1
    }
    
    userProgress.experience += amount
    
    while (userProgress.experience >= MAX_EXPERIENCE_PER_LEVEL) {
      userProgress.experience -= MAX_EXPERIENCE_PER_LEVEL
      userProgress.level += 1
    }
    
    progress[userId] = userProgress
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
    
    return {
      userId,
      level: userProgress.level,
      experience: userProgress.experience,
      maxExperience: MAX_EXPERIENCE_PER_LEVEL,
      avatarUrl: undefined
    }
  }
}
