import { progressServiceLocal } from './progressService.local'
import { progressServiceApi, AvatarProgress, DailyProgress } from './progressService.api'

export type { AvatarProgress, DailyProgress }

export const progressService = import.meta.env.VITE_API_URL ? progressServiceApi : progressServiceLocal
