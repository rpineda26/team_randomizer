import type { BalanceResult, Constraint } from '../../backend/types'
import { TeamCard } from '../components/teams/TeamCard'
import { BalanceScoreBadge } from '../components/teams/BalanceScoreBadge'
import { EmptyState } from '../components/shared/EmptyState'

interface TeamsViewProps {
  result: BalanceResult | null
  constraints: Constraint[]
  onSwap: (
    fromTeamId: string,
    fromPersonId: string,
    toTeamId: string,
    toPersonId: string
  ) => void
  onRerun: () => void
  onCopyToClipboard: () => Promise<void>
  onDownloadCSV: () => void
}

export function TeamsView({
  result,
  constraints,
  onSwap,
  onRerun,
  onCopyToClipboard,
  onDownloadCSV,
}: TeamsViewProps) {
  if (!result) {
    return (
      <EmptyState
        title="No teams generated yet"
        description="Go to the People tab, add people and constraints, then click Balance Teams."
      />
    )
  }

  return (
    <div className="teams-view">
      <div className="teams-view__header">
        <BalanceScoreBadge score={result.overallScore} label="Overall" />
        <div className="teams-view__actions">
          <button className="btn btn--primary" onClick={onRerun}>
            Re-balance
          </button>
          <button className="btn" onClick={onCopyToClipboard}>
            Copy to Clipboard
          </button>
          <button className="btn" onClick={onDownloadCSV}>
            Download CSV
          </button>
        </div>
      </div>
      <div className="teams-view__grid">
        {result.teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            constraints={constraints}
            onSwap={onSwap}
          />
        ))}
      </div>
    </div>
  )
}
