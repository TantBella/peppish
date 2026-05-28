import { useMemo } from "react"
import { ChoreWithUIStatus } from "../hooks/useChores"
import { ViewMode } from "../hooks/useChoreCalendar"

type Props = {
  chores: ChoreWithUIStatus[]
  setSelectedDate: (date: Date | null) => void
  userId?: string
  setViewMode: (mode: ViewMode) => void
  setWeekOffset: (value: number) => void
    expandedChoreId: string | null
  setExpandedChoreId: (id: string | null) => void
}

export const MonthView = ({
  chores,
  setSelectedDate,
  setViewMode,
  // setWeekOffset,
}: Props) => {
const now = useMemo(() => new Date(), [])

  const weekdays = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"]

  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  const startDay = (firstDayOfMonth.getDay() + 6) % 7

  const totalCells = startDay + daysInMonth

  const monthMap = useMemo(() => {
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
  }, [chores, now])

  const today = new Date().toDateString()

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
    setViewMode("day")
  }

  // const handleWeekSelect = (day: Date) => {
  //   const diff = Math.round(
  //     (day.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000)
  //   )

  //   setWeekOffset(diff)
  //   setViewMode("week")
  // }

  return (
    <>
    <div>
      <h2 className="month-title">
  {now.toLocaleDateString("sv-SE", {
    month: "long",
    year: "numeric",
  })}
</h2>
    </div>
      <div className="month-weekdays">
        {weekdays.map((d) => (
          <div key={d} className="weekday-cell">
            {d}
          </div>
        ))}
      </div>

      <div className="month-grid">
        {Array.from({ length: totalCells }, (_, i) => {
          const dayNumber = i - startDay + 1

          if (dayNumber < 1 || dayNumber > daysInMonth) {
            return <div key={i} />
          }

          const date = new Date(
            now.getFullYear(),
            now.getMonth(),
            dayNumber
          )

          const key = date.toDateString()
          const hasChores = !!monthMap[key]?.length
          const isToday = key === today
return (
  <div key={key} className={`month-day ${isToday ? "today" : ""}`}>
    <div
      className="day-circle"
      onClick={() => handleDayClick(date)}
    >
      {dayNumber}
    </div>

    {hasChores && <div className="indicator-dot" />}
  </div>
)
        })}
      </div>
    </>
  )
}
