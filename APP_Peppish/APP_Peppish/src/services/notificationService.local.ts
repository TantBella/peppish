export interface NotificationEntry {
  id: string
  userId: string
  message: string
  read?: boolean
  createdAt: string
}

const STORAGE_KEY = 'peppish_notifications'

const read = (): NotificationEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const write = (items: NotificationEntry[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const notificationServiceLocal = {
  getNotifications: async (userId: string): Promise<NotificationEntry[]> => {
    await new Promise((r) => setTimeout(r, 50))
    return read().filter((n) => n.userId === userId)
  },

  addNotification: async (userId: string, message: string): Promise<NotificationEntry> => {
    const items = read()
    const entry: NotificationEntry = { id: generateId(), userId, message, read: false, createdAt: new Date().toISOString() }
    write([entry, ...items])
    return entry
  },

  markRead: async (id: string): Promise<void> => {
    const items = read().map((n) => (n.id === id ? { ...n, read: true } : n))
    write(items)
  },
}
