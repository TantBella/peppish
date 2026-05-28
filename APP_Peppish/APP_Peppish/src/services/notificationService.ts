import { notificationServiceLocal } from './notificationService.local'

export const notificationService = {
  getNotifications: notificationServiceLocal.getNotifications,
  addNotification: notificationServiceLocal.addNotification,
  markRead: notificationServiceLocal.markRead,
}
