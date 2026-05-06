import { useQuery } from '@tanstack/react-query'
import { rewardService } from '../services/rewardService'

export const useUserBalance = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => rewardService.getUserBalance(),
  })
}

export const useRewardHistory = (limit?: number) => {
  return useQuery({
    queryKey: ['rewards', { limit }],
    queryFn: () => rewardService.getRewardHistory(limit),
  })
}
