import { notificationServiceLocal } from './notificationService.local'
import { notificationServiceApi } from './notificationService.api'

export const notificationService = process.env.REACT_APP_API_URL ? notificationServiceApi : notificationServiceLocal
