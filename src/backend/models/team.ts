import type { Team, ScoredPerson } from '../types'

export function createTeam(id: string, members: ScoredPerson[] = []): Team {
  const compositeTotal = members.reduce((sum, m) => sum + m.compositeScore, 0)
  return {
    id,
    members,
    compositeTotal,
    balanceScore: 0,
  }
}
