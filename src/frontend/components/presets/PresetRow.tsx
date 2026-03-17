import type { Preset } from '../../../backend/types'

interface PresetRowProps {
  preset: Preset
  onLoad: (preset: Preset) => void
  onDelete: (id: string) => void
}

export function PresetRow({ preset, onLoad, onDelete }: PresetRowProps) {
  return (
    <div className="preset-row">
      <div className="preset-row__info">
        <span className="preset-row__name">{preset.name}</span>
        <span className="preset-row__meta">
          {preset.people.length} people &middot; {preset.constraints.length} constraints
        </span>
        <span className="preset-row__date">
          {new Date(preset.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="preset-row__actions">
        <button className="btn btn--primary btn--sm" onClick={() => onLoad(preset)}>
          Load
        </button>
        <button className="btn btn--danger btn--sm" onClick={() => onDelete(preset.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
