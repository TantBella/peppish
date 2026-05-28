import { AuthResponse, User } from '../types'
import { authServiceLocal } from './authService.local'

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return authServiceLocal.login(email, password)
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: 'adult' | 'child',
    householdId?: string
  ): Promise<AuthResponse> => {
    return authServiceLocal.register(name, email, password, role, householdId)
  },

  getCurrentUser: async (): Promise<User> => {
    return authServiceLocal.getCurrentUser()
  },
}
