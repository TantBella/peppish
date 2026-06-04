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
  isExpanded,
  onToggle,
  compact = false,
}: ChoreCardProps) => {
  return (
    <div
      className={`chore-card status-${chore.uiStatus.toLowerCase()} ${isExpanded ? 'expanded' : ''}`}
      onClick={onToggle}
    >
      <div className="chore-header">
        <h3>{chore.title}</h3>
        <span className="status-badge">{chore.uiStatus}</span>
      </div>

      {!compact && (
        <div className="chore-meta">
          <div className="due-date">{new Date(chore.dueDate).toLocaleDateString()}</div>
          <span className="reward-badge">{chore.rewardAmount ? `🤑 ${chore.rewardAmount}` : ''}</span>
          {chore.assignedToUserName && <div className="assigned-to">{chore.assignedToUserName}</div>}
        </div>
      )}
    </div>
  )
}
