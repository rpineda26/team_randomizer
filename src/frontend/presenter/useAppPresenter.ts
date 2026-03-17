import { useState, useMemo, useCallback, useEffect } from 'react'
import type {
  Constraint,
  Person,
  BalanceResult,
  Preset,
  AppTab,
  ScoredPerson,
  ConstraintValue,
} from '../../backend/types'
import { createConstraint } from '../../backend/models/constraint'
import { createPerson } from '../../backend/models/person'
import { createPreset } from '../../backend/models/preset'
import { balance, computeScore } from '../../backend/services/balancer'
import { computeTeamBalanceScore, computeOverallScore } from '../../backend/services/balanceScore'
import { generateDefaultConstraints, generatePeople } from '../../backend/services/demoGenerator'
import { toClipboardText, toCSV } from '../../backend/services/exporter'
import { loadPresets, savePresets } from '../../backend/services/storage'
import { validateBeforeBalance } from '../../backend/validators'

export function useAppPresenter() {
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [teamSize, setTeamSize] = useState(3)
  const [result, setResult] = useState<BalanceResult | null>(null)
  const [presets, setPresets] = useState<Preset[]>([])
  const [activeTab, setActiveTab] = useState<AppTab>('people')
  const [error, setError] = useState<string | null>(null)

  // Load presets from localStorage on mount
  useEffect(() => {
    setPresets(loadPresets())
  }, [])

  // Derived: top 3 people by composite score
  const topPeople: ScoredPerson[] = useMemo(() => {
    if (constraints.length === 0 || people.length === 0) return []
    return people
      .map((p) => computeScore(p, constraints))
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 3)
  }, [people, constraints])

  // ─── Constraint actions ─────────────────────────────────────────────

  const addConstraint = useCallback(
    (
      type: Constraint['type'],
      name: string,
      weight: number,
      values?: string[]
    ) => {
      const trimmedName = name.trim()
      if (!trimmedName) return
      if (constraints.some((c) => c.name === trimmedName)) {
        setError(`Constraint "${trimmedName}" already exists.`)
        return
      }
      setError(null)
      const newConstraint = createConstraint(type, trimmedName, weight, values)

      // Set default value for existing people
      if (people.length > 0) {
        const defaultValue = getDefaultValue(newConstraint)
        setPeople((prev) =>
          prev.map((p) => ({
            ...p,
            tags: { ...p.tags, [newConstraint.id]: defaultValue },
          }))
        )
      }

      setConstraints((prev) => [...prev, newConstraint])
      setResult(null)
    },
    [constraints, people.length]
  )

  const removeConstraint = useCallback((id: string) => {
    setConstraints((prev) => prev.filter((c) => c.id !== id))
    setPeople((prev) =>
      prev.map((p) => {
        const { [id]: _, ...rest } = p.tags
        return { ...p, tags: rest }
      })
    )
    setResult(null)
  }, [])

  const updateConstraintWeight = useCallback(
    (id: string, weight: number) => {
      setConstraints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, weight } : c))
      )
      setResult(null)
    },
    []
  )

  // ─── Person actions ─────────────────────────────────────────────────

  const addPerson = useCallback(
    (name: string, tags: Record<string, ConstraintValue>) => {
      const trimmedName = name.trim()
      if (!trimmedName) return
      setError(null)
      setPeople((prev) => [...prev, createPerson(trimmedName, tags)])
      setResult(null)
    },
    []
  )

  const removePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setResult(null)
  }, [])

  const updatePerson = useCallback(
    (id: string, name: string, tags: Record<string, ConstraintValue>) => {
      setPeople((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name, tags } : p))
      )
      setResult(null)
    },
    []
  )

  const clearPeople = useCallback(() => {
    setPeople([])
    setResult(null)
  }, [])

  // ─── Balance actions ────────────────────────────────────────────────

  const runBalance = useCallback(() => {
    const validation = validateBeforeBalance(people, teamSize)
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    setError(null)
    const res = balance(people, constraints, teamSize)
    setResult(res)
    setActiveTab('teams')
  }, [people, constraints, teamSize])

  const swapMembers = useCallback(
    (
      fromTeamId: string,
      fromPersonId: string,
      toTeamId: string,
      toPersonId: string
    ) => {
      if (!result) return

      const newTeams = result.teams.map((t) => ({
        ...t,
        members: [...t.members],
      }))

      const fromTeam = newTeams.find((t) => t.id === fromTeamId)
      const toTeam = newTeams.find((t) => t.id === toTeamId)
      if (!fromTeam || !toTeam) return

      const fromIdx = fromTeam.members.findIndex((m) => m.id === fromPersonId)
      const toIdx = toTeam.members.findIndex((m) => m.id === toPersonId)
      if (fromIdx === -1 || toIdx === -1) return

      // Swap
      const temp = fromTeam.members[fromIdx]
      fromTeam.members[fromIdx] = toTeam.members[toIdx]
      toTeam.members[toIdx] = temp

      // Recompute scores
      const totalComposite = newTeams.reduce(
        (s, t) => s + t.members.reduce((ms, m) => ms + m.compositeScore, 0),
        0
      )
      const idealAvg = totalComposite / newTeams.length

      for (const team of newTeams) {
        team.compositeTotal = team.members.reduce(
          (s, m) => s + m.compositeScore,
          0
        )
        team.balanceScore = computeTeamBalanceScore(
          team.compositeTotal,
          idealAvg
        )
      }

      setResult({
        teams: newTeams,
        overallScore: computeOverallScore(newTeams),
      })
    },
    [result]
  )

  // ─── Demo ───────────────────────────────────────────────────────────

  const generateDemo = useCallback(
    (count = 12) => {
      let activeConstraints = constraints
      if (activeConstraints.length === 0) {
        activeConstraints = generateDefaultConstraints()
        setConstraints(activeConstraints)

        // Assign default values to existing people for new constraints
        if (people.length > 0) {
          setPeople((prev) =>
            prev.map((p) => {
              const newTags = { ...p.tags }
              for (const c of activeConstraints) {
                if (!(c.id in newTags)) {
                  newTags[c.id] = getDefaultValue(c)
                }
              }
              return { ...p, tags: newTags }
            })
          )
        }
      }

      const newPeople = generatePeople(count, activeConstraints)
      setPeople((prev) => [...prev, ...newPeople])
      setResult(null)
      setError(null)
    },
    [constraints, people.length]
  )

  // ─── Presets ────────────────────────────────────────────────────────

  const savePreset = useCallback(
    (name: string) => {
      const preset = createPreset(name, constraints, people)
      const updated = [...presets, preset]
      setPresets(updated)
      savePresets(updated)
    },
    [constraints, people, presets]
  )

  const loadPreset = useCallback((preset: Preset) => {
    setConstraints(preset.constraints)
    setPeople(preset.people)
    setResult(null)
    setError(null)
    setActiveTab('people')
  }, [])

  const deletePreset = useCallback(
    (id: string) => {
      const updated = presets.filter((p) => p.id !== id)
      setPresets(updated)
      savePresets(updated)
    },
    [presets]
  )

  // ─── Export ─────────────────────────────────────────────────────────

  const copyToClipboard = useCallback(async () => {
    if (!result) return
    const text = toClipboardText(result, constraints)
    await navigator.clipboard.writeText(text)
  }, [result, constraints])

  const downloadCSV = useCallback(() => {
    if (!result) return
    const csv = toCSV(result, constraints)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teams.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [result, constraints])

  return {
    constraints,
    people,
    teamSize,
    result,
    presets,
    activeTab,
    error,
    topPeople,

    addConstraint,
    removeConstraint,
    updateConstraintWeight,

    addPerson,
    removePerson,
    updatePerson,
    clearPeople,

    runBalance,
    swapMembers,

    setTeamSize,
    setActiveTab,

    generateDemo,

    savePreset,
    loadPreset,
    deletePreset,

    copyToClipboard,
    downloadCSV,
  }
}

function getDefaultValue(constraint: Constraint): ConstraintValue {
  switch (constraint.type) {
    case 'enum':
      return constraint.values[0] ?? ''
    case 'int':
    case 'float':
      return 0
    case 'boolean':
      return false
  }
}
