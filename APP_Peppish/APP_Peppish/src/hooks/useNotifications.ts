import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationServiceApi, NotificationEntry } from '../services/notificationService.api'

export const useNotifications = () => {
  const qc = useQueryClient()

  const query = useQuery<NotificationEntry[]>({
    queryKey: ['notifications'],
    queryFn: () => notificationServiceApi.getNotifications(),
  })

  const markRead = useMutation({
    mutationFn: (id: string) => notificationServiceApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => notificationServiceApi.deleteNotification(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  return {
    ...query,
    markRead,
    remove,
  }
}
