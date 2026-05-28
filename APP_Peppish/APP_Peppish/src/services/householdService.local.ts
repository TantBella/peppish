export interface Household {
  id: string
  name: string
}

const STORAGE_KEY = 'peppish_households'

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2,9)}`

const read = (): Household[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const write = (items: Household[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

export const householdServiceLocal = {
  getHouseholds: async (): Promise<Household[]> => {
    await new Promise((r) => setTimeout(r, 50))
    return read()
  },

  getHouseholdById: async (id: string): Promise<Household | undefined> => {
    const items = read()
    return items.find((h) => h.id === id)
  },

  createHousehold: async (name: string): Promise<Household> => {
    const items = read()
    const h: Household = { id: generateId(), name }
    write([h, ...items])
    return h
  },
}
