import { useState } from 'react'
import type { Constraint, ConstraintValue } from '../../../backend/types'

interface AddPersonFormProps {
  constraints: Constraint[]
  onAdd: (name: string, tags: Record<string, ConstraintValue>) => void
  editingPerson?: {
    id: string
    name: string
    tags: Record<string, ConstraintValue>
  } | null
  onCancelEdit?: () => void
  onSaveEdit?: (id: string, name: string, tags: Record<string, ConstraintValue>) => void
}

function getDefaultTags(constraints: Constraint[]): Record<string, ConstraintValue> {
  const tags: Record<string, ConstraintValue> = {}
  for (const c of constraints) {
    switch (c.type) {
      case 'enum':
        tags[c.id] = c.values[0] ?? ''
        break
      case 'int':
      case 'float':
        tags[c.id] = 0
        break
      case 'boolean':
        tags[c.id] = false
        break
    }
  }
  return tags
}

export function AddPersonForm({
  constraints,
  onAdd,
  editingPerson,
  onCancelEdit,
  onSaveEdit,
}: AddPersonFormProps) {
  const isEditing = !!editingPerson
  const [name, setName] = useState(editingPerson?.name ?? '')
  const [tags, setTags] = useState<Record<string, ConstraintValue>>(
    editingPerson?.tags ?? getDefaultTags(constraints)
  )

  const resetForm = () => {
    setName('')
    setTags(getDefaultTags(constraints))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (isEditing && onSaveEdit && editingPerson) {
      onSaveEdit(editingPerson.id, name, tags)
      onCancelEdit?.()
    } else {
      onAdd(name, tags)
    }
    resetForm()
  }

  const updateTag = (constraintId: string, value: ConstraintValue) => {
    setTags((prev) => ({ ...prev, [constraintId]: value }))
  }

  return (
    <form className="add-person-form" onSubmit={handleSubmit}>
      <h3 className="add-person-form__title">
        {isEditing ? 'Edit Person' : 'Add Person'}
      </h3>
      <div className="add-person-form__row">
        <input
          className="input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {constraints.map((c) => (
        <div key={c.id} className="add-person-form__field">
          <label className="add-person-form__label">{c.name}</label>
          {c.type === 'enum' && (
            <select
              className="input"
              value={String(tags[c.id] ?? c.values[0])}
              onChange={(e) => updateTag(c.id, e.target.value)}
            >
              {c.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}
          {c.type === 'int' && (
            <input
              className="input"
              type="number"
              step={1}
              value={Number(tags[c.id] ?? 0)}
              onChange={(e) =>
                updateTag(c.id, parseInt(e.target.value) || 0)
              }
            />
          )}
          {c.type === 'float' && (
            <input
              className="input"
              type="number"
              step="any"
              value={Number(tags[c.id] ?? 0)}
              onChange={(e) =>
                updateTag(c.id, parseFloat(e.target.value) || 0)
              }
            />
          )}
          {c.type === 'boolean' && (
            <select
              className="input"
              value={String(tags[c.id] ?? false)}
              onChange={(e) => updateTag(c.id, e.target.value === 'true')}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}
        </div>
      ))}
      <div className="add-person-form__actions">
        <button className="btn btn--primary" type="submit">
          {isEditing ? 'Save' : 'Add Person'}
        </button>
        {isEditing && onCancelEdit && (
          <button
            className="btn"
            type="button"
            onClick={() => {
              onCancelEdit()
              resetForm()
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
