import { apiClient } from "./apiClient";

export interface Reward {
  id?: string;
  userId?: string;
  choreId?: string;
  type?: "money" | "progress";
  value?: number;
  createdAt?: string;
  moneyAmount?: number;
  xpAmount?: number;
  reason?: string;
}

export interface UserBalance {
  userId: string;
  totalMoney: number;
  totalProgress: number;
  moneyBalance?: number;
  totalXp?: number;
  level?: number;
}

export const normalizeBalanceResponse = (
  data: Partial<UserBalance> & {
    moneyBalance?: number;
    totalXp?: number;
    level?: number;
  },
): UserBalance => {
  const totalMoney = Number(data.totalMoney ?? data.moneyBalance ?? 0);
  const totalProgress = Number(data.totalProgress ?? data.totalXp ?? 0);

  return {
    userId: data.userId ?? "",
    totalMoney,
    totalProgress,
    moneyBalance: Number(data.moneyBalance ?? totalMoney),
    totalXp: Number(data.totalXp ?? totalProgress),
    level: Number(data.level ?? 0),
  };
};

export const rewardServiceApi = {
  getUserBalance: async (userId: string): Promise<UserBalance> => {
    const res = await apiClient.get(`/users/${userId}/balance`);
    return normalizeBalanceResponse(res.data as Partial<UserBalance>);
  },

  getRewardHistory: async (
    userId: string,
    limit?: number,
  ): Promise<Reward[]> => {
    const res = await apiClient.get(`/users/${userId}/rewards`, {
      params: { limit },
    });

    const rawRewards = (res.data ?? []) as Reward[];

    return rawRewards.map((reward, index) => {
      const moneyAmount = Number(reward.moneyAmount ?? 0);
      const xpAmount = Number(reward.xpAmount ?? 0);
      const value = moneyAmount > 0 ? moneyAmount : xpAmount;
      const type = moneyAmount > 0 ? "money" : "progress";

      return {
        ...reward,
        id: reward.id ?? `${reward.createdAt ?? "reward"}-${index}`,
        userId: reward.userId ?? userId,
        choreId: reward.choreId ?? "",
        type,
        value,
        createdAt: reward.createdAt ?? new Date().toISOString(),
        moneyAmount,
        xpAmount,
      };
    });
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
