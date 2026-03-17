import type { ScoredPerson } from '../../../backend/types'

interface TopPeoplePanelProps {
  people: ScoredPerson[]
}

export function TopPeoplePanel({ people }: TopPeoplePanelProps) {
  if (people.length === 0) return null

  return (
    <div className="top-people-panel">
      <h3 className="top-people-panel__title">Top Scorers</h3>
      {people.map((person, rank) => (
        <div key={person.id} className="top-people-panel__entry">
          <span className="top-people-panel__rank">#{rank + 1}</span>
          <span className="top-people-panel__name">{person.name}</span>
          <span className="top-people-panel__score">
            {person.compositeScore}
          </span>
          <div className="top-people-panel__breakdown">
            {person.scoreBreakdown.map((item) => (
              <span key={item.constraintId} className="top-people-panel__item">
                {item.constraintName}: {item.rawScore} &times;{item.weight} ={' '}
                {item.weightedScore}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
