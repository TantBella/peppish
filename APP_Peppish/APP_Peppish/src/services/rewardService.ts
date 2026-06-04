import { rewardServiceApi, Reward, UserBalance } from "./rewardService.api";

export type { Reward, UserBalance };

export const rewardService = import.meta.env.VITE_API_URL
  ? rewardServiceApi
  : null;
