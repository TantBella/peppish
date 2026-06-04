import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { choreService } from '../services/choreService'
import { ChoreWithUIStatus } from '../hooks/useChores'
import { useAuth } from '../context/AuthContext'

interface ChoreActionPanelProps {
  chore: ChoreWithUIStatus
  onSuccess?: () => void
  allowAdminActions?: boolean
  allowPicking?: boolean
}

export const ChoreActionPanel = ({
  chore,
  onSuccess,
  allowAdminActions = true,
  allowPicking = true,
}: ChoreActionPanelProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [assignTo, setAssignTo] = useState<string | undefined>(chore.assignedToUserId)

  useEffect(() => {
    if (!allowAdminActions) return
    import('../services/userService').then(({ userService }) => userService.getUsers().then((u) => setUsers(u)))
  }, [allowAdminActions])

  const completeMutation = useMutation({
    mutationFn: () => choreService.completeChore(chore.id, user?.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => {
        if (!old) return old
        return old.map((c) => (c.id === chore.id ? { ...c, status: 'Completed' } : c))
      })
      return { previous }
    },
    onSuccess: (updated) => {
      setError(null)
      queryClient.setQueryData(['chore', chore.id], updated)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _variables, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to complete chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const approveMutation = useMutation({
    mutationFn: () => choreService.approveChore(chore.id, user?.role),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => {
        if (!old) return old
        return old.map((c) => (c.id === chore.id ? { ...c, status: 'Approved' } : c))
      })
      return { previous }
    },
    onSuccess: (updated) => {
      setError(null)
      queryClient.setQueryData(['chore', chore.id], updated)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to approve chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const navigate = useNavigate()
  const canComplete = chore.uiStatus === 'Pending' && chore.assignedToUserId === user?.id
  const canApprove = chore.uiStatus === 'Completed' && user?.role === 'Adult'
  const canEditOrDelete = allowAdminActions && user?.role === 'Adult'
  const canPick = allowPicking && user?.role === 'Child' && !chore.assignedToUserId

  const canSchedule = allowPicking && (user?.role === 'Child' || user?.role === 'Adult')

  const deleteMutation = useMutation({
    mutationFn: () => choreService.deleteChore(chore.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => (old ? old.filter((c) => c.id !== chore.id) : old))
      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      navigate('/chores')
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to delete chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const assignMutation = useMutation({
    mutationFn: () => choreService.assignChore(chore.id, assignTo || ''),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => {
        if (!old) return old
        return old.map((c) => (c.id === chore.id ? { ...c, assignedToUserId: assignTo || '', status: 'Pending' } : c))
      })
      return { previous }
    },
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to assign chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const pickMutation = useMutation({
    mutationFn: () => choreService.assignChore(chore.id, user!.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => {
        if (!old) return old
        return old.map((c) => (c.id === chore.id ? { ...c, assignedToUserId: user!.id, status: 'Pending' } : c))
      })
      return { previous }
    },
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to pick chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const pickAndComplete = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user')
      if (!chore.assignedToUserId) await choreService.assignChore(chore.id, user.id)
      return choreService.completeChore(chore.id, user.id)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => {
        if (!old) return old
        return old.map((c) => (c.id === chore.id ? { ...c, assignedToUserId: user!.id, status: 'Completed' } : c))
      })
      return { previous }
    },
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to pick and complete chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  const [scheduling, setScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>('')

  const scheduleMutation = useMutation({
    mutationFn: () => choreService.scheduleChore(chore.id, user!.id, scheduleDate),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['chores'] })
      const previous = queryClient.getQueryData<any[]>(['chores'])

      const newChore = {
        ...(chore as any),
        id: `sched-${Date.now()}`,
        assignedToUserId: user!.id,
        assignedToUserName: user!.name || undefined,
        dueDate: scheduleDate,
        status: 'Pending',
      }
      queryClient.setQueryData(['chores'], (old: any[] | undefined) => (old ? [newChore, ...old] : [newChore]))
      return { previous }
    },
    onSuccess: () => {
      setError(null)
      setScheduling(false)
      setScheduleDate('')
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err, _vars, context: any) => {
      if (context?.previous) queryClient.setQueryData(['chores'], context.previous)
      setError(err instanceof Error ? err.message : 'Failed to schedule chore')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['chores'] }),
  })

  return (
    <div className="chore-action-panel">
      {error && <div className="error-message alert alert-error">{error}</div>}

      <div className="action-buttons">
        {canComplete && (
          <button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending} className="btn-complete">
            {completeMutation.isPending ? 'Completing...' : 'Complete'}
          </button>
        )}

        {canApprove && (
          <button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending} className="btn-approve">
            {approveMutation.isPending ? 'Approving...' : 'Approve'}
          </button>
        )}

        {chore.uiStatus === 'Approved' && <div className="status-complete">✓ Approved and Completed</div>}

        {!canComplete && !canApprove && chore.uiStatus !== 'Approved' && (
          <div className="status-info">Awaiting {chore.uiStatus === 'Completed' ? 'adult approval' : 'assignment'}</div>
        )}

        {/* Assign / Pick actions */}
        {allowAdminActions && user?.role === 'Adult' && (
          <div className="assign-section">
            <label>Assign to:</label>
            <select value={assignTo || ''} onChange={(e) => setAssignTo(e.target.value === '' ? undefined : e.target.value)}>
              <option value="">(Unassigned)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
            <button onClick={() => assignMutation.mutate()} className="btn-assign" disabled={assignMutation.isPending || !assignTo}>
              {assignMutation.isPending ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        )}

        {canPick && (
          <div className="pick-section">
            <button className="btn-pick" onClick={() => pickMutation.mutate()} disabled={pickMutation.isPending}>
              {pickMutation.isPending ? 'Picking...' : 'Pick this chore'}
            </button>
            <button className="btn-pick-complete" onClick={() => pickAndComplete.mutate()} disabled={pickAndComplete.isPending}>
              {pickAndComplete.isPending ? 'Working...' : 'Pick & Mark Completed'}
            </button>
            <button className="btn-schedule" onClick={() => setScheduling(true)}>Pick for a date</button>
          </div>
        )}

        {canSchedule && scheduling && (
          <div className="schedule-section">
            <label>Choose date:</label>
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            <button onClick={() => scheduleMutation.mutate()} disabled={scheduleMutation.isPending || !scheduleDate}>Schedule</button>
            <button onClick={() => { setScheduling(false); setScheduleDate('') }}>Cancel</button>
          </div>
        )}

        {/* Edit / Delete actions for creators and adults */}
        {canEditOrDelete && (
          <div className="admin-actions">
            <button className="btn-edit" onClick={() => navigate(`/chores/${chore.id}/edit`)}>Edit</button>
            <button className="btn-delete" onClick={() => { if (window.confirm('Are you sure you want to delete this chore?')) { deleteMutation.mutate(); } }} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
