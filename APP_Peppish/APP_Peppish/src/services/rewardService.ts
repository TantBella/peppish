import { rewardServiceLocal } from './rewardService.local'
import { rewardServiceApi, Reward, UserBalance } from './rewardService.api'

export type { Reward, UserBalance }

export const rewardService = process.env.REACT_APP_API_URL ? rewardServiceApi : rewardServiceLocal
