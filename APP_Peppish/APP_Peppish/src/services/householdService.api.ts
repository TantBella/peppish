import { apiClient } from './apiClient'

export interface Household {
  id: string
  name: string
}

export const householdServiceApi = {
  getHouseholds: async (): Promise<Household[]> => {
    const res = await apiClient.get('/households')
    return res.data as Household[]
  },

  getHouseholdById: async (id: string): Promise<Household | undefined> => {
    const res = await apiClient.get(`/households/${id}`)
    return res.data as Household
  },

  createHousehold: async (name: string): Promise<Household> => {
    const res = await apiClient.post('/households', { name })
    return res.data as Household
  },
}
