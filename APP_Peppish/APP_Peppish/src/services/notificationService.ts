import { notificationServiceApi } from "./notificationService.api";

export const notificationService = import.meta.env.VITE_API_URL
  ? notificationServiceApi
  : null;
