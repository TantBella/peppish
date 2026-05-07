import { ChoreWithUIStatus } from '../hooks/useChores'
import { ChoreCard } from './ChoreCard'
import { ChoreActionPanel } from './ChoreActionPanel'

interface Props {
  chore: ChoreWithUIStatus
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const ChoreCardWrapper = ({
  chore,
  userId,
  expandedChoreId,
  setExpandedChoreId,
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
      />

      {isExpanded && (
        <ChoreActionPanel
          chore={chore}
          onSuccess={() => setExpandedChoreId(null)}
        />
      )}
    </div>
  )
}
