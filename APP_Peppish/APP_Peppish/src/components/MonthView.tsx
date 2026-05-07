import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"
import { ChoreCardWrapper } from "./ChoreCardWrapper"

type Props = {
  chores: ChoreWithUIStatus[]
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const MonthView = ({
  chores,
  userId,
  expandedChoreId,
  setExpandedChoreId,
}: Props) => {
  const now = new Date()

  const monthDays = useMemo(() => {
    const grouped: Record<string, ChoreWithUIStatus[]> = {}

    chores.forEach((chore) => {
      const date = new Date(chore.createdAt)

      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        const key = date.toDateString()

        if (!grouped[key]) grouped[key] = []
        grouped[key].push(chore)
      }
    })

    return grouped
  }, [chores])

  const sortedDays = Object.keys(monthDays).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="single-list">
      {sortedDays.length === 0 ? (
        <p className="no-chores">No chores this month</p>
      ) : (
        sortedDays.map((day) => (
          <div key={day}>
            <div className="day-header">
              {new Date(day).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>

            {monthDays[day].map((chore) => (
              <ChoreCardWrapper
                key={chore.id}
                chore={chore}
                userId={userId}
                expandedChoreId={expandedChoreId}
                setExpandedChoreId={setExpandedChoreId}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )
}