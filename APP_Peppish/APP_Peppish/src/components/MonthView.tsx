import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"

type Props = {
  chores: ChoreWithUIStatus[]
  userId?: string
  expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const MonthView = ({
  chores,
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

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate()

  const today = new Date().toDateString()

  return (
    <div className="calendar-grid">
      {Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth(),
          i + 1
        )

        const key = date.toDateString()

        const dayChores = monthDays[key] || []

        const isToday = key === today

        return (
          <div
            key={key}
            className={`calendar-cell ${isToday ? "today" : ""}`}
          >
            <div className="calendar-cell-header">
              <span>
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>

              <span>{date.getDate()}</span>
            </div>

            <div className="calendar-chores">
              {dayChores.length === 0 ? (
                <div className="calendar-empty">
                  Inga quests här
                </div>
              ) : (
                dayChores.slice(0, 3).map((chore) => (
                  <div
                    key={chore.id}
                    className="calendar-chore"
                  >
                    {chore.title}
                  </div>
                ))
              )}

              {dayChores.length > 3 && (
                <div className="more-indicator">
                  +{dayChores.length - 3} more
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}