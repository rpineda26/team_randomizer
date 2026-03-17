import { useState } from 'react'
import type { ConstraintType } from '../../../backend/types'

interface AddConstraintFormProps {
  onAdd: (
    type: ConstraintType,
    name: string,
    weight: number,
    values?: string[]
  ) => void
}

export function AddConstraintForm({ onAdd }: AddConstraintFormProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ConstraintType>('enum')
  const [weight, setWeight] = useState(1)
  const [enumValues, setEnumValues] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (type === 'enum') {
      const values = enumValues
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
      const unique = [...new Set(values)]
      if (unique.length === 0) return
      onAdd(type, name, weight, unique)
    } else {
      onAdd(type, name, weight)
    }

    setName('')
    setEnumValues('')
    setWeight(1)
  }

  return (
    <form className="add-constraint-form" onSubmit={handleSubmit}>
      <h3 className="add-constraint-form__title">Add Constraint</h3>
      <div className="add-constraint-form__row">
        <input
          className="input"
          type="text"
          placeholder="Constraint name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as ConstraintType)}
        >
          <option value="enum">Enum</option>
          <option value="int">Integer</option>
          <option value="float">Float</option>
          <option value="boolean">Boolean</option>
        </select>
        <label className="add-constraint-form__weight">
          Weight
          <input
            className="input input--sm"
            type="number"
            min={1}
            max={10}
            step={1}
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
          />
        </label>
      </div>
      {type === 'enum' && (
        <div className="add-constraint-form__enum">
          <input
            className="input"
            type="text"
            placeholder="Values (comma-separated, e.g. Junior, Mid, Senior)"
            value={enumValues}
            onChange={(e) => setEnumValues(e.target.value)}
          />
          <p className="add-constraint-form__hint">
            Value order matters for balancing — first value scores lowest.
          </p>
        </div>
      )}
      <button className="btn btn--primary" type="submit">
        Add Constraint
      </button>
    </form>
  )
}
