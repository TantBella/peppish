import { apiClient } from "./apiClient";

export interface HouseholdJoinRequest {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: string;
  householdId: string;
  createdAt: string;
  status: string;
}

export const householdJoinRequestServiceApi = {
  getPendingRequests: async (): Promise<HouseholdJoinRequest[]> => {
    const res = await apiClient.get("/households/join-requests");
    return res.data as HouseholdJoinRequest[];
  },

  approveRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/households/join-requests/${requestId}/approve`);
  },

  rejectRequest: async (requestId: string): Promise<void> => {
    await apiClient.post(`/households/join-requests/${requestId}/reject`);
  },

  createJoinCode: async (): Promise<{ code: string; expiresAt: string }> => {
    const res = await apiClient.post("/JoinCode");
    return res.data;
  },
};
