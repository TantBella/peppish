import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { choreService } from '../services/choreService'
import { useAuth } from '../context/AuthContext'
import { ChoreType, RewardType } from '../types'

export const CreateChorePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ChoreType>('daily')
  const [rewardType, setRewardType] = useState<RewardType>('money')
  const [rewardValue, setRewardValue] = useState<number | ''>('')
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined)
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // load users
  useEffect(() => {
    import('../services/userService').then(({ userService }) => {
      userService.getUsers().then((u) => {
        setUsers(u)
      })
    })
  }, [])

  const mutation = useMutation({
    mutationFn: () =>
      choreService.createChore({
        title,
        description,
        type,
        rewardType,
        rewardValue: rewardValue === '' ? undefined : Number(rewardValue),
        assignedTo: assignedTo,
        createdBy: user?.id || 'unknown',
      } as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chores'] })
      navigate('/chores')
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create chore')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate()
  }

  return (
    <div className="create-chore-page">
      <h1>Skapa uppgift</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titel</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Beskrivning</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
            <label htmlFor="assignedTo">Tilldelad till</label>
            <select id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value === '' ? undefined : e.target.value)}>
              <option value="">(Ingen)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name || u.email}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rewardValue">Value</label>
            <input
              id="rewardValue"
              type="number"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Skapar...' : 'Skapa uppgift'}
          </button>
        </div>
      </form>
    </div>
  )
}
