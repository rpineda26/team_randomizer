# Team Balancer — CLAUDE.md

## Project overview

Team Balancer is a browser-based tool for generating deterministically balanced teams from a list of people. Users define typed, weighted constraints (e.g. skill level, department, timezone), and the tool distributes people across teams using a snake-draft algorithm so constraint values are spread evenly rather than clustered. All logic runs client-side — no backend, no login, no server.

Built with: Vite + React + TypeScript + React Compiler.

---

## Architecture

This project follows an **MVP (Model-View-Presenter) pattern** with a strict separation between frontend and backend concerns, even though there is no server. "Backend" here means all pure logic, types, and data operations that are framework-agnostic. "Frontend" means all React components and UI state.

```
src/
├── backend/                  # Pure logic — no React, no DOM
│   ├── types/                # All TypeScript types and interfaces
│   │   └── index.ts
│   ├── models/               # Data shape constructors and defaults
│   │   ├── constraint.ts
│   │   ├── person.ts
│   │   ├── team.ts
│   │   └── preset.ts
│   ├── services/             # Business logic — stateless pure functions
│   │   ├── balancer.ts       # Scoring + snake-draft algorithm
│   │   ├── balanceScore.ts   # Per-team and overall balance score calculation
│   │   ├── demoGenerator.ts  # Fake people + default constraint generation
│   │   ├── exporter.ts       # Clipboard text and CSV export formatting
│   │   └── storage.ts        # localStorage read/write for presets
│   └── validators/
│       └── index.ts          # Pre-balance validation rules (min people, team size, etc.)
│
├── frontend/                 # React components and UI state only
│   ├── presenter/            # Presenter layer — bridges backend services and views
│   │   └── useAppPresenter.ts  # Single top-level presenter hook
│   ├── views/                # Page-level view components (one per tab/screen)
│   │   ├── PeopleView.tsx
│   │   ├── TeamsView.tsx
│   │   └── PresetsView.tsx
│   ├── components/           # Reusable UI components
│   │   ├── constraints/
│   │   │   ├── ConstraintList.tsx
│   │   │   ├── ConstraintRow.tsx
│   │   │   └── AddConstraintForm.tsx
│   │   ├── people/
│   │   │   ├── PersonList.tsx
│   │   │   ├── PersonRow.tsx
│   │   │   └── AddPersonForm.tsx
│   │   ├── teams/
│   │   │   ├── TeamCard.tsx
│   │   │   ├── MemberChip.tsx
│   │   │   └── BalanceScoreBadge.tsx
│   │   ├── presets/
│   │   │   ├── PresetList.tsx
│   │   │   └── PresetRow.tsx
│   │   ├── topPeople/
│   │   │   └── TopPeoplePanel.tsx
│   │   └── shared/
│   │       ├── TabBar.tsx
│   │       ├── EmptyState.tsx
│   │       ├── TypeBadge.tsx
│   │       ├── WeightBadge.tsx
│   │       ├── TagBadge.tsx
│   │       └── Avatar.tsx
│   └── App.tsx               # Root — mounts presenter and routes views
│
└── main.tsx
```

---

## Rules

- **Nothing in `backend/` may import from `frontend/`**. Backend is pure TypeScript — no React, no hooks, no DOM APIs.
- **Components do not call backend services directly.** All service calls go through the presenter hook. Components receive data and callbacks as props only.
- **No business logic in components.** A component that computes a composite score or runs a sort is wrong — that belongs in `backend/services/`.
- **One presenter hook to rule them all.** `useAppPresenter.ts` holds all application state and exposes typed action handlers. Views destructure only what they need from it.
- Keep files small. If a service file exceeds ~150 lines, split it.

---

## TypeScript types

All types live in `src/backend/types/index.ts`.

```ts
// ─── Constraint ───────────────────────────────────────────────────────────────

export type ConstraintType = 'enum' | 'int' | 'float' | 'boolean'

export interface BaseConstraint {
  id: string
  name: string
  weight: number          // 1–10, default 1
}

export interface EnumConstraint extends BaseConstraint {
  type: 'enum'
  values: string[]        // ordered; index = score for balancing
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
  colorIndex: number      // 0–N, used to derive avatar colour consistently
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
  balanceScore: number    // 0–100
}

// ─── Balance result ───────────────────────────────────────────────────────────

export interface BalanceResult {
  teams: Team[]
  overallScore: number    // average of all team balance scores
}

// ─── Preset ───────────────────────────────────────────────────────────────────

export interface Preset {
  id: string
  name: string
  constraints: Constraint[]
  people: Person[]
  createdAt: number       // Date.now()
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
  count: number           // default 12
  intFloatRange: [number, number]   // default [1, 10]
}
```

---

## Services

### `balancer.ts`
```ts
// Exposed functions:
computeScore(person: Person, constraints: Constraint[]): ScoredPerson
balance(people: Person[], constraints: Constraint[], teamSize: number): BalanceResult
```
Implements: score each person → sort descending (alpha tiebreak) → snake-draft into N teams → compute balance scores per team and overall.

### `balanceScore.ts`
```ts
computeTeamBalanceScore(teamTotal: number, idealAvg: number): number
computeOverallScore(teams: Team[]): number
```
Isolated from `balancer.ts` so it can be called independently when members are swapped after generation.

### `demoGenerator.ts`
```ts
generateDefaultConstraints(): Constraint[]
generatePeople(count: number, constraints: Constraint[], options?: Partial<DemoOptions>): Person[]
```
Generates realistic fake names (hardcoded pool, no external lib). Assigns random constraint values respecting type rules.

### `exporter.ts`
```ts
toClipboardText(result: BalanceResult, constraints: Constraint[]): string
toCSV(result: BalanceResult, constraints: Constraint[]): string
```

### `storage.ts`
```ts
loadPresets(): Preset[]
savePresets(presets: Preset[]): void
```
Wraps `localStorage` with try/catch. Never throws — fails silently and returns empty array on read error.

### `validators/index.ts`
```ts
validateBeforeBalance(people: Person[], teamSize: number): ValidationResult
```
Rules: people.length ≥ 2, people.length > teamSize.

---

## Components

### Views
| Component | Owns |
|-----------|------|
| `PeopleView` | `ConstraintList` + `AddConstraintForm` + `AddPersonForm` + `PersonList` + balance trigger controls |
| `TeamsView` | `TeamCard[]` + overall `BalanceScoreBadge` + export actions |
| `PresetsView` | `PresetList` |

### Constraint components
| Component | Props summary |
|-----------|---------------|
| `ConstraintList` | `constraints`, `onRemove`, `onWeightChange` |
| `ConstraintRow` | `constraint`, `onRemove`, `onWeightChange` — renders `TypeBadge` + `WeightBadge` + enum values |
| `AddConstraintForm` | `onAdd(constraint: Omit<Constraint, 'id'>)` |

### People components
| Component | Props summary |
|-----------|---------------|
| `PersonList` | `people`, `constraints`, `onRemove`, `onEdit`, `onClear` |
| `PersonRow` | `person`, `constraints`, `onRemove`, `onEdit` — renders `Avatar` + `TagBadge[]` |
| `AddPersonForm` | `constraints`, `onAdd(person: Omit<Person, 'id' \| 'colorIndex'>)` — renders typed inputs per constraint |

### Team components
| Component | Props summary |
|-----------|---------------|
| `TeamCard` | `team`, `constraints`, `onSwap(fromTeamId, fromPersonId, toTeamId, toPersonId)` — renders `MemberChip[]` + `BalanceScoreBadge` |
| `MemberChip` | `person`, `constraints`, `draggable`, drag event handlers |
| `BalanceScoreBadge` | `score: number`, `label?: string` — renders 0–100 with colour coding (green ≥ 80, amber ≥ 60, red < 60) |

### Preset components
| Component | Props summary |
|-----------|---------------|
| `PresetList` | `presets`, `onLoad`, `onDelete`, `onSave(name: string)` |
| `PresetRow` | `preset`, `onLoad`, `onDelete` |

### Top people
| Component | Props summary |
|-----------|---------------|
| `TopPeoplePanel` | `people: ScoredPerson[]` (top 3, pre-sorted by presenter) — renders name + composite score + `ScoreBreakdown` |

### Shared
| Component | Notes |
|-----------|-------|
| `TabBar` | `tabs: AppTab[]`, `active`, `onChange` |
| `EmptyState` | `title`, `description`, `action?: { label, onClick }` |
| `TypeBadge` | `type: ConstraintType` — colour-coded pill |
| `WeightBadge` | `weight: number`, `onEdit?: (w: number) => void` — click-to-edit inline |
| `TagBadge` | `label: string`, `value: ConstraintValue`, `colorIndex: number` |
| `Avatar` | `name: string`, `colorIndex: number` — initials circle |

---

## Presenter

`useAppPresenter.ts` is the single source of truth for all application state. It composes backend services and exposes a flat interface to views.

```ts
// Rough shape — implement fully
export function useAppPresenter() {
  // state
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [people, setPeople]           = useState<Person[]>([])
  const [teamSize, setTeamSize]       = useState(3)
  const [result, setResult]           = useState<BalanceResult | null>(null)
  const [presets, setPresets]         = useState<Preset[]>([])
  const [activeTab, setActiveTab]     = useState<AppTab>('people')
  const [error, setError]             = useState<string | null>(null)

  // derived
  const topPeople: ScoredPerson[]     // top 3 by composite score, computed from people + constraints

  // actions
  return {
    // state
    constraints, people, teamSize, result, presets, activeTab, error, topPeople,

    // constraint actions
    addConstraint, removeConstraint, updateConstraintWeight,

    // person actions
    addPerson, removePerson, updatePerson, clearPeople,

    // balance actions
    runBalance, swapMembers,

    // config
    setTeamSize, setActiveTab,

    // demo
    generateDemo,

    // presets
    savePreset, loadPreset, deletePreset,

    // export
    copyToClipboard, downloadCSV,
  }
}
```

Views receive the return value of this hook (or a destructured slice of it) as props. No view calls a backend service directly.

---

## Naming conventions

- Types and interfaces: `PascalCase`
- Files: `camelCase.ts` / `PascalCase.tsx` for components
- Backend service functions: `camelCase`, verb-first (`computeScore`, `generatePeople`)
- IDs: generated with `crypto.randomUUID()`
- No `any`. No `as unknown as X`. Use proper discriminated unions for `Constraint`.