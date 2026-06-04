import { Chore, ChoreStatus } from '../types'

const STORAGE_KEY = 'peppish_chores'

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const read = (): Chore[] => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const write = (chores: Chore[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chores))
}

export const choreServiceLocal = {
  getChores: async (params?: { status?: ChoreStatus; assignedTo?: string }): Promise<Chore[]> => {
    let chores = read()

    if (params?.status) {
      chores = chores.filter((c) => c.status === params.status)
    }

    if (params?.assignedTo) {
      chores = chores.filter((c) => c.assignedToUserId === params.assignedTo)
    }

    return chores
  },

  getChoreById: async (id: string): Promise<Chore> => {
    const chore = read().find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')
    return chore
  },

  createChore: async (payload: Partial<Chore>): Promise<Chore> => {
    const chores = read()
    const newChore: Chore = {
      id: generateId(),
      title: payload.title || 'Untitled',
      dueDate: payload.dueDate || new Date().toISOString(),
      status: 'Pending',
      assignedToUserId: payload.assignedToUserId,
      assignedToUserName: payload.assignedToUserName,
      rewardAmount: payload.rewardAmount ?? 0,
    }
    write([newChore, ...chores])
    return newChore
  },

  updateChore: async (id: string, payload: Partial<Chore>): Promise<Chore> => {
    const chores = read()
    const updated = chores.map((c) => (c.id === id ? { ...c, ...payload } : c))
    write(updated)
    return updated.find((c) => c.id === id)!
  },

  deleteChore: async (id: string): Promise<{ success: boolean }> => {
    const chores = read().filter((c) => c.id !== id)
    write(chores)
    return { success: true }
  },

  completeChore: async (id: string, actorId?: string): Promise<{ id: string; status: string }> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.assignedToUserId && actorId && chore.assignedToUserId !== actorId) {
      throw new Error('Only the assigned user can complete this chore')
    }

    const updated = await choreServiceLocal.updateChore(id, { status: 'Completed' })

    try {
      const { notificationService } = await import('./notificationService')
      const users = JSON.parse(localStorage.getItem('peppish_users') || '[]')
      const householdId = users.find((u: any) => u.id === (chore.assignedToUserId || ''))?.householdId
      const adults = users.filter((u: any) => u.role === 'Adult' && u.householdId && u.householdId === householdId)
      adults.forEach((a: any) => {
        notificationService.addNotification(a.id, `User ${chore.assignedToUserId || 'Someone'} completed chore "${chore.title}" and requests approval`)
      })
    } catch (e) {
      // ignore
    }

    return { id: updated.id, status: updated.status }
  },

  approveChore: async (id: string, approverRole?: string): Promise<{ id: string; status: string }> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.status !== 'Completed') throw new Error('Only completed chores can be approved')
    if (approverRole !== 'Adult') throw new Error('Only adults can approve chores')

    const updated = await choreServiceLocal.updateChore(id, { status: 'Approved' })

    try {
      const { notificationService } = await import('./notificationService')
      if (chore.assignedToUserId) {
        notificationService.addNotification(chore.assignedToUserId, `Your chore "${chore.title}" was approved! You received your reward.`)
      }
    } catch (e) {
      // ignore
    }

    return { id: updated.id, status: updated.status }
  },

  assignChore: async (id: string, userId: string): Promise<any> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.status === 'Approved') throw new Error('Cannot assign an approved chore')

    // try to resolve username
    const users = JSON.parse(localStorage.getItem('peppish_users') || '[]')
    const assignedUser = users.find((u: any) => u.id === userId)
    const assignedToUserName = assignedUser ? assignedUser.name || assignedUser.email : undefined

    const updated = await choreServiceLocal.updateChore(id, { assignedToUserId: userId, assignedToUserName, status: 'Pending' })
    return updated
  },

  scheduleChore: async (templateId: string, userId: string, dateStr: string): Promise<any> => {
    const templates = JSON.parse(localStorage.getItem('peppish_chore_templates') || '[]')
    const template = templates.find((t: any) => t.id === templateId)
    if (!template) throw new Error('Template not found')

    const newChore: Chore = {
      id: generateId(),
      title: template.title,
      dueDate: new Date(dateStr).toISOString(),
      status: 'Pending',
      assignedToUserId: userId,
      assignedToUserName: undefined,
      rewardAmount: template.rewardAmount ?? 0,
    }

    const chores = read()
    write([newChore, ...chores])
    return newChore
  },
}
