import { apiClient } from "./apiClient";

export const choreTemplateApi = {
  getAll: async () => {
    const res = await apiClient.get("/chore-templates");
    return res.data;
  },
  create: async (payload: {
    title: string;
    description?: string;
    rewardAmount: number;
    rewardPoints: number;
    recurrence: string;
  }) => {
    const res = await apiClient.post("/chore-templates", payload);
    return res.data;
  },
};

export const choreAssignmentApi = {
  assign: async (payload: {
    choreTemplateId: string;
    assignedToUserId: string;
    startDate: string;
  }) => {
    const res = await apiClient.post("/chore-assignments", payload);
    return res.data;
  },
};

export const choreInstanceApi = {
  getAll: async (params?: { from?: string; to?: string }) => {
    const res = await apiClient.get("/chores", { params });
    return res.data;
  },
  complete: async (id: string) => {
    const res = await apiClient.post(`/chores/${id}/complete`);
    return res.data;
  },
  approve: async (id: string) => {
    const res = await apiClient.post(`/chores/${id}/approve`);
    return res.data;
  },
};
