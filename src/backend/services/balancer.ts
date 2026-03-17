import type {
  Person,
  Constraint,
  ScoredPerson,
  ScoreBreakdownItem,
  BalanceResult,
  Team,
} from '../types'
import { computeTeamBalanceScore, computeOverallScore } from './balanceScore'

function getRawScore(person: Person, constraint: Constraint): number {
  const value = person.tags[constraint.id]

  switch (constraint.type) {
    case 'enum': {
      const idx = constraint.values.indexOf(value as string)
      return idx >= 0 ? idx : 0
    }
    case 'int':
    case 'float':
      return typeof value === 'number' ? value : 0
    case 'boolean':
      return value === true ? 1 : 0
  }
}

export function computeScore(
  person: Person,
  constraints: Constraint[]
): ScoredPerson {
  let compositeScore = 0
  const scoreBreakdown: ScoreBreakdownItem[] = []

  for (const constraint of constraints) {
    const rawScore = getRawScore(person, constraint)
    const weightedScore = rawScore * constraint.weight

    scoreBreakdown.push({
      constraintId: constraint.id,
      constraintName: constraint.name,
      rawScore,
      weight: constraint.weight,
      weightedScore,
    })

    compositeScore += weightedScore
  }

  return {
    ...person,
    compositeScore,
    scoreBreakdown,
  }
}

export function balance(
  people: Person[],
  constraints: Constraint[],
  teamSize: number
): BalanceResult {
  const scored = people.map((p) => computeScore(p, constraints))

  // Sort descending by composite score, alpha tiebreak
  scored.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore
    }
    return a.name.localeCompare(b.name)
  })

  const numTeams = Math.ceil(people.length / teamSize)
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    id: `team-${i + 1}`,
    members: [],
    compositeTotal: 0,
    balanceScore: 0,
  }))

  // Snake draft
  let forward = true
  let personIdx = 0

  while (personIdx < scored.length) {
    const order = forward
      ? Array.from({ length: numTeams }, (_, i) => i)
      : Array.from({ length: numTeams }, (_, i) => numTeams - 1 - i)

    for (const teamIdx of order) {
      if (personIdx >= scored.length) break
      teams[teamIdx].members.push(scored[personIdx])
      personIdx++
    }

    forward = !forward
  }

  // Compute totals and balance scores
  const totalComposite = scored.reduce((s, p) => s + p.compositeScore, 0)
  const idealAvg = totalComposite / numTeams

  for (const team of teams) {
    team.compositeTotal = team.members.reduce(
      (s, m) => s + m.compositeScore,
      0
    )
    team.balanceScore = computeTeamBalanceScore(team.compositeTotal, idealAvg)
  }

  return {
    teams,
    overallScore: computeOverallScore(teams),
  }
}
