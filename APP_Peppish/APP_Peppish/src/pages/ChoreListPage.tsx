import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChores, ChoreWithUIStatus } from '../hooks/useChores'
import { ChoreCard } from '../components/ChoreCard'
import { ChoreActionPanel } from '../components/ChoreActionPanel'
import { useAuth } from '../context/AuthContext'
import ChoreSkeleton from '../components/ChoreSkeleton'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { choreTemplateService } from '../services/choreTemplateService'

export const ChoreListPage = () => {
  const { data: chores = [], isLoading, error } = useChores()
  const { user } = useAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: templates = [] } = useQuery({ queryKey: ['chore-templates'], queryFn: () => choreTemplateService.getTemplates() })

  if (isLoading) {
    return (
      <div className="chore-list-page">
        <div className="chore-list-header">
          <h1>Dina quests</h1>
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <ChoreSkeleton />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <div>Failed to load chores</div>
        <button className="btn-primary" onClick={() => queryClient.invalidateQueries({ queryKey: ['chores'] })}>Retry</button>
      </div>
    )
  }

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id))

  const templateChores = templates

  return (
    <div className="chore-list-page">
      <div className="chore-list-header">
        <h1>Dina quests</h1>
        <Link to="/chores/new" className="btn-primary btn-small">Skapa uppgift</Link>
      </div>

      {templateChores.length === 0 ? (
        <div className="empty">Inga quests ännu. Lägg till en uppgift för att komma igång.</div>
      ) : (
        <div className="chore-list">
          {templateChores.map((tpl: any) => (
            <div key={tpl.id} className="chore-item">
              <ChoreCard
                chore={{ ...tpl, dueDate: new Date().toISOString(), uiStatus: 'Pending' } as ChoreWithUIStatus}
                currentUserId={user?.id}
                isExpanded={expandedId === tpl.id}
                onToggle={() => toggle(tpl.id)}
                compact={false}
              />

              {expandedId === tpl.id && (
                <div className="chore-expanded">
                  <ChoreActionPanel chore={{ ...tpl, dueDate: new Date().toISOString(), uiStatus: 'Pending' } as ChoreWithUIStatus} onSuccess={() => setExpandedId(null)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
