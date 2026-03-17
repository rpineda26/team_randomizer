import { useState } from 'react'
import type { Preset } from '../../../backend/types'
import { PresetRow } from './PresetRow'

interface PresetListProps {
  presets: Preset[]
  onLoad: (preset: Preset) => void
  onDelete: (id: string) => void
  onSave: (name: string) => void
}

export function PresetList({
  presets,
  onLoad,
  onDelete,
  onSave,
}: PresetListProps) {
  const [name, setName] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim())
    setName('')
  }

  return (
    <div className="preset-list">
      <form className="preset-list__save" onSubmit={handleSave}>
        <input
          className="input"
          type="text"
          placeholder="Preset name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn--primary" type="submit">
          Save Current
        </button>
      </form>

      {presets.length === 0 ? (
        <p className="preset-list__empty">No saved presets yet.</p>
      ) : (
        presets.map((p) => (
          <PresetRow
            key={p.id}
            preset={p}
            onLoad={onLoad}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}
