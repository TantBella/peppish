import { AuthResponse, User } from '../types'
import { apiClient } from './apiClient'

export const authServiceApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', { email, password })
    return res.data as AuthResponse
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: 'adult' | 'child',
    householdId?: string
  ): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/register', { name, email, password, role, householdId })
    return res.data as AuthResponse
  },

  getCurrentUser: async (): Promise<User> => {
    const res = await apiClient.get('/users/me')
    return res.data as User
  },
}
