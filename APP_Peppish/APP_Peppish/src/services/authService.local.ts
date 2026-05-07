import { AuthResponse, User } from '../types'

const USERS_STORAGE_KEY = 'peppish_users'
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'parent@example.com',
  
    name: 'Mamman',
    role: 'adult'
  },
  {
    id: '2',
    email: 'child@example.com',
    name: 'Mattan',
    role: 'child'
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
      throw {
        response: {
          status: 401,
          data: { message: 'Invalid email or password' }
        }
      }
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
    role: 'adult' | 'child'
  ): Promise<AuthResponse> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const users = getUsers()
    
    if (users.find(u => u.email === email)) {
      throw {
        response: {
          status: 400,
          data: { message: 'User already exists' }
        }
      }
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role
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
      throw {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }
    }
    
    const user = localStorage.getItem('user')
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { message: 'User not found' }
        }
      }
    }
    
    return JSON.parse(user)
  }
}
