import { apiClient } from "./apiClient";
import { User } from "../types";

export const userServiceApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get("/users/me");
    return res.data as User;
  },
  getAssignments: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/assignments`);
    return res.data;
  },
  getRewards: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/rewards`);
    return res.data;
  },
  getBalance: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/balance`);
    return res.data;
  },
  getProgress: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/progress`);
    return res.data;
  },
  getNotifications: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/notifications`);
    return res.data;
  },
};
