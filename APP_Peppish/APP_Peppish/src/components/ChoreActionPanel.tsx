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

export const ChoreActionPanel = ({ chore, onSuccess, allowAdminActions = true, allowPicking = true }: ChoreActionPanelProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [assignTo, setAssignTo] = useState<string | undefined>(chore.assignedTo)

  // load users for assign dropdown when needed
  useEffect(() => {
    if (!allowAdminActions) return
    import('../services/userService').then(({ userService }) => userService.getUsers().then((u) => setUsers(u)))
  }, [allowAdminActions])

  const completeMutation = useMutation({
    mutationFn: () => choreService.completeChore(chore.id, user?.id),
    onSuccess: (updatedChore) => {
      setError(null)
      queryClient.setQueryData(['chore', chore.id], updatedChore)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to complete chore')
    },
  })

  const approveMutation = useMutation({
    mutationFn: () => choreService.approveChore(chore.id, user?.role),
    onSuccess: (updatedChore) => {
      setError(null)
      queryClient.setQueryData(['chore', chore.id], updatedChore)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to approve chore')
    },
  })

  const navigate = useNavigate()
  const canComplete = chore.uiStatus === 'Pending' && chore.assignedTo === user?.id
  const canApprove = chore.uiStatus === 'Completed' && user?.role === 'adult'
  const canEditOrDelete = allowAdminActions && (user?.role === 'adult' || user?.id === chore.createdBy)
  const canPick = allowPicking && user?.role === 'child' && (chore.assignedTo === undefined || chore.assignedTo === null)
  // allow scheduling for both adults and children when picking/assigning
  const canSchedule = allowPicking && (user?.role === 'child' || user?.role === 'adult')

  const deleteMutation = useMutation({
    mutationFn: () => choreService.deleteChore(chore.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      navigate('/chores')
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete chore'),
  })

  const assignMutation = useMutation({
    mutationFn: () => choreService.assignChore(chore.id, assignTo || ''),
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to assign chore'),
  })

  const pickMutation = useMutation({
    mutationFn: () => choreService.assignChore(chore.id, user!.id),
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to pick chore'),
  })

  const pickAndComplete = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user')
      // assign first if needed
      if (!chore.assignedTo) {
        await choreService.assignChore(chore.id, user.id)
      }
      // then complete
      return choreService.completeChore(chore.id, user.id)
    },
    onSuccess: () => {
      setError(null)
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to pick and complete chore'),
  })

  // scheduling UI: when scheduling, open a date input and call scheduleChore
  const [scheduling, setScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<string>('')

  const scheduleMutation = useMutation({
    mutationFn: () => choreService.scheduleChore(chore.id, user!.id, scheduleDate),
    onSuccess: () => {
      setError(null)
      setScheduling(false)
      setScheduleDate('')
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      onSuccess?.()
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to schedule chore'),
  })

  return (
    <div className="chore-action-panel">
      {error && (
        <div className="error-message alert alert-error">
          {error}
        </div>
      )}

      <div className="action-buttons">
        {canComplete && (
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            className="btn-complete"
          >
            {completeMutation.isPending ? 'Completing...' : 'Complete'}
          </button>
        )}

        {canApprove && (
          <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
            className="btn-approve"
          >
            {approveMutation.isPending ? 'Approving...' : 'Approve'}
          </button>
        )}

        {chore.uiStatus === 'Approved' && (
          <div className="status-complete">
            ✓ Approved and Completed
          </div>
        )}

        {!canComplete && !canApprove && chore.uiStatus !== 'Approved' && (
          <div className="status-info">
            Awaiting {chore.uiStatus === 'Completed' ? 'adult approval' : 'assignment'}
          </div>
        )}

        {/* Assign / Pick actions */}
        {allowAdminActions && user?.role === 'adult' && (
          <div className="assign-section">
            <label>Assign to:</label>
            <select value={assignTo || ''} onChange={(e) => setAssignTo(e.target.value === '' ? undefined : e.target.value)}>
              <option value="">(Unassigned)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
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
            <button className="btn-edit" onClick={() => navigate(`/chores/${chore.id}/edit`)}>
              Edit
            </button>
            <button
              className="btn-delete"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this chore?')) {
                  deleteMutation.mutate()
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
