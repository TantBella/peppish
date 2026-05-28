import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { choreService } from '../services/choreService'
import { useAuth } from '../context/AuthContext'
import { useChore } from '../hooks/useChores'
import { ChoreType, RewardType, Chore } from '../types'

export const EditChorePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: chore, isLoading, error } = useChore(id || '')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ChoreType>('daily')
  const [rewardType, setRewardType] = useState<RewardType>('money')
  const [rewardValue, setRewardValue] = useState<number | ''>('')
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (chore) {
      setTitle(chore.title || '')
      setDescription(chore.description || '')
      setType(chore.type)
      setRewardType(chore.rewardType)
      setRewardValue(chore.rewardValue ?? '')
      setAssignedTo(chore.assignedTo)
    }
  }, [chore])

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<Chore>) => {
      if (!id) throw new Error('Missing id')
      return choreService.updateChore(id, payload)
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      queryClient.setQueryData(['chore', id], updated)
      navigate('/chores')
    },
    onError: (err) => {
      setFormError(err instanceof Error ? err.message : 'Failed to update chore')
    },
  })

  if (isLoading) return <div>Loading chore...</div>
  if (error) return <div className="error-message">Failed to load chore</div>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // permission check
    if (chore && chore.createdBy !== user?.id && user?.role !== 'adult') {
      setFormError('You do not have permission to edit this chore')
      return
    }

    updateMutation.mutate({
      title,
      description,
      type,
      rewardType,
      rewardValue: rewardValue === '' ? undefined : Number(rewardValue),
      assignedTo,
    })
  }

  return (
    <div className="edit-chore-page">
      <h1>Ändra uppgift</h1>

      {formError && <div className="error-message">{formError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titel</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Beskrivning</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type">Typ</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as ChoreType)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="irregular">Irregular</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rewardType">Reward</label>
            <select id="rewardType" value={rewardType} onChange={(e) => setRewardType(e.target.value as RewardType)}>
              <option value="money">Money</option>
              <option value="progress">Progress</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rewardValue">Value</label>
            <input id="rewardValue" type="number" value={rewardValue} onChange={(e) => setRewardValue(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            {updateMutation.isPending ? 'Sparar...' : 'Spara ändringar'}
          </button>
        </div>
      </form>
    </div>
  )
}
