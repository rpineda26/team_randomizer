interface BalanceScoreBadgeProps {
  score: number
  label?: string
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'
  if (score >= 60) return '#d97706'
  return '#dc2626'
}

export function BalanceScoreBadge({ score, label }: BalanceScoreBadgeProps) {
  const color = getScoreColor(score)

  return (
    <span className="balance-score-badge" style={{ color, borderColor: color }}>
      {label && <span className="balance-score-badge__label">{label} </span>}
      <span className="balance-score-badge__value">{score}</span>
      <span className="balance-score-badge__max">/100</span>
    </span>
  )
}
