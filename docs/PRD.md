# Team Balancer — Product Requirements Document

**Version:** 1.3  
**Status:** Draft  
**Last updated:** 2026-03-17

---

## 1. Overview & goals

### 1.1 Summary

Team Balancer is a browser-based tool that lets facilitators, team leads, and educators quickly generate balanced teams from a list of people. Users define typed constraints per person (e.g. skill level, department, timezone), and the tool distributes people across teams so those attributes are spread evenly — not clustered.

### 1.2 Problem statement

Manually splitting people into balanced groups is tedious and error-prone. Spreadsheets don't enforce constraint types, don't balance distributions, and can't be saved and reloaded. Existing tools are either too simple (pure random) or too heavy (enterprise org-chart software). Team Balancer sits in between — opinionated enough to produce fair, explainable splits, lightweight enough to use in five minutes.

### 1.3 Goals

- Let users define any number of named, typed constraints without writing code
- Generate teams that are deterministically balanced across all active constraints
- Allow manual post-generation adjustments via drag-to-swap
- Save and reload named configurations (presets) across sessions
- Run entirely in the browser — no backend, no login

### 1.4 Non-goals

- Real-time collaboration or multi-user editing
- Slack or calendar integrations (out of scope for v1)
- Server-side persistence
- Mobile-native apps

---

## 2. User personas

### 2.1 The workshop facilitator

**Name:** Sara  
**Role:** Learning & development lead at a mid-size company  
**Context:** Runs monthly cross-functional workshops with 20–40 attendees from different departments and seniority levels. Needs teams that mix departments and skill levels so no single group is stacked with seniors.  
**Pain point:** Currently uses a spreadsheet with manual color-coding. Takes 20 minutes and she always second-guesses the result.  
**Needs:** Fast input, repeatable presets, visual confidence that constraints are balanced.

### 2.2 The engineering manager

**Name:** Diego  
**Role:** Engineering manager, 3 squads of 5–8 engineers  
**Context:** Runs quarterly hackathons. Wants teams balanced by seniority (junior/mid/senior) and tech stack preference (frontend/backend/infra).  
**Pain point:** Pure random often produces all-senior or all-junior teams. He ends up manually reshuffling.  
**Needs:** Enum-typed constraints with defined values, drag-to-swap for final tweaks, export to share with others.

### 2.3 The educator

**Name:** Priya  
**Role:** University lecturer, computer science department  
**Context:** Assigns student project groups each semester. Wants to balance by self-reported skill level (1–5) and preferred role (designer/developer/PM).  
**Pain point:** No tool fits her use case without being overkill. She wants something she can use in 5 minutes during class.  
**Needs:** Numeric constraints, quick person entry, reusable presets per cohort.

---

## 3. Features & requirements

### 3.1 Constraint management

| ID | Requirement | Priority |
|----|-------------|----------|
| C-01 | Users can add a named constraint with a declared type (enum, int, float, boolean) | P0 |
| C-02 | Enum constraints require the user to define allowed values at creation time | P0 |
| C-03 | Users can remove a constraint; all associated tag data is deleted from existing people | P0 |
| C-04 | Constraint names must be unique within a session | P0 |
| C-05 | The constraint list is visible with type badges and, for enums, the allowed values | P1 |
| C-06 | Each constraint has a numeric weight (1–10, default 1) set at creation or edited afterwards | P0 |
| C-07 | The weight is displayed alongside the constraint in the constraint list | P1 |
| C-08 | Constraints can be reordered (for display priority in team cards) | P2 |

### 3.2 Person management

| ID | Requirement | Priority |
|----|-------------|----------|
| P-01 | Users can add a person by name | P0 |
| P-02 | When adding a person, the form shows a typed input for each active constraint | P0 |
| P-03 | Enum constraints render as a dropdown restricted to defined values | P0 |
| P-04 | Int and float constraints render as number inputs with appropriate step precision | P0 |
| P-05 | Boolean constraints render as a true/false dropdown | P0 |
| P-06 | Users can remove any person from the list | P0 |
| P-07 | Users can clear all people at once | P1 |
| P-08 | Constraint tags are displayed as colour-coded badges on each person row | P1 |
| P-09 | Users can edit an existing person's name and constraint values inline without deleting and re-adding them | P1 |

### 3.3 Team generation

| ID | Requirement | Priority |
|----|-------------|----------|
| T-01 | Users specify a target team size (minimum 2) | P0 |
| T-02 | The tool generates N teams where N = ceil(people / team size) | P0 |
| T-03 | Teams are balanced across all active constraints using the balancing algorithm (see §5) | P0 |
| T-04 | Each generated team is displayed as a card with member names and their constraint tags | P0 |
| T-05 | Users can re-run the balancer without leaving the teams view | P1 |
| T-06 | Each team card displays a balance score (0–100) indicating how evenly its weighted constraint values compare to the ideal average across all teams | P0 |
| T-07 | An overall balance score is shown across all teams after generation | P1 |
| T-08 | The tool validates before balancing: at least 2 people must exist, and the number of people must be greater than the team size. A clear error message is shown if validation fails | P0 |
| T-09 | An empty state is shown when no people or constraints exist, with a clear call to action to add people or generate demo data | P0 |

### 3.4 Drag-to-swap

| ID | Requirement | Priority |
|----|-------------|----------|
| D-01 | Members can be dragged from one position to another within or across teams | P0 |
| D-02 | Dropping a member onto another member swaps their positions | P0 |
| D-03 | A drag handle is visible on each member chip | P1 |
| D-04 | A drop target indicator is shown while dragging | P1 |

### 3.5 Export

| ID | Requirement | Priority |
|----|-------------|----------|
| E-01 | After team generation, users can copy the full team breakdown to clipboard as plain text | P0 |
| E-02 | The copied output lists each team with member names and their constraint tag values | P1 |
| E-03 | Users can export the team breakdown as a downloadable CSV file | P2 |

### 3.6 Demo data generation

| ID | Requirement | Priority |
|----|-------------|----------|
| G-01 | A "Generate demo" action creates a set of fake people with randomised names | P0 |
| G-02 | The number of people to generate is configurable by the user (default: 12) | P1 |
| G-03 | Generated people are assigned random values for every active constraint, respecting each constraint's type | P0 |
| G-04 | For `enum` constraints, generated values are drawn randomly and uniformly from the defined enum values | P0 |
| G-05 | For `int` and `float` constraints, generated values are drawn from a sensible range (default: 1–10); the range is configurable | P1 |
| G-06 | For `boolean` constraints, generated values are randomly `true` or `false` with equal probability | P0 |
| G-07 | If no constraints are defined, demo generation still works — people are created with names only | P0 |
| G-08 | Generated people are appended to any existing people, not replacing them | P1 |
| G-09 | A single "Generate demo" action can also generate a default set of constraints (skill level as enum, experience as int) if none are defined yet | P1 |
| G-10 | If G-09 generates new constraints while people already exist, those existing people are assigned the default value for each new constraint (per §4.2 validation rules) to avoid undefined tag values in scoring | P1 |

### 3.7 Top people

| ID | Requirement | Priority |
|----|-------------|----------|
| TP-01 | The tool surfaces the top 3 people ranked by composite score | P1 |
| TP-02 | Composite score is calculated using current constraint weights at the time of display | P1 |
| TP-03 | Top people are updated live as constraints or person data change | P1 |
| TP-04 | Each entry shows the person's name, composite score, and a breakdown of their per-constraint contribution | P1 |

### 3.8 Presets

| ID | Requirement | Priority |
|----|-------------|----------|
| PR-01 | Users can save the current people list and constraints as a named preset | P0 |
| PR-02 | Saved presets persist across browser sessions via localStorage | P0 |
| PR-03 | Loading a preset replaces the current people and constraints | P0 |
| PR-04 | Users can delete a saved preset | P0 |
| PR-05 | The preset list shows person count and constraint count per entry | P1 |

---

## 4. Constraint type system

### 4.1 Supported types

| Type | Description | Input UI | Storage format | Example |
|------|-------------|----------|----------------|---------|
| `enum` | A fixed set of named values defined at constraint creation | Dropdown (restricted to defined values) | `string` | `junior`, `mid`, `senior` |
| `int` | A whole number | Number input, `step=1` | `number` (integer) | `3`, `42` |
| `float` | A decimal number | Number input, `step=any` | `number` (float) | `3.5`, `1.0` |
| `boolean` | True or false | True/False dropdown | `boolean` | `true`, `false` |

Each constraint also carries a `weight` field regardless of type (see §4.5).

### 4.2 Type validation rules

- `enum`: value must be one of the declared enum values. The field is a dropdown so free-text entry is not possible.
- `int`: value is parsed with `parseInt`. Empty or non-numeric input defaults to `0`.
- `float`: value is parsed with `parseFloat`. Empty or non-numeric input defaults to `0`.
- `boolean`: stored as a native boolean, not as the string `"true"`.

### 4.3 Enum definition

When a user creates an `enum` constraint they must supply at least one value. Values are entered as a comma-separated list (e.g. `junior, mid, senior`). Whitespace around each value is trimmed. Duplicate values are silently de-duplicated. The first value in the list becomes the default selection for new people.

### 4.4 Enum ordinality

Enum constraints come in two kinds: **ordinal** (where value order implies ranking, e.g. `junior < mid < senior`) and **categorical** (where values have no meaningful rank, e.g. `frontend`, `backend`, `infra`). The balancing algorithm scores enum values by their 0-based index position in the definition list (§5.2), which is only meaningful for ordinal enums. For categorical enums, index-based scoring is arbitrary and may not produce useful balancing. Users should be aware of this limitation when defining categorical enum constraints. A UI hint is shown when an enum is created to remind users that value order matters for balancing.

### 4.5 Constraint weighting

Every constraint has a `weight` property — an integer from 1 to 10 (default: 1). Weight is set when the constraint is created and can be edited at any time without affecting stored person data. Unlike type mutation (§4.6), weight edits are always safe because weight is only consumed at algorithm runtime, not stored on person records.

