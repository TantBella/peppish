import { Chore } from '../types'

const SEED_DATA_KEY = 'peppish_seeded'

export const seedInitialData = () => {
  // Do not seed when an external API is configured unless explicitly allowed
  const useSeedExplicit = process.env.REACT_APP_USE_SEED === 'true'
  if (process.env.REACT_APP_API_URL && !useSeedExplicit) {
    // Running against a real backend — skip seeding localStorage
    return
  }

  // Only seed once
  if (localStorage.getItem(SEED_DATA_KEY)) {
    return
  }

  // Seed chores
  const today = new Date()
  const mockChores: Chore[] = [
    {
      id: 'chore-1',
      title: 'Städa rummet',
      description: 'Tidy up and organize your room',
      type: 'daily',
      status: 'available',
      rewardType: 'money',
      rewardValue: 5,
      createdBy: '1',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    },
    {
      id: 'chore-2',
      title: 'Göra läxan',
      description: 'Complete math and science assignments',
      type: 'daily',
      status: 'assigned',
      assignedTo: '2',
      rewardType: 'progress',
      rewardValue: 50,
      createdBy: '1',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    },
    {
      id: 'chore-3',
      title: 'Diska',
      description: 'Clean and dry all dishes after dinner',
      type: 'daily',
      status: 'completed',
      rewardType: 'money',
      rewardValue: 3,
      createdBy: '1',
      createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'chore-4',
      title: 'Slänga skräp',
      description: 'Empty the trash bins',
      type: 'weekly',
      status: 'approved',
      rewardType: 'money',
      rewardValue: 8,
      createdBy: '1',
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'chore-5',
      title: 'Träna trummor',
      description: 'Play for 30 minutes',
      type: 'daily',
      status: 'available',
      rewardType: 'progress',
      rewardValue: 100,
      createdBy: '1',
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
    },
  ]

  localStorage.setItem('peppish_chores', JSON.stringify(mockChores))

  // Seed rewards for user 2 (child)
  const mockRewards = [
    {
      id: 'reward-1',
      userId: '2',
      choreId: 'chore-4',
      type: 'money' as const,
      value: 8,
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'reward-2',
      userId: '2',
      choreId: 'chore-3',
      type: 'money' as const,
      value: 3,
      createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'reward-3',
      userId: '2',
      choreId: 'chore-2',
      type: 'progress' as const,
      value: 50,
      createdAt: today.toISOString(),
    },
  ]

  localStorage.setItem('peppish_rewards', JSON.stringify(mockRewards))

  // Seed progress for user 2
  const mockProgress = {
    '2': {
      level: 3,
      experience: 450,
    },
  }

  localStorage.setItem('peppish_progress', JSON.stringify(mockProgress))

  // Mark as seeded
  localStorage.setItem(SEED_DATA_KEY, 'true')
}
