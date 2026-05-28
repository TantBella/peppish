import { User } from '../types'

const USERS_STORAGE_KEY = 'peppish_users'

const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'parent@example.com',
    name: 'Mamman',
    role: 'adult',
  },
  {
    id: '2',
    email: 'child@example.com',
    name: 'Mattan',
    role: 'child',
  },
]

const readUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_USERS
}

export const userServiceLocal = {
  getUsers: async (): Promise<User[]> => {
    // simulate async
    await new Promise((r) => setTimeout(r, 50))
    return readUsers()
  },
}
