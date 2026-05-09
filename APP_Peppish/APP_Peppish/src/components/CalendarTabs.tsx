type ViewMode = 'day' | 'week' | 'month'

type CalendarTabsProps = {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export const CalendarTabs = ({ viewMode, setViewMode }: CalendarTabsProps) => {
  const tabs: { label: string; value: ViewMode }[] = [
    { label: 'Idag', value: 'day' },
    { label: 'Denna veckan', value: 'week' },
    { label: 'Denna månaden', value: 'month' },
  ]

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${viewMode === tab.value ? 'active' : ''}`}
          onClick={() => setViewMode(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}