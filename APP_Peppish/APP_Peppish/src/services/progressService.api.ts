import { apiClient } from "./apiClient";

export interface UserProgress {
  currentLevel: number;
  currentXp: number;
  dailyProgressPercent: number;
}

export const progressServiceApi = {
  getProgress: async (userId: string): Promise<UserProgress> => {
    const res = await apiClient.get(`/users/${userId}/progress`);
    return res.data;
  },
};
