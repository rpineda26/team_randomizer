import type { Person, ConstraintValueMap } from '../types'

let colorCounter = 0

export function createPerson(
  name: string,
  tags: ConstraintValueMap = {}
): Person {
  return {
    id: crypto.randomUUID(),
    name,
    tags,
    colorIndex: colorCounter++,
  }
}

export function resetColorCounter(): void {
  colorCounter = 0
}
