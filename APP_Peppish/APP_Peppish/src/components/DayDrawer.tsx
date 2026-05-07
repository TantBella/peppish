import { ChoreWithUIStatus } from "../hooks/useChores"
import { ChoreCardWrapper } from "./ChoreCardWrapper"

type DayDrawerProps = {
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  chores: ChoreWithUIStatus[]
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const DayDrawer = ({
  selectedDate,
  setSelectedDate,
  chores,
  userId,
  expandedChoreId,
  setExpandedChoreId,
}: DayDrawerProps) => {
  if (!selectedDate) return null

  const dayChores = chores.filter(
    (c) => new Date(c.createdAt).toDateString() === selectedDate.toDateString()
  )

  return (
    <div className="day-drawer-backdrop" onClick={() => setSelectedDate(null)}>
      <div className="day-drawer" onClick={(e) => e.stopPropagation()}>
        <h3>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </h3>

        {dayChores.map((chore) => (
          <ChoreCardWrapper
            key={chore.id}
            chore={chore}
            userId={userId}
            expandedChoreId={expandedChoreId}
            setExpandedChoreId={setExpandedChoreId}
          />
        ))}
      </div>
    </div>
  )
}