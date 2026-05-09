import { Chore } from '../types'

const SEED_DATA_KEY = 'peppish_seeded'

const dayOffset = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

export const seedInitialData = () => {
  // if (localStorage.getItem(SEED_DATA_KEY)) return
 const mockChores: Chore[] = Array.from({ length: 15 }).map((_, i) => {
    const daysAgo = Math.floor((i / 15) * 30)

    return {
      id: `chore-${i + 1}`,
      title: [
        'Städa rummet',
        'Göra läxan',
        'Diska',
        'Slänga skräp',
        'Träna',
        'Tvätta kläder',
        'Damma',
        'Gå ut med sopor',
        'Vattna blommor',
        'Sortera tvätt',
        'Rensa skrivbord',
        'Städa badrum',
        'Hjälpa till i köket',
        'Gå ut med hunden',
        'Organisera garderob',
      ][i],
      description: 'Automatiskt genererad chore för mockdata',
      type: i % 2 === 0 ? 'daily' : 'weekly',
      status:
        i % 4 === 0
          ? 'completed'
          : i % 4 === 1
            ? 'approved'
            : i % 4 === 2
              ? 'assigned'
              : 'available',
      rewardType: i % 3 === 0 ? 'money' : 'progress',
      rewardValue: i % 3 === 0 ? 5 + i : 25 + i * 2,
      createdBy: '1',
      createdAt: dayOffset(daysAgo),
      updatedAt: dayOffset(daysAgo - 1),
    }
  })

  localStorage.setItem('peppish_chores', JSON.stringify(mockChores))

  const mockRewards = mockChores
    .filter((_, i) => i % 2 === 0) 
    .map((chore, i) => ({
      id: `reward-${i + 1}`,
      userId: '2',
      choreId: chore.id,
      type: chore.rewardType,
      value: chore.rewardValue,
      createdAt: chore.createdAt,
    }))

  localStorage.setItem('peppish_rewards', JSON.stringify(mockRewards))

  const mockProgress = {
    '2': {
      level: 3,
      experience: 450,
    },
  }

  localStorage.setItem('peppish_progress', JSON.stringify(mockProgress))

  localStorage.setItem(SEED_DATA_KEY, 'true')
}