import { ChoreWithUIStatus } from '../hooks/useChores'

interface ChoreCardProps {
  chore: ChoreWithUIStatus
  currentUserId?: string
  isExpanded: boolean
  onToggle: () => void
  compact?: boolean
}

export const ChoreCard = ({
  chore,
  currentUserId,
  isExpanded,
  onToggle,
  compact = false,
}: ChoreCardProps) => {
  return (
    <div
      className={`chore-card status-${chore.uiStatus.toLowerCase()} ${
        isExpanded ? 'expanded' : ''
      }`}
      onClick={onToggle}
    >
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="status-badge">{chore.uiStatus}</span>
      </div>

      {!compact && chore.description && (
        <p className="chore-description">{chore.description}</p>
      )}

      {!compact && (
        <div className="chore-meta">
          <span className="reward-badge">
            {chore.rewardType === 'money' ? '🤑' : '💎'} {chore.rewardValue || 0}
          </span>

          {chore.assignedTo && (
            <span className="assigned-badge">
              {chore.assignedTo === currentUserId
                ? 'Tilldelad'
                : 'Vald'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}