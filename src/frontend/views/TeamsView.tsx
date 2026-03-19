import { useState } from 'react'
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
  const [swapMode, setSwapMode] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{ teamId: string; personId: string } | null>(null)

  const toggleSwapMode = () => {
    setSwapMode((prev) => !prev)
    setSelectedMember(null)
  }

  const handleTapMember = (teamId: string, personId: string) => {
    if (!swapMode) return
    if (!selectedMember) {
      setSelectedMember({ teamId, personId })
      return
    }
    if (selectedMember.teamId === teamId && selectedMember.personId === personId) {
      setSelectedMember(null)
      return
    }
    onSwap(selectedMember.teamId, selectedMember.personId, teamId, personId)
    setSelectedMember(null)
  }

  const selectedName = selectedMember
    ? result?.teams
        .find((t) => t.id === selectedMember.teamId)
        ?.members.find((m) => m.id === selectedMember.personId)?.name
    : null

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
          <button
            className={`btn teams-view__swap-toggle ${swapMode ? 'btn--primary' : ''}`}
            onClick={toggleSwapMode}
          >
            {swapMode ? 'Cancel Swap' : 'Swap Members'}
          </button>
          <button className="btn" onClick={onCopyToClipboard}>
            Copy to Clipboard
          </button>
          <button className="btn" onClick={onDownloadCSV}>
            Download CSV
          </button>
        </div>
      </div>
      {swapMode && (
        <div className="teams-view__swap-hint">
          {selectedName
            ? <>Tap another person to swap with <strong>{selectedName}</strong>, or tap them again to cancel.</>
            : 'Tap any person to select them for swapping.'}
        </div>
      )}
      <div className="teams-view__grid">
        {result.teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            constraints={constraints}
            selectedPersonId={selectedMember?.teamId === team.id ? selectedMember.personId : null}
            onTapMember={handleTapMember}
            onSwap={onSwap}
          />
        ))}
      </div>
    </div>
  )
}
