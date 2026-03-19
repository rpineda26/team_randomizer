import { useState, useRef, useEffect } from 'react'
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
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (tab: AppTab) => {
    onChange(tab)
    setOpen(false)
  }

  return (
    <div className="tab-bar" ref={ref}>
      <button
        className="tab-bar__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="tab-bar__active-label">{TAB_LABELS[active]}</span>
        <span className="tab-bar__hamburger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      {open && (
        <ul className="tab-bar__dropdown" role="menu">
          {tabs.map((tab) => (
            <li key={tab} role="none">
              <button
                role="menuitem"
                className={`tab-bar__item ${tab === active ? 'tab-bar__item--active' : ''}`}
                onClick={() => handleSelect(tab)}
              >
                {TAB_LABELS[tab]}
                {tab === active && <span className="tab-bar__item-check" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
