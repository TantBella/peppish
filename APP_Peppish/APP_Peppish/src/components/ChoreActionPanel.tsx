import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { choreService } from '../services/choreService'
import { ChoreWithUIStatus } from '../hooks/useChores'
import { useAuth } from '../context/AuthContext'

interface ChoreActionPanelProps {
  chore: ChoreWithUIStatus
  onSuccess?: () => void
}

export const ChoreActionPanel = ({ chore, onSuccess }: ChoreActionPanelProps) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)

  const completeMutation = useMutation({
    mutationFn: () => choreService.completeChore(chore.id),
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
    mutationFn: () => choreService.approveChore(chore.id),
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

  const canComplete = chore.uiStatus === 'Pending' && chore.assignedTo === user?.id
  const canApprove = chore.uiStatus === 'Completed' && user?.role === 'adult'

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
      </div>
    </div>
  )
}
