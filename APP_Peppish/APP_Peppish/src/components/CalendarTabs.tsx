
import { ViewMode } from "../hooks/useChoreCalendar"

// type ViewMode = 'day' | 'week' | 'month'

type CalendarTabsProps = {
  viewMode: ViewMode
  selectedDate: Date | null
  weekOffset: number
  setViewMode: (mode: ViewMode) => void
  setSelectedDate: (date: Date | null) => void
}

export const CalendarTabs = ({
  viewMode,
  selectedDate,
  setViewMode,
  setSelectedDate,
}: CalendarTabsProps) => { const isToday =
  !selectedDate ||
  selectedDate.toDateString() === new Date().toDateString()
 
  const tabs: { label: string; value: ViewMode }[] = [
  {
    label: isToday
      ? "Idag"
      : selectedDate?.toLocaleDateString("sv-SE", {
          day: "numeric",
          month: "short",
        }) ?? "Dag",
    value: "day",
  },
  { label: "Denna veckan", value: "week" },
  { label: "Denna månaden", value: "month" },
]

const handleTabClick = (value: ViewMode) => {
  setSelectedDate(null)
  setViewMode(value)
}

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${viewMode === tab.value ? 'active' : ''}`}
          onClick={() =>  handleTabClick(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}