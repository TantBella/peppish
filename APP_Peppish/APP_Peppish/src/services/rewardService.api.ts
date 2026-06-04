import { apiClient } from "./apiClient";

export interface Reward {
  id: string;
  userId: string;
  choreId: string;
  type: "money" | "progress";
  value: number;
  createdAt: string;
}

export interface UserBalance {
  userId: string;
  totalMoney: number;
  totalProgress: number;
}

export const rewardServiceApi = {
  getUserBalance: async (userId: string): Promise<UserBalance> => {
    const res = await apiClient.get(`/users/${userId}/balance`);
    return res.data as UserBalance;
  },

  getRewardHistory: async (
    userId: string,
    limit?: number,
  ): Promise<Reward[]> => {
    const res = await apiClient.get(`/users/${userId}/rewards`, {
      params: { limit },
    });
    return res.data as Reward[];
  },

  // addReward: async (
  //   userId: string,
  //   choreId: string,
  //   type: "money" | "progress",
  //   value: number,
  // ): Promise<Reward> => {
  //   const res = await apiClient.post(`/users/${userId}/rewards`, {
  //     choreId,
  //     type,
  //     value,
  //   });
  //   return res.data as Reward;
  // },
};
