import type { Constraint, Person, DemoOptions } from '../types'
import { createEnumConstraint, createIntConstraint } from '../models/constraint'
import { createPerson } from '../models/person'

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Frank', 'Grace', 'Hank',
  'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Noah', 'Olivia', 'Pete',
  'Quinn', 'Ruby', 'Sam', 'Tina', 'Uma', 'Vince', 'Wendy', 'Xander',
  'Yara', 'Zack', 'Aria', 'Blake', 'Cleo', 'Drew',
]

const LAST_NAMES = [
  'Smith', 'Chen', 'Patel', 'Kim', 'Garcia', 'Müller', 'Tanaka',
  'Silva', 'Ahmed', 'Johansson', 'Okonkwo', 'Dubois', 'Novak',
  'Rossi', 'Park', 'Larsen', 'Gupta', 'Torres', 'Yamamoto', 'Berg',
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

export function generateDefaultConstraints(): Constraint[] {
  return [
    createEnumConstraint('Skill Level', ['Junior', 'Mid', 'Senior'], 3),
    createIntConstraint('Experience (years)', 1),
  ]
}

export function generatePeople(
  count: number,
  constraints: Constraint[],
  options?: Partial<DemoOptions>
): Person[] {
  const [min, max] = options?.intFloatRange ?? [1, 10]
  const usedNames = new Set<string>()
  const people: Person[] = []

  for (let i = 0; i < count; i++) {
    let name: string
    do {
      name = `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`
    } while (usedNames.has(name))
    usedNames.add(name)

    const tags: Record<string, string | number | boolean> = {}

    for (const c of constraints) {
      switch (c.type) {
        case 'enum':
          tags[c.id] = pickRandom(c.values)
          break
        case 'int':
          tags[c.id] = randomInt(min, max)
          break
        case 'float':
          tags[c.id] = randomFloat(min, max)
          break
        case 'boolean':
          tags[c.id] = Math.random() < 0.5
          break
      }
    }

    people.push(createPerson(name, tags))
  }

  return people
}
