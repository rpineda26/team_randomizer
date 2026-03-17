import type { ConstraintType } from '../../../backend/types'

interface TypeBadgeProps {
  type: ConstraintType
}

const TYPE_COLORS: Record<ConstraintType, string> = {
  enum: '#6366f1',
  int: '#0891b2',
  float: '#059669',
  boolean: '#d97706',
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className="type-badge"
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {type}
    </span>
  )
}
