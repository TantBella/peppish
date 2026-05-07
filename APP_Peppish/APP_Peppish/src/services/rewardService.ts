import { rewardServiceLocal, Reward, UserBalance } from './rewardService.local'

export type { Reward, UserBalance }

export const rewardService = {
  getUserBalance: async (): Promise<UserBalance> => {
    return rewardServiceLocal.getUserBalance()
  },

  getRewardHistory: async (limit?: number): Promise<Reward[]> => {
    return rewardServiceLocal.getRewardHistory(limit)
  },
}
