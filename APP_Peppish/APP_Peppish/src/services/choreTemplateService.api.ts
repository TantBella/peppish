import { apiClient } from "./apiClient";

export const choreTemplateServiceApi = {
  createTemplate: async (payload: {
    title: string;
    description?: string;
    rewardAmount?: number;
    rewardPoints?: number;
    recurrence?: string;
  }) => {
    const res = await apiClient.post("/chore-templates", payload);
    return res.data;
  },

  getTemplates: async () => {
    const res = await apiClient.get("/chore-templates");
    return res.data;
  },

  getTemplateById: async (id: string) => {
    const res = await apiClient.get("/chore-templates");
    const list = res.data;
    return list.find((t: any) => t.id === id) ?? null;
  },

  updateTemplate: async (id: string, payload: Partial<any>) => {
    const res = await apiClient.patch(`/chore-templates/${id}`, payload);
    return res.data;
  },
};
