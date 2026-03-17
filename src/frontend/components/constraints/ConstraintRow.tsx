import type { Constraint } from '../../../backend/types'
import { TypeBadge } from '../shared/TypeBadge'
import { WeightBadge } from '../shared/WeightBadge'

interface ConstraintRowProps {
  constraint: Constraint
  onRemove: (id: string) => void
  onWeightChange: (id: string, weight: number) => void
}

export function ConstraintRow({
  constraint,
  onRemove,
  onWeightChange,
}: ConstraintRowProps) {
  return (
    <div className="constraint-row">
      <div className="constraint-row__info">
        <span className="constraint-row__name">{constraint.name}</span>
        <TypeBadge type={constraint.type} />
        <WeightBadge
          weight={constraint.weight}
          onEdit={(w) => onWeightChange(constraint.id, w)}
        />
        {constraint.type === 'enum' && (
          <span className="constraint-row__values">
            {constraint.values.join(', ')}
          </span>
        )}
      </div>
      <button
        className="btn btn--danger btn--sm"
        onClick={() => onRemove(constraint.id)}
      >
        Remove
      </button>
    </div>
  )
}
