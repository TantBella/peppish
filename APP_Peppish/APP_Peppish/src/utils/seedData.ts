import { Chore } from '../types'

const SEED_DATA_KEY = 'peppish_seeded'

export const seedInitialData = () => {
  const useSeedExplicit = import.meta.env.VITE_USE_SEED === 'true'
  if (import.meta.env.VITE_API_URL && !useSeedExplicit) return

  if (localStorage.getItem(SEED_DATA_KEY)) return

  const today = new Date()

  const mockTemplates = [
    {
      id: 'tmpl-1',
      title: 'Städa rummet',
      description: 'Tidy up and organize your room',
      rewardAmount: 10,
      rewardPoints: 100,
      recurrence: 'Daily',
    },
    {
      id: 'tmpl-2',
      title: 'Diska',
      description: 'Clean and dry all dishes after dinner',
      rewardAmount: 3,
      rewardPoints: 20,
      recurrence: 'Daily',
    },
  ]

  const mockChores: Chore[] = [
    {
      id: 'inst-1',
      title: 'Städa rummet',
      dueDate: today.toISOString(),
      status: 'Pending',
      assignedToUserId: undefined,
      assignedToUserName: undefined,
      rewardAmount: 10,
    },
    {
      id: 'inst-2',
      title: 'Diska',
      dueDate: today.toISOString(),
      status: 'Pending',
      assignedToUserId: '2',
      assignedToUserName: 'Child User',
      rewardAmount: 3,
    },
    {
      id: 'inst-3',
      title: 'Diska',
      dueDate: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'Completed',
      assignedToUserId: '2',
      assignedToUserName: 'Child User',
      rewardAmount: 3,
    },
    {
      id: 'inst-4',
      title: 'Slänga skräp',
      dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Approved',
      assignedToUserId: '2',
      assignedToUserName: 'Child User',
      rewardAmount: 8,
    },
  ]

  localStorage.setItem('peppish_chore_templates', JSON.stringify(mockTemplates))
  localStorage.setItem('peppish_chores', JSON.stringify(mockChores))

  const mockRewards = [
    {
      id: 'reward-1',
      userId: '2',
      amount: 8,
      reason: 'Completed chore: Slänga skräp',
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  localStorage.setItem('peppish_rewards', JSON.stringify(mockRewards))

  const mockProgress = {
    '2': {
      currentLevel: 3,
      currentXp: 450,
    },
  }

  localStorage.setItem('peppish_progress', JSON.stringify(mockProgress))

  localStorage.setItem(SEED_DATA_KEY, 'true')
}
