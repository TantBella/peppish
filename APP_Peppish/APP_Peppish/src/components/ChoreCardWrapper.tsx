import { ChoreWithUIStatus } from '../hooks/useChores'
import { ChoreCard } from './ChoreCard'
import { ChoreActionPanel } from './ChoreActionPanel'

interface Props {
  chore: ChoreWithUIStatus
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
  inlineActions?: boolean
  compact?: boolean
}

export const ChoreCardWrapper = ({
  chore,
  userId,
  expandedChoreId,
  setExpandedChoreId,
  inlineActions = true,
  compact = false,
}: Props) => {
  const isExpanded = expandedChoreId === chore.id

  const toggle = () => {
    setExpandedChoreId(isExpanded ? null : chore.id)
  }

  return (
    <div>
      <ChoreCard
        chore={chore}
        currentUserId={userId}
        isExpanded={isExpanded}
        onToggle={toggle}
        compact={compact}
      />

      {isExpanded && inlineActions && (
        <ChoreActionPanel
          chore={chore}
          onSuccess={() => setExpandedChoreId(null)}
        />
      )}
    </div>
  )
}
