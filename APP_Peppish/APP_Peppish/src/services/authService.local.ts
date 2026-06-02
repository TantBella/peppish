import { AuthResponse, User } from '../types'

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
  }
]

const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : DEFAULT_USERS
}

const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const authServiceLocal = {
  login: async (email: string, _password: string): Promise<AuthResponse> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()
    const user = users.find(u => u.email === email)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user
    }
  },

  register: async (
    name: string,
    email: string,
    _password: string,
    role: 'adult' | 'child',
    householdId?: string
  ): Promise<AuthResponse> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const users = getUsers()

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      householdId
    }

    saveUsers([...users, newUser])

    return {
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      user: newUser
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200))

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Unauthorized')
    }

    const user = localStorage.getItem('user')
    if (!user) {
      throw new Error('User not found')
    }

    return JSON.parse(user)
  }
}
