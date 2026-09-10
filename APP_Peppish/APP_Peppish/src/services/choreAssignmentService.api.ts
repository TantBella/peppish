import { apiClient } from "./apiClient";

export const choreAssignmentServiceApi = {
  assignChore: async (payload: {
    choreTemplateId: string;
    assignedToUserId?: string | null;
    startDate?: string | null;
    dueDate?: string | null;
  }) => {
    const res = await apiClient.post("/chore-assignments", {
      choreTemplateId: payload.choreTemplateId,
      assignedToUserId: payload.assignedToUserId || null,
      startDate: payload.startDate || null,
      dueDate: payload.dueDate || null,
    });

    return res.data;
  },
};
