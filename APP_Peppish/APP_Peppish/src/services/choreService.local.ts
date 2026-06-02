import { Chore, ChoreStatus } from '../types'
import { canTransition } from '../types/choreTransitions'

const STORAGE_KEY = "peppish_chores";

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const read = (): Chore[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const write = (chores: Chore[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chores));
};

export const choreServiceLocal = {
  getChores: async (params?: { status?: ChoreStatus; assignedTo?: string }): Promise<Chore[]> => {
    let chores = read();

    if (params?.status) {
      chores = chores.filter(c => c.status === params.status);
    }

    if (params?.assignedTo) {
      chores = chores.filter(c => c.assignedTo === params.assignedTo);
    }

    return chores;
  },

  getChoreById: async (id: string): Promise<Chore> => {
    const chore = read().find(c => c.id === id);
    if (!chore) throw new Error("Chore not found");
    return chore;
  },

  createChore: async (payload: Chore): Promise<Chore> => {
    const chores = read();

    const newChore: Chore = {
      ...payload,
      id: generateId(),
      status: "available" as ChoreStatus,
    };

    write([...chores, newChore]);
    return newChore;
  },

  updateChore: async (id: string, payload: Partial<Chore>): Promise<Chore> => {
    const chores = read();

    const updated = chores.map(c =>
      c.id === id ? { ...c, ...payload } : c
    );

    write(updated);

    return updated.find(c => c.id === id)!;
  },

  deleteChore: async (id: string): Promise<{ success: boolean }> => {
    const chores = read().filter(c => c.id !== id);
    write(chores);
    return { success: true };
  },

  completeChore: async (id: string, actorId?: string): Promise<Chore> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.assignedTo && actorId && chore.assignedTo !== actorId) {
      throw new Error('Only the assigned user can complete this chore')
    }

    if (!choreServiceLocal.updateChore) {
      throw new Error('Update function missing')
    }

    if (!('status' in chore)) {
      throw new Error('Invalid chore status')
    }

    // const { canTransition } = require('../types') as any
    if (!canTransition(chore.status, 'completed')) {
      throw new Error(`Cannot transition from ${chore.status} to completed`)
    }

    const updated = await choreServiceLocal.updateChore(id, { status: 'completed' as ChoreStatus })

    try {
      const { notificationService } = await import('./notificationService')
      const users = JSON.parse(localStorage.getItem('peppish_users') || '[]')
      let householdId: string | undefined | null = null
      if (updated.assignedTo) {
        const assignedUser = users.find((u: any) => u.id === updated.assignedTo)
        householdId = assignedUser?.householdId
      }
      if (!householdId) {
        const creator = users.find((u: any) => u.id === updated.createdBy)
        householdId = creator?.householdId
      }

      const adults = users.filter((u: any) => u.role === 'adult' && u.householdId && u.householdId === householdId)
      adults.forEach((a: any) => {
        notificationService.addNotification(a.id, `User ${updated.assignedTo || 'Someone'} completed chore "${updated.title}" and requests approval`)
      })
    } catch (e) {
      // ignore notification failures
    }

    return updated
  },

  approveChore: async (id: string, approverRole?: string): Promise<Chore> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.status !== 'completed') {
      throw new Error('Only completed chores can be approved')
    }

    if (approverRole !== 'adult') {
      throw new Error('Only adults can approve chores')
    }

    const updated = await choreServiceLocal.updateChore(id, { status: 'approved' as ChoreStatus })

    try {
      const { notificationService } = await import('./notificationService')
      const users = JSON.parse(localStorage.getItem('peppish_users') || '[]')
      const choresNow = read()
      const choreNow = choresNow.find((c) => c.id === id)
      if (choreNow && choreNow.assignedTo) {
        const assignedUser = users.find((u: any) => u.id === choreNow.assignedTo)

        if (assignedUser) {
          notificationService.addNotification(choreNow.assignedTo, `Your chore "${choreNow.title}" was approved! You received your reward.`)
        }
      }
    } catch (e) {
      // ignore
    }

    return updated
  },

  assignChore: async (id: string, userId: string): Promise<Chore> => {
    const chores = read()
    const chore = chores.find((c) => c.id === id)
    if (!chore) throw new Error('Chore not found')

    if (chore.status === 'approved') {
      throw new Error('Cannot assign an approved chore')
    }

    return choreServiceLocal.updateChore(id, { assignedTo: userId, status: 'assigned' as ChoreStatus })
  },

  scheduleChore: async (templateId: string, userId: string, dateStr: string): Promise<Chore> => {
    const chores = read()
    const template = chores.find((c) => c.id === templateId)
    if (!template) throw new Error('Template chore not found')

    const newChore: Chore = {
      ...template,
      id: generateId(),
      originId: templateId,
      assignedTo: userId,
      status: 'assigned' as ChoreStatus,
      createdAt: new Date(dateStr).toISOString(),
      updatedAt: new Date().toISOString(),
    }

    write([...chores, newChore])
    return newChore
  },
};
