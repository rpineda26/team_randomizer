import { useState, useRef } from 'react'
import type { Team, Constraint } from '../../../backend/types'
import { MemberChip } from './MemberChip'
import { BalanceScoreBadge } from './BalanceScoreBadge'

interface TeamCardProps {
  team: Team
  constraints: Constraint[]
  selectedPersonId?: string | null
  onTapMember: (teamId: string, personId: string) => void
  onSwap: (
    fromTeamId: string,
    fromPersonId: string,
    toTeamId: string,
    toPersonId: string
  ) => void
}

export function TeamCard({ team, constraints, selectedPersonId, onTapMember, onSwap }: TeamCardProps) {
  const [dragOver, setDragOver] = useState(false)
  const dragCounter = useRef(0)

  const handleDragStart = (personId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ teamId: team.id, personId })
    )
  }

  const handleCardDragEnter = () => {
    dragCounter.current++
    setDragOver(true)
  }

  const handleCardDragLeave = () => {
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOver(false)
    }
  }

  const handleCardDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleCardDrop = () => {
    dragCounter.current = 0
    setDragOver(false)
  }

  const handleDrop = (toPersonId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    handleCardDrop()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      onSwap(data.teamId, data.personId, team.id, toPersonId)
    } catch {
      // ignore invalid drag data
    }
  }

  return (
    <div
      className={`team-card ${dragOver ? 'team-card--drag-over' : ''}`}
      onDragEnter={handleCardDragEnter}
      onDragLeave={handleCardDragLeave}
      onDragOver={handleCardDragOver}
    >
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
            selected={selectedPersonId === member.id}
            onTap={() => onTapMember(team.id, member.id)}
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
