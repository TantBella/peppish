import { useQuery } from '@tanstack/react-query'
import { choreService } from '../services/choreService'
import { Chore, ChoreStatus, UIChoreStatus } from '../types'

const mapChoreStatusToUI = (status: ChoreStatus): UIChoreStatus => {
  if (status === 'Pending') return 'Pending'
  if (status === 'Completed') return 'Completed'
  return 'Approved'
}

export interface ChoreWithUIStatus extends Chore {
  uiStatus: UIChoreStatus
}

export const useChores = (params?: { status?: ChoreStatus; assignedTo?: string }) => {
  return useQuery({
    queryKey: ['chores', params],
    queryFn: async () => {
      const chores = await choreService.getChores(params)
      return chores.map((chore) => ({
        ...chore,
        uiStatus: mapChoreStatusToUI(chore.status),
      })) as ChoreWithUIStatus[]
    },
  })
}

export const useChore = (id: string) => {
  return useQuery({
    queryKey: ['chore', id],
    queryFn: async () => {
      const chore = await choreService.getChoreById(id)
      return {
        ...chore,
        uiStatus: mapChoreStatusToUI(chore!.status),
      } as ChoreWithUIStatus
    },
    enabled: !!id,
  })
}
