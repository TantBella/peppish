import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { choreTemplateService } from '../services/choreTemplateService'
import { useAuth } from '../context/AuthContext'

export const CreateChorePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rewardAmount, setRewardAmount] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      choreTemplateService.createTemplate({
        title,
        description,
        rewardAmount: rewardAmount === '' ? 0 : Number(rewardAmount),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chore-templates'] })
      navigate('/chores')
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create template')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate()
  }

  return (
    <div className="create-chore-page">
      <h1>Skapa uppgiftsmall</h1>

      {error && <div className="error-message">{error}</div>}

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
            <label htmlFor="rewardAmount">Reward amount</label>
            <input id="rewardAmount" type="number" value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={mutation.isPending} className="btn-primary">{mutation.isPending ? 'Skapar...' : 'Skapa mall'}</button>
        </div>
      </form>
    </div>
  )
}
