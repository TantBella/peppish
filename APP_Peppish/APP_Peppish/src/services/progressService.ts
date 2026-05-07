import { progressServiceLocal, AvatarProgress, DailyProgress } from './progressService.local'

export type { AvatarProgress, DailyProgress }

export const progressService = {
  getAvatarProgress: async (): Promise<AvatarProgress> => {
    return progressServiceLocal.getAvatarProgress()
  },

  getDailyProgress: async (): Promise<DailyProgress> => {
    return progressServiceLocal.getDailyProgress()
  },
}
