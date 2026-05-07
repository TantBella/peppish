type ViewMode = 'day' | 'week' | 'month'

type ChoreTabsProps = {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export const ChoreTabs = ({ viewMode, setViewMode }: ChoreTabsProps) => {
  const tabs: { label: string; value: ViewMode }[] = [
    { label: 'Dag-vy', value: 'day' },
    { label: 'Veck-vy', value: 'week' },
    { label: 'Månadsvy', value: 'month' },
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