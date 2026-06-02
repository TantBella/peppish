import { apiClient } from "./apiClient";

export interface NotificationEntry {
  id: string;
  userId: string;
  type: string;
  payload: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export const notificationServiceApi = {
  getNotifications: async (): Promise<NotificationEntry[]> => {
    const res = await apiClient.get("/notifications");
    return res.data as NotificationEntry[];
  },

  addNotification: async (...args: any[]): Promise<NotificationEntry> => {
    let body: any;
    if (
      args.length === 2 &&
      typeof args[0] === "string" &&
      typeof args[1] === "string"
    ) {
      body = { userId: args[0], type: "generic", payload: args[1] };
    } else {
      body = args[0];
    }
    const res = await apiClient.post("/notifications", body);
    return res.data as NotificationEntry;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};
