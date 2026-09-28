import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";

import { rewardService } from "../services/rewardService";

export const useUserBalance = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["balance", user?.id],
    enabled: !!user?.id && !!rewardService,
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Hittade inte någon inloggad användare");
      }

      return rewardService?.getUserBalance();
    },
  });
};

export const useRewardHistory = (limit?: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["rewards", user?.id, { limit }],
    enabled: !!user?.id && !!rewardService,
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Hittade inte någon inloggad användare");
      }

      return rewardService?.getRewardHistory(limit);
    },
  });
};
