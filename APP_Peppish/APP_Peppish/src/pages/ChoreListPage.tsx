import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useChores } from '../hooks/useChores'
import { ChoreWithUIStatus } from '../hooks/useChores'
import { ChoreActionPanel } from '../components/ChoreActionPanel'

const getWeekDates = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))

  const weekDates: { [key: string]: Date } = {}
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(date.getDate() + i)
    const key = date.toISOString().split('T')[0]
    weekDates[days[i]] = date
  }

  return weekDates
}

interface ChoresByDay {
  [day: string]: ChoreWithUIStatus[]
}

export const ChoreListPage = () => {
  const { user } = useAuth()
  const { data: chores = [], isLoading, error } = useChores()
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null)

  const weekDates = useMemo(() => getWeekDates(), [])

  const choresByDay = useMemo(() => {
    const grouped: ChoresByDay = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    }

    chores.forEach((chore) => {
      const choreDate = new Date(chore.createdAt).toISOString().split('T')[0]
      Object.entries(weekDates).forEach(([day, dateObj]) => {
        const dayStr = dateObj.toISOString().split('T')[0]
        if (choreDate === dayStr) {
          grouped[day].push(chore)
        }
      })
    })

    return grouped
  }, [chores, weekDates])

  if (isLoading) {
    return <div className="loading-container"><div className="spinner">Loading chores...</div></div>
  }

  if (error) {
    return <div className="error-message alert alert-error">Failed to load chores</div>
  }

  return (
    <div className="chore-list-container">
      <h1>Weekly Chores</h1>
      <div className="week-view">
        {Object.entries(weekDates).map(([day, date]) => {
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          const dayChores = choresByDay[day]

          return (
            <div key={day} className="day-column">
              <div className="day-header">
                <div className="day-name">{day}</div>
                <div className="day-date">{dateStr}</div>
              </div>
              <div className="chores-list">
                {dayChores.length === 0 ? (
                  <p className="no-chores">No chores</p>
                ) : (
                  dayChores.map((chore) => (
                    <div key={chore.id}>
                      <ChoreCard
                        chore={chore}
                        currentUserId={user?.id}
                        isExpanded={expandedChoreId === chore.id}
                        onToggle={() =>
                          setExpandedChoreId(expandedChoreId === chore.id ? null : chore.id)
                        }
                      />
                      {expandedChoreId === chore.id && (
                        <ChoreActionPanel chore={chore} onSuccess={() => setExpandedChoreId(null)} />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChoreCardProps {
  chore: ChoreWithUIStatus
  currentUserId?: string
  isExpanded: boolean
  onToggle: () => void
}

const ChoreCard = ({ chore, currentUserId, isExpanded, onToggle }: ChoreCardProps) => {
  return (
    <div
      className={`chore-card status-${chore.uiStatus.toLowerCase()} ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="status-badge">{chore.uiStatus}</span>
      </div>
      {chore.description && <p className="chore-description">{chore.description}</p>}
      <div className="chore-meta">
        <span className="reward-badge">
          {chore.rewardType === 'money' ? '$' : '⭐'} {chore.rewardValue || 0}
        </span>
        {chore.assignedTo && (
          <span className="assigned-badge">
            {chore.assignedTo === currentUserId ? 'Assigned to you' : 'Assigned'}
          </span>
        )}
      </div>
    </div>
  )
}

