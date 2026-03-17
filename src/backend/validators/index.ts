import type { Person, ValidationResult } from '../types'

export function validateBeforeBalance(
  people: Person[],
  teamSize: number
): ValidationResult {
  if (people.length < 2) {
    return { valid: false, error: 'At least 2 people are required to balance teams.' }
  }
  if (people.length <= teamSize) {
    return {
      valid: false,
      error: `Number of people (${people.length}) must be greater than team size (${teamSize}).`,
    }
  }
  return { valid: true, error: null }
}
