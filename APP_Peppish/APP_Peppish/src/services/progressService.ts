import { progressServiceLocal } from './progressService.local'
import { progressServiceApi, AvatarProgress, DailyProgress } from './progressService.api'

export type { AvatarProgress, DailyProgress }

export const progressService = process.env.REACT_APP_API_URL ? progressServiceApi : progressServiceLocal
