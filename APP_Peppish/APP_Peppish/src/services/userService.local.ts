import { User } from '../types'

const USERS_STORAGE_KEY = 'peppish_users'

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'parent@example.com',
    name: 'Mamman',
    role: 'adult',
    householdId: 'house-1',
  },
  {
    id: '2',
    email: 'child@example.com',
    name: 'Mattan',
    role: 'child',
    householdId: 'house-1',
  },
]

const readUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_USERS
}

const writeUsers = (users: User[]) => localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

export const userServiceLocal = {
  getUsers: async (): Promise<User[]> => {
    // simulate async
    await new Promise((r) => setTimeout(r, 50))
    return readUsers()
  },

  updateUser: async (id: string, patch: Partial<User>): Promise<User> => {
    const users = readUsers()
    const updated = users.map((u) => (u.id === id ? { ...u, ...patch } : u))
    writeUsers(updated)
    const found = updated.find((u) => u.id === id)!
    return found
  },

  createUser: async (user: User): Promise<User> => {
    const users = readUsers()
    writeUsers([user, ...users])
    return user
  }
}
