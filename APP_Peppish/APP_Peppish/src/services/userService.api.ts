import { apiClient } from './apiClient'
import { User } from '../types'

export const userServiceApi = {
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get('/users')
    return res.data as User[]
  },

  updateUser: async (id: string, patch: Partial<User>): Promise<User> => {
    const res = await apiClient.patch(`/users/${id}`, patch)
    return res.data as User
  },

  createUser: async (user: User): Promise<User> => {
    const res = await apiClient.post('/users', user)
    return res.data as User
  },
}
