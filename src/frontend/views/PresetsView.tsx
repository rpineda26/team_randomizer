import type { Preset } from '../../backend/types'
import { PresetList } from '../components/presets/PresetList'

interface PresetsViewProps {
  presets: Preset[]
  onLoad: (preset: Preset) => void
  onDelete: (id: string) => void
  onSave: (name: string) => void
}

export function PresetsView({
  presets,
  onLoad,
  onDelete,
  onSave,
}: PresetsViewProps) {
  return (
    <div className="presets-view">
      <h2>Presets</h2>
      <PresetList
        presets={presets}
        onLoad={onLoad}
        onDelete={onDelete}
        onSave={onSave}
      />
    </div>
  )
}
