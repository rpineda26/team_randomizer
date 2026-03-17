import { useState } from 'react'
import type { Constraint, Person, ScoredPerson, ConstraintValue } from '../../backend/types'
import { ConstraintList } from '../components/constraints/ConstraintList'
import { AddConstraintForm } from '../components/constraints/AddConstraintForm'
import { PersonList } from '../components/people/PersonList'
import { AddPersonForm } from '../components/people/AddPersonForm'
import { TopPeoplePanel } from '../components/topPeople/TopPeoplePanel'
import { EmptyState } from '../components/shared/EmptyState'

interface PeopleViewProps {
  constraints: Constraint[]
  people: Person[]
  topPeople: ScoredPerson[]
  teamSize: number
  error: string | null
  addConstraint: (
    type: Constraint['type'],
    name: string,
    weight: number,
    values?: string[]
  ) => void
  removeConstraint: (id: string) => void
  updateConstraintWeight: (id: string, weight: number) => void
  addPerson: (name: string, tags: Record<string, ConstraintValue>) => void
  removePerson: (id: string) => void
  updatePerson: (id: string, name: string, tags: Record<string, ConstraintValue>) => void
  clearPeople: () => void
  setTeamSize: (size: number) => void
  runBalance: () => void
  generateDemo: (count?: number) => void
}

export function PeopleView({
  constraints,
  people,
  topPeople,
  teamSize,
  error,
  addConstraint,
  removeConstraint,
  updateConstraintWeight,
  addPerson,
  removePerson,
  updatePerson,
  clearPeople,
  setTeamSize,
  runBalance,
  generateDemo,
}: PeopleViewProps) {
  const [editingPerson, setEditingPerson] = useState<{
    id: string
    name: string
    tags: Record<string, ConstraintValue>
  } | null>(null)

  const handleEdit = (
    id: string,
    name: string,
    tags: Record<string, ConstraintValue>
  ) => {
    setEditingPerson({ id, name, tags })
  }

  const isEmpty = constraints.length === 0 && people.length === 0

  return (
    <div className="people-view">
      {isEmpty && (
        <EmptyState
          title="No people or constraints yet"
          description="Add constraints and people to get started, or generate demo data."
          action={{ label: 'Generate Demo Data', onClick: () => generateDemo() }}
        />
      )}

      <div className="people-view__layout">
        <div className="people-view__main">
          <AddConstraintForm onAdd={addConstraint} />
          <ConstraintList
            constraints={constraints}
            onRemove={removeConstraint}
            onWeightChange={updateConstraintWeight}
          />

          <AddPersonForm
            constraints={constraints}
            onAdd={addPerson}
            editingPerson={editingPerson}
            onCancelEdit={() => setEditingPerson(null)}
            onSaveEdit={(id, name, tags) => {
              updatePerson(id, name, tags)
              setEditingPerson(null)
            }}
          />

          <PersonList
            people={people}
            constraints={constraints}
            onRemove={removePerson}
            onEdit={handleEdit}
            onClear={clearPeople}
          />
        </div>

        <div className="people-view__sidebar">
          <TopPeoplePanel people={topPeople} />

          <div className="people-view__controls">
            <label className="people-view__team-size">
              Team size
              <input
                className="input input--sm"
                type="number"
                min={2}
                step={1}
                value={teamSize}
                onChange={(e) =>
                  setTeamSize(Math.max(2, parseInt(e.target.value) || 2))
                }
              />
            </label>
            <button className="btn btn--primary" onClick={runBalance}>
              Balance Teams
            </button>
            <button className="btn" onClick={() => generateDemo()}>
              Generate Demo
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}
        </div>
      </div>
    </div>
  )
}
