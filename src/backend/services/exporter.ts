import type { BalanceResult, Constraint } from '../types'

export function toClipboardText(
  result: BalanceResult,
  constraints: Constraint[]
): string {
  const lines: string[] = []

  lines.push(`Overall Balance Score: ${result.overallScore}/100`)
  lines.push('')

  for (const team of result.teams) {
    lines.push(`── ${team.id} (Score: ${team.balanceScore}/100) ──`)

    for (const member of team.members) {
      const tags = constraints
        .map((c) => {
          const val = member.tags[c.id]
          return `${c.name}: ${val}`
        })
        .join(', ')

      lines.push(`  ${member.name} [${tags}]`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

export function toCSV(
  result: BalanceResult,
  constraints: Constraint[]
): string {
  const headers = ['Team', 'Name', ...constraints.map((c) => c.name)]
  const rows: string[][] = [headers]

  for (const team of result.teams) {
    for (const member of team.members) {
      const row = [
        team.id,
        member.name,
        ...constraints.map((c) => String(member.tags[c.id] ?? '')),
      ]
      rows.push(row)
    }
  }

  return rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')
}
