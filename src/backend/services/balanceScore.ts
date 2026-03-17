import type { Team } from '../types'

export function computeTeamBalanceScore(
  teamTotal: number,
  idealAvg: number
): number {
  if (idealAvg === 0) return 100
  const deviation = Math.abs(teamTotal - idealAvg) / idealAvg
  return Math.max(0, Math.round((1 - deviation) * 100))
}

export function computeOverallScore(teams: Team[]): number {
  if (teams.length === 0) return 100
  const sum = teams.reduce((acc, t) => acc + t.balanceScore, 0)
  return Math.round(sum / teams.length)
}
