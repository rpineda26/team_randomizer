import { useState, useRef } from 'react'
import type { ScoredPerson, Constraint } from '../../../backend/types'
import { Avatar } from '../shared/Avatar'
import { TagBadge } from '../shared/TagBadge'

interface MemberChipProps {
  person: ScoredPerson
  constraints: Constraint[]
  draggable?: boolean
  selected?: boolean
  onTap?: () => void
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
}

export function MemberChip({
  person,
  constraints,
  draggable = false,
  selected = false,
  onTap,
  onDragStart,
  onDragOver,
  onDrop,
}: MemberChipProps) {
  const [dropTarget, setDropTarget] = useState(false)
  const dragCounter = useRef(0)

  const classes = [
    'member-chip',
    dropTarget ? 'member-chip--drop-target' : '',
    selected ? 'member-chip--selected' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      draggable={draggable}
      onClick={onTap}
      onDragStart={onDragStart}
      onDragEnter={() => {
        dragCounter.current++
        setDropTarget(true)
      }}
      onDragLeave={() => {
        dragCounter.current--
        if (dragCounter.current === 0) setDropTarget(false)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver?.(e)
      }}
      onDrop={(e) => {
        dragCounter.current = 0
        setDropTarget(false)
        onDrop?.(e)
      }}
    >
      {draggable && <span className="member-chip__handle">&#8942;&#8942;</span>}
      <Avatar name={person.name} colorIndex={person.colorIndex} />
      <div className="member-chip__info">
        <span className="member-chip__name">{person.name}</span>
        <div className="member-chip__tags">
          {constraints.map((c, i) => (
            <TagBadge
              key={c.id}
              label={c.name}
              value={person.tags[c.id] ?? '—'}
              colorIndex={i}
            />
          ))}
        </div>
      </div>
      <span className="member-chip__score" title="Composite score">
        {person.compositeScore}
      </span>
    </div>
  )
}
