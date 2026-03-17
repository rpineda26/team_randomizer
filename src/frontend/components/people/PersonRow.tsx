import type { Person, Constraint } from '../../../backend/types'
import { Avatar } from '../shared/Avatar'
import { TagBadge } from '../shared/TagBadge'

interface PersonRowProps {
  person: Person
  constraints: Constraint[]
  onRemove: (id: string) => void
  onEdit: (id: string, name: string, tags: Record<string, string | number | boolean>) => void
}

export function PersonRow({
  person,
  constraints,
  onRemove,
  onEdit,
}: PersonRowProps) {
  return (
    <div className="person-row">
      <Avatar name={person.name} colorIndex={person.colorIndex} />
      <div className="person-row__info">
        <span className="person-row__name">{person.name}</span>
        <div className="person-row__tags">
          {constraints.map((c, i) => (
            <TagBadge
              key={c.id}
              label={c.name}
              value={person.tags[c.id] ?? '—'}
              colorIndex={i}
            />
          ))}
        </div>
      </div>
      <div className="person-row__actions">
        <button
          className="btn btn--sm"
          onClick={() => onEdit(person.id, person.name, person.tags)}
        >
          Edit
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => onRemove(person.id)}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
