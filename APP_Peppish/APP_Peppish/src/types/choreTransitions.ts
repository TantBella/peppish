import { ChoreStatus } from '../types'

export const canTransition = (from: ChoreStatus, to: ChoreStatus): boolean => {
  const transitions: Record<ChoreStatus, ChoreStatus[]> = {
    available: ['assigned'],
    assigned: ['completed', 'available'],
    completed: ['approved'],
    approved: [],
  }

  return transitions[from]?.includes(to)
}
