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

const REWARDS_STORAGE_KEY = 'peppish_rewards'

const getRewards = (): Reward[] => {
  const stored = localStorage.getItem(REWARDS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const getUserId = (): string => {
  const user = localStorage.getItem('user')
  if (!user) throw new Error('User not authenticated')
  return JSON.parse(user).id
}

export const rewardServiceLocal = {
  getUserBalance: async (): Promise<UserBalance> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userId = getUserId()
    const rewards = getRewards()
    const userRewards = rewards.filter(r => r.userId === userId)
    
    const totalMoney = userRewards
      .filter(r => r.type === 'money')
      .reduce((sum, r) => sum + r.value, 0)
    
    const totalProgress = userRewards
      .filter(r => r.type === 'progress')
      .reduce((sum, r) => sum + r.value, 0)
    
    return {
      userId,
      totalMoney,
      totalProgress
    }
  },

  getRewardHistory: async (limit?: number): Promise<Reward[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userId = getUserId()
    const rewards = getRewards()
    const userRewards = rewards
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return limit ? userRewards.slice(0, limit) : userRewards
  },

  addReward: async (choreId: string, type: 'money' | 'progress', value: number): Promise<Reward> => {
    const userId = getUserId()
    const rewards = getRewards()
    
    const reward: Reward = {
      id: `reward-${Date.now()}`,
      userId,
      choreId,
      type,
      value,
      createdAt: new Date().toISOString()
    }
    
    rewards.push(reward)
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards))
    
    return reward
  }
}
