import type { Constraint } from '../../../backend/types'
import { ConstraintRow } from './ConstraintRow'

interface ConstraintListProps {
  constraints: Constraint[]
  onRemove: (id: string) => void
  onWeightChange: (id: string, weight: number) => void
}

export function ConstraintList({
  constraints,
  onRemove,
  onWeightChange,
}: ConstraintListProps) {
  if (constraints.length === 0) return null

  return (
    <div className="constraint-list">
      <h3 className="constraint-list__title">Constraints</h3>
      {constraints.map((c) => (
        <ConstraintRow
          key={c.id}
          constraint={c}
          onRemove={onRemove}
          onWeightChange={onWeightChange}
        />
      ))}
    </div>
  )
}
