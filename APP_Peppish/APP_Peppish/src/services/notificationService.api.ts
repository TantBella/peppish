import { apiClient } from './apiClient'

export interface NotificationEntry {
  id: string
  userId: string
  message: string
  read?: boolean
  createdAt: string
}

export const notificationServiceApi = {
  getNotifications: async (userId: string): Promise<NotificationEntry[]> => {
    const res = await apiClient.get('/notifications', { params: { userId } })
    return res.data as NotificationEntry[]
  },

  addNotification: async (userId: string, message: string): Promise<NotificationEntry> => {
    const res = await apiClient.post('/notifications', { userId, message })
    return res.data as NotificationEntry
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}`, { read: true })
  },
}
