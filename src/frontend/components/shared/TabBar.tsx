import type { AppTab } from '../../../backend/types'

interface TabBarProps {
  tabs: AppTab[]
  active: AppTab
  onChange: (tab: AppTab) => void
}

const TAB_LABELS: Record<AppTab, string> = {
  people: 'People',
  teams: 'Teams',
  presets: 'Presets',
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-bar__tab ${tab === active ? 'tab-bar__tab--active' : ''}`}
          onClick={() => onChange(tab)}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </nav>
  )
}