Weight is used exclusively by the balancing algorithm (§5.2) to scale each constraint's contribution to a person's composite score. A weight of 1 means the constraint contributes at face value; a weight of 10 means it contributes ten times as much.

**UI:** Weight is entered as a number input (`min=1`, `max=10`, `step=1`) in the add-constraint form, alongside the type selector. It is also shown as a small badge (e.g. `×5`) next to the constraint's type badge in the constraint list. The weight badge is click-to-edit inline.

### 4.6 Type mutation

Changing a constraint's type after people have been added is not supported in v1. Users must delete and recreate the constraint. This avoids silent data corruption (e.g. a previously numeric value becoming meaningless in an enum context).

---

## 5. Balancing algorithm

### 5.1 Goal

Distribute people across teams such that the aggregate constraint values of each team are as equal as possible — preventing stacking (e.g. all seniors on one team, all juniors on another).

### 5.2 Scoring

Each person is assigned a numeric composite score derived from their constraint values and the weight of each constraint:

| Constraint type | Raw score rule |
|-----------------|----------------|
| `int` / `float` | Use the raw numeric value directly |
| `boolean` | `true` → 1, `false` → 0 |
| `enum` | Use the 0-based index of the value in the enum definition (e.g. `junior=0`, `mid=1`, `senior=2`). See §4.4 for ordinality considerations. |

The composite score is calculated as:

```
composite = Σ (raw_score(constraint) × constraint.weight)
```

A constraint with weight 1 contributes at face value. A constraint with weight 5 contributes five times as much to the composite score, making it five times more influential in how people are distributed across teams.

### 5.3 Distribution strategy

The algorithm is fully deterministic — the same input always produces the same output. The steps are:

1. Sort all people by composite score descending (highest score first). For people with equal composite scores, sort alphabetically by name as a stable tiebreaker.
2. Assign people to teams using a snake-draft pattern:
   - Round 1: assign person 0 → team 0, person 1 → team 1, … person N-1 → team N-1
   - Round 2 (reverse): person N → team N-1, person N+1 → team N-2, …
   - Repeat, alternating direction each round.

The snake-draft ensures high-scoring and low-scoring people are interleaved across teams rather than front-loaded into early teams. Because the algorithm is deterministic, re-running on the same input produces the same result — the only way to get a different split is to change the people, their constraint values, or the weights.

### 5.4 Example

Given 6 people and 2 constraints — skill level (enum: junior=0, mid=1, senior=2, **weight 3**) and timezone offset (int, **weight 1**):

| Person | Skill (raw) | Timezone (raw) | Composite (skill×3 + tz×1) |
|--------|-------------|----------------|----------------------------|
| Alice  | senior (2)  | +2             | 8 |
| Bob    | senior (2)  | +0             | 6 |
| Carol  | mid (1)     | +1             | 4 |
| Dan    | mid (1)     | +0             | 3 |
| Eve    | junior (0)  | +2             | 2 |
| Frank  | junior (0)  | +0             | 0 |

Sorted descending: `[8, 6, 4, 3, 2, 0]`. Snake-drafted into 2 teams:

| Round | Direction | Assignments |
|-------|-----------|-------------|
| 1 | → | Alice (8) → Team A, Bob (6) → Team B |
| 2 | ← | Carol (4) → Team B, Dan (3) → Team A |
| 3 | → | Eve (2) → Team A, Frank (0) → Team B |

Result: Team A = `[8, 3, 2]` (sum 13), Team B = `[6, 4, 0]` (sum 10). Skill level's higher weight means seniority is the dominant balancing factor, as intended.

### 5.5 Limitations

- The algorithm optimises for a single weighted composite score. It does not guarantee per-constraint balance independently — it balances the weighted sum, not each axis in isolation.
- Unequal team sizes are handled by filling earlier teams first. The last team may be smaller.
- The algorithm is deterministic — the same input always produces the same teams. To get a different split, change the input data or weights.
- If all constraints have equal weight (all set to 1), behaviour is identical to an unweighted sort-and-draft.

### 5.6 Balance score

After generation, each team and the overall result are given a balance score from 0 to 100, where 100 means perfect balance.

**Per-team score** is calculated as:

```
ideal_avg = total composite score of all people / number of teams
if ideal_avg == 0:
    team_score = 100  (all scores are zero, distribution is trivially perfect)
else:
    deviation = abs(team composite score - ideal_avg) / ideal_avg
    team_score = max(0, round((1 - deviation) × 100))
```

A team whose composite score exactly matches the ideal average scores 100. A team that is 20% above or below the ideal scores 80. The `ideal_avg == 0` guard handles the edge case where all people have zero composite scores (no constraints defined, or all values are zero/false/first-enum).

**Overall score** is the average of all per-team scores.

Both scores are displayed on the teams view after generation and update live when members are swapped via drag-to-swap.

### 5.7 Future improvements (v2 candidates)

- Multi-dimensional balancing that treats each constraint axis independently, ignoring composite score entirely