import { apiClient } from "./apiClient";

export const choreAssignmentServiceApi = {
  assignChore: async (payload: {
    choreTemplateId: string;
    assignedToUserId: string;
    startDate: string;
  }) => {
    const res = await apiClient.post("/chore-assignments", payload);
    return res.data;
  },
};
