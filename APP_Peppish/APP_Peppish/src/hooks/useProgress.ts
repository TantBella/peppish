import { useQuery } from '@tanstack/react-query'
import { progressService } from '../services/progressService'

export const useAvatarProgress = () => {
  return useQuery({
    queryKey: ['avatar-progress'],
    queryFn: () => progressService.getAvatarProgress(),
  })
}

export const useDailyProgress = () => {
  return useQuery({
    queryKey: ['daily-progress'],
    queryFn: () => progressService.getDailyProgress(),
  })
}
