import { apiClient } from "./apiClient";

export interface UserProgress {
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  dailyProgressPercent: number;
}

export const progressServiceApi = {
  getProgress: async (): Promise<UserProgress> => {
    const res = await apiClient.get("/progress");
    return res.data;
  },
};
