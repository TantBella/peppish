import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useChores } from "../hooks/useChores"

import { WeekCalendarGrid } from "../components/WeekCalenderGrid"
import { ChoreTabs } from "../components/ChoreTabs"
import { DayDrawer } from "../components/DayDrawer"
import { DayView } from "../components/DayView"
import { MonthView } from "../components/MonthView"

import { useChoreCalendar, ViewMode } from "../hooks/useChoreCalendar"

export const ChoreListPage = () => {
  const { user } = useAuth()
  const { data: chores = [], isLoading, error } = useChores()

  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [expandedChoreId, setExpandedChoreId] = useState<string | null>(null)

  const {
    weekDates,
    todayChores,
    monthChores,
    choresByWeekDay,
    choresBySelectedDate,
  } = useChoreCalendar(chores, weekOffset)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed</div>

  return (
    <div className="chore-list-container">
      <h1>Sysslor</h1>

      <ChoreTabs viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "week" && (
        <WeekCalendarGrid
          weekDates={weekDates}
          choresByDay={choresByWeekDay}
          expandedChoreId={expandedChoreId}
          setExpandedChoreId={setExpandedChoreId}
          setSelectedDate={setSelectedDate}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
        />
      )}

      {viewMode === "day" && (
        <DayView
          chores={todayChores}
          userId={user?.id}
          expandedChoreId={expandedChoreId}
          setExpandedChoreId={setExpandedChoreId}
        />
      )}

      {viewMode === "month" && (
        <MonthView
          chores={monthChores}
          userId={user?.id}
          expandedChoreId={expandedChoreId}
          setExpandedChoreId={setExpandedChoreId}
        />
      )}

      <DayDrawer
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        chores={choresBySelectedDate(selectedDate)}
        userId={user?.id}
        expandedChoreId={expandedChoreId}
        setExpandedChoreId={setExpandedChoreId}
      />
    </div>
  )
}