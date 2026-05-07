import { Chore, ChoreStatus } from '../types'

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

  completeChore: async (id: string): Promise<Chore> => {
    return choreServiceLocal.updateChore(id, { status: "completed" as ChoreStatus });
  },

  approveChore: async (id: string): Promise<Chore> => {
    return choreServiceLocal.updateChore(id, { status: "approved" as ChoreStatus });
  },
};