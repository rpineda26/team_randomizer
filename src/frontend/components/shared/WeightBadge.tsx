import { useState } from 'react'

interface WeightBadgeProps {
  weight: number
  onEdit?: (weight: number) => void
}

export function WeightBadge({ weight, onEdit }: WeightBadgeProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(weight))

  if (editing && onEdit) {
    return (
      <input
        className="weight-badge weight-badge--editing"
        type="number"
        min={1}
        max={10}
        step={1}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          const n = Math.min(10, Math.max(1, parseInt(value) || 1))
          onEdit(n)
          setEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const n = Math.min(10, Math.max(1, parseInt(value) || 1))
            onEdit(n)
            setEditing(false)
          }
          if (e.key === 'Escape') {
            setValue(String(weight))
            setEditing(false)
          }
        }}
      />
    )
  }

  return (
    <span
      className={`weight-badge ${onEdit ? 'weight-badge--editable' : ''}`}
      onClick={() => {
        if (onEdit) {
          setValue(String(weight))
          setEditing(true)
        }
      }}
      title={onEdit ? 'Click to edit weight' : undefined}
    >
      &times;{weight}
    </span>
  )
}
