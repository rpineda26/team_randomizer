import type { Person, Constraint } from '../../../backend/types'
import { PersonRow } from './PersonRow'

interface PersonListProps {
  people: Person[]
  constraints: Constraint[]
  onRemove: (id: string) => void
  onEdit: (id: string, name: string, tags: Record<string, string | number | boolean>) => void
  onClear: () => void
}

export function PersonList({
  people,
  constraints,
  onRemove,
  onEdit,
  onClear,
}: PersonListProps) {
  if (people.length === 0) return null

  return (
    <div className="person-list">
      <div className="person-list__header">
        <h3 className="person-list__title">People ({people.length})</h3>
        <button className="btn btn--danger btn--sm" onClick={onClear}>
          Clear All
        </button>
      </div>
      {people.map((p) => (
        <PersonRow
          key={p.id}
          person={p}
          constraints={constraints}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
