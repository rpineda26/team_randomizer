import type { Preset, Constraint, Person } from '../types'

export function createPreset(
  name: string,
  constraints: Constraint[],
  people: Person[]
): Preset {
  return {
    id: crypto.randomUUID(),
    name,
    constraints,
    people,
    createdAt: Date.now(),
  }
}
