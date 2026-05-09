import {  useRef } from "react"
import { WeekCalendarProps } from "../types/WeekCalendarProps"

export const WeekCalendarGrid = ({
  weekDates,
  choresByDay,
  expandedChoreId,
  setExpandedChoreId,
  setSelectedDate,
  setWeekOffset,
}: WeekCalendarProps) => {
  const touchStartX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const diff = e.changedTouches[0].clientX - touchStartX.current

    if (diff > 50) setWeekOffset((p) => p - 1)
    if (diff < -50) setWeekOffset((p) => p + 1)

    touchStartX.current = null
  }
  const today = new Date().toDateString()

  return (
    <div
    className="week-view"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {Object.entries(weekDates).map(([day, date]) => {
        const isToday = date.toDateString() === today
        const dayChores = choresByDay[day] ?? []

        return (
          <div
            key={day}
            className={`week-day ${isToday ? "today" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            <div className="week-day-header">
              <div>{day}</div>
              <div>{date.getDate()}</div>
            </div>

          <div className="week-chore">
  {dayChores.length === 0 ? (
    <div className="empty-day">
      <p className="empty-dayp">

      Inga quests denna dag
      </p>
      <p className="empty-dayp">
       Passa på att hämta från frivillig listan
      </p>
    </div>
  ) : (
    dayChores.slice(0, 3).map((chore) => (
      <div
        key={chore.id}
        className={`chore-card status-${chore.status?.toLowerCase()}`}
        onClick={(e) => {
          e.stopPropagation()

          setExpandedChoreId(
            expandedChoreId === chore.id ? null : chore.id
          )
        }}
      >
        {chore.title}
      </div>
    ))
  )}
</div>
          </div>
        )
      })}
    </div>
  )
}