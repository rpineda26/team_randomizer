import type { ConstraintValue } from '../../../backend/types'

interface TagBadgeProps {
  label: string
  value: ConstraintValue
  colorIndex: number
}

const BADGE_COLORS = [
  '#6366f1', '#0891b2', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#2563eb', '#0d9488', '#ca8a04', '#e11d48',
]

export function TagBadge({ label, value, colorIndex }: TagBadgeProps) {
  const color = BADGE_COLORS[colorIndex % BADGE_COLORS.length]

  return (
    <span className="tag-badge" style={{ borderColor: color, color }}>
      <span className="tag-badge__label">{label}:</span>{' '}
      <span className="tag-badge__value">{String(value)}</span>
    </span>
  )
}
