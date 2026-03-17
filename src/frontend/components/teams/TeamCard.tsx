import type { Team, Constraint } from '../../../backend/types'
import { MemberChip } from './MemberChip'
import { BalanceScoreBadge } from './BalanceScoreBadge'

interface TeamCardProps {
  team: Team
  constraints: Constraint[]
  onSwap: (
    fromTeamId: string,
    fromPersonId: string,
    toTeamId: string,
    toPersonId: string
  ) => void
}

export function TeamCard({ team, constraints, onSwap }: TeamCardProps) {
  const handleDragStart = (personId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ teamId: team.id, personId })
    )
  }

  const handleDrop = (toPersonId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      onSwap(data.teamId, data.personId, team.id, toPersonId)
    } catch {
      // ignore invalid drag data
    }
  }

  return (
    <div className="team-card">
      <div className="team-card__header">
        <h3 className="team-card__title">{team.id}</h3>
        <BalanceScoreBadge score={team.balanceScore} />
      </div>
      <div className="team-card__members">
        {team.members.map((member) => (
          <MemberChip
            key={member.id}
            person={member}
            constraints={constraints}
            draggable
            onDragStart={handleDragStart(member.id)}
            onDrop={handleDrop(member.id)}
          />
        ))}
      </div>
      <div className="team-card__footer">
        Total: {team.compositeTotal}
      </div>
    </div>
  )
}
