import type { Constraint, EnumConstraint, IntConstraint, FloatConstraint, BooleanConstraint } from '../types'

export function createEnumConstraint(
  name: string,
  values: string[],
  weight = 1
): EnumConstraint {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'enum',
    values,
    weight,
  }
}

export function createIntConstraint(name: string, weight = 1): IntConstraint {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'int',
    weight,
  }
}

export function createFloatConstraint(name: string, weight = 1): FloatConstraint {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'float',
    weight,
  }
}

export function createBooleanConstraint(name: string, weight = 1): BooleanConstraint {
  return {
    id: crypto.randomUUID(),
    name,
    type: 'boolean',
    weight,
  }
}

export function createConstraint(
  type: Constraint['type'],
  name: string,
  weight = 1,
  values: string[] = []
): Constraint {
  switch (type) {
    case 'enum':
      return createEnumConstraint(name, values, weight)
    case 'int':
      return createIntConstraint(name, weight)
    case 'float':
      return createFloatConstraint(name, weight)
    case 'boolean':
      return createBooleanConstraint(name, weight)
  }
}
