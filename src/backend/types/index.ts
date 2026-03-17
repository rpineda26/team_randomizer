// ─── Constraint ───────────────────────────────────────────────────────────────

export type ConstraintType = 'enum' | 'int' | 'float' | 'boolean'

export interface BaseConstraint {
  id: string
  name: string
  weight: number // 1–10, default 1
}

export interface EnumConstraint extends BaseConstraint {
  type: 'enum'
  values: string[] // ordered; index = score for balancing
}

export interface IntConstraint extends BaseConstraint {
  type: 'int'
}

export interface FloatConstraint extends BaseConstraint {
  type: 'float'
}

export interface BooleanConstraint extends BaseConstraint {
  type: 'boolean'
}

export type Constraint =
  | EnumConstraint
  | IntConstraint
  | FloatConstraint
  | BooleanConstraint

// ─── Constraint value (per person) ────────────────────────────────────────────

export type ConstraintValue = string | number | boolean

export type ConstraintValueMap = Record<string, ConstraintValue>
// key = Constraint.id

// ─── Person ───────────────────────────────────────────────────────────────────

export interface Person {
  id: string
  name: string
  tags: ConstraintValueMap
  colorIndex: number // 0–N, used to derive avatar colour consistently
}

// ─── Scored person (runtime only, never persisted) ────────────────────────────

export interface ScoredPerson extends Person {
  compositeScore: number
  scoreBreakdown: ScoreBreakdownItem[]
}

export interface ScoreBreakdownItem {
  constraintId: string
  constraintName: string
  rawScore: number
  weight: number
  weightedScore: number
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface Team {
  id: string
  members: ScoredPerson[]
  compositeTotal: number
  balanceScore: number // 0–100
}

// ─── Balance result ───────────────────────────────────────────────────────────

export interface BalanceResult {
  teams: Team[]
  overallScore: number // average of all team balance scores
}

// ─── Preset ───────────────────────────────────────────────────────────────────

export interface Preset {
  id: string
  name: string
  constraints: Constraint[]
  people: Person[]
  createdAt: number // Date.now()
}

// ─── App state (owned by presenter) ──────────────────────────────────────────

export type AppTab = 'people' | 'teams' | 'presets'

export interface AppState {
  constraints: Constraint[]
  people: Person[]
  teamSize: number
  result: BalanceResult | null
  presets: Preset[]
  activeTab: AppTab
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  error: string | null
}

// ─── Demo generator options ───────────────────────────────────────────────────

export interface DemoOptions {
  count: number // default 12
  intFloatRange: [number, number] // default [1, 10]
}
