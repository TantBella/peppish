import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChores, ChoreWithUIStatus } from '../hooks/useChores'
import { ChoreCard } from '../components/ChoreCard'
import { ChoreActionPanel } from '../components/ChoreActionPanel'
import { useAuth } from '../context/AuthContext'

export const ChoreListPage = () => {
  const { data: chores = [], isLoading, error } = useChores()
  const { user } = useAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) return <div>Loading chores...</div>
  if (error) return <div className="error-message">Failed to load chores</div>

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <div className="chore-list-page">
      <div className="chore-list-header">
        <h1>Dina quests</h1>
        <Link to="/chores/new" className="btn-primary btn-small">Skapa uppgift</Link>
      </div>

      {chores.length === 0 ? (
        <div className="empty">Inga quests ännu. Lägg till en uppgift för att komma igång.</div>
      ) : (
        <div className="chore-list">
          {chores.map((chore: ChoreWithUIStatus) => (
            <div key={chore.id} className="chore-item">
              <ChoreCard
                chore={chore}
                currentUserId={user?.id}
                isExpanded={expandedId === chore.id}
                onToggle={() => toggle(chore.id)}
                compact={false}
              />

              {expandedId === chore.id && (
                <div className="chore-expanded">
                  <ChoreActionPanel
                    chore={chore}
                    onSuccess={() => setExpandedId(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
