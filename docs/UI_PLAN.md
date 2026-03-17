# Team Balancer — UI/UX Polish Plan

**Status:** Ready to implement
**Last updated:** 2026-03-17

---

## 0. Root cause — styles not loading

The dark theme and all component styles exist in `src/App.css`, but **they are never imported**. When `src/App.tsx` was changed to a re-export barrel (`export { App as default } from './frontend/App'`), the original `import './App.css'` was dropped. The browser renders raw, unstyled HTML on a white background.

**Fix:** Move the CSS import into `src/frontend/App.tsx` (or `src/main.tsx`). This is a one-line fix that immediately activates the dark theme and all existing layout rules.

---

## 1. Design system foundations

Before touching individual components, establish a consistent design system in `App.css`.

### 1.1 Typography scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `--text-xs` | 0.75rem | 400 | Breakdowns, meta dates |
| `--text-sm` | 0.8125rem | 400 | Badges, hints, labels |
| `--text-base` | 0.875rem | 400 | Body text, inputs |
| `--text-lg` | 1rem | 600 | Section titles, card headers |
| `--text-xl` | 1.25rem | 700 | Page title |

Current problem: sizes jump erratically (0.65rem, 0.7rem, 0.75rem, 0.875rem, 1rem, 1.25rem, 1.5rem). Consolidate to 5 steps.

### 1.2 Spacing scale

Use a 4px base grid: `0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem`. Define as tokens:

```css
--space-1: 0.25rem;   /* 4px  — tight inline gaps */
--space-2: 0.5rem;    /* 8px  — default gap */
--space-3: 0.75rem;   /* 12px — card padding */
--space-4: 1rem;      /* 16px — section padding */
--space-6: 1.5rem;    /* 24px — section gaps */
--space-8: 2rem;      /* 32px — major section breaks */
```

### 1.3 Elevation / depth

Add subtle layering so cards feel lifted off the background:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.25);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.3);
```

### 1.4 Color refinements

- Add `--color-success: #22c55e` for feedback (copy success, balance score green).
- Add `--color-surface-hover: #283548` as a distinct hover state between surface and surface-2.
- Add `--color-primary-soft: rgba(99, 102, 241, 0.12)` for subtle selected/active backgrounds.

### 1.5 Transitions

Standardise: `--transition: 150ms ease`. Apply globally to buttons, inputs, cards.

---

## 2. Global element polish

### 2.1 Buttons

- Add `:active` press state — scale down slightly (`transform: scale(0.97)`).
- Add `:focus-visible` ring (`outline: 2px solid var(--color-primary); outline-offset: 2px`).
- Add `:disabled` state (opacity 0.5, cursor not-allowed).
- Increase `.btn--sm` padding slightly — current 0.25rem vertical is too tight to tap on mobile.
- Add subtle `box-shadow: var(--shadow-sm)` to primary buttons.

### 2.2 Inputs

- Match height to buttons (align adjacent button + input pairs).
- Add `::placeholder` styling (lighter than muted text).
- Increase `.input:focus` visibility — add a subtle glow: `box-shadow: 0 0 0 3px var(--color-primary-soft)`.
- `select` elements need matching styles (currently unstyled arrow/dropdown).

### 2.3 Forms (card containers)

- Add `box-shadow: var(--shadow-sm)` to `.add-constraint-form`, `.add-person-form`.
- Increase internal padding from 1rem to 1.25rem for breathing room.
- Add a subtle left border accent (`border-left: 3px solid var(--color-primary)`) to visually distinguish form cards from data cards.

---

## 3. Component-by-component improvements

### 3.1 TabBar

- Add a bottom indicator line (2px) that slides to the active tab (CSS transition on a `::after` pseudo-element).
- Increase tab padding for a bigger hit target.
- Add `role="tablist"` on nav and `role="tab"` / `aria-selected` on buttons.
- Add `:focus-visible` ring.

### 3.2 EmptyState

- Add a large, muted icon above the title (a simple SVG — e.g. users icon for People, grid icon for Teams).
- Increase vertical padding to 4rem for proper empty-page centring.
- Make the CTA button larger (use regular `.btn` size, not sm).
- Add a subtle pulsing animation on the CTA to draw attention.

### 3.3 Avatar

- Increase size from 2rem to 2.25rem.
- Add a thin white/light border ring (`box-shadow: 0 0 0 2px var(--color-surface)`) so avatars look clean against row backgrounds.
- Add a tooltip (`title` attribute) showing full name.

### 3.4 TypeBadge

- Move colours to CSS classes (`.type-badge--enum`, `--int`, `--float`, `--boolean`) instead of inline styles, so they are themeable and consistent.
- Add a subtle text-shadow for readability on coloured backgrounds.

### 3.5 WeightBadge

- Make the editable badge look interactive — add a faint dashed underline or a pencil icon hint.
- When editing, match input styling to the badge size so it doesn't jump.

### 3.6 TagBadge

- Reduce border width to 1px and use a faded background fill instead of border-only (e.g. `background: rgba(color, 0.1)`). Border-only pills look thin on dark backgrounds.
- Increase font size from 0.7rem to `--text-sm`.

### 3.7 ConstraintRow

- Add row hover state: `background: var(--color-surface-hover)`.
- Add a left colour stripe matching the type colour for quick scanning.
- Animate removal (fade-out or slide-up).

### 3.8 AddConstraintForm

- Lay out the name + type + weight inputs on a CSS grid (3 columns: `1fr auto auto`) instead of flex-wrap, so they never break to separate lines on desktop.
- Make the enum values input full-width on its own row below.

### 3.9 PersonRow

- Add row hover state.
- Show actions (Edit / Remove) only on hover (desktop) or always on mobile — keeps the list clean.
- Truncate long names with ellipsis.
- Add a subtle alternating row tint (every other row gets `--color-surface` vs transparent) for scanability.

### 3.10 AddPersonForm

- Use a 2-column grid for constraint fields when there are 2+ constraints (label on left, input on right, each pair in a grid row). Keeps the form compact.
- Add `htmlFor` on all labels pointing to input ids.
- Show a subtle success flash when a person is added (brief green border).

### 3.11 TeamCard

- Add `box-shadow: var(--shadow-md)` to lift cards.
- Colour-code the card header's top border by balance score (green/amber/red — a 3px top border).
- Team names: rename from `team-1` to `Team A`, `Team B`, etc. for friendliness (this is a backend change in `balancer.ts`).
- Add a member count in the footer alongside the composite total.

### 3.12 MemberChip

- Add a drag-active state: slight opacity decrease + outline when being dragged.
- Add a drop-target state: dashed border or highlight glow when another chip is dragged over.
- Replace Unicode drag handle (`⁞⁞`) with a proper 6-dot SVG grip icon.
- Animate the swap (brief position transition).

### 3.13 BalanceScoreBadge

- Use a coloured background fill instead of border-only — e.g. `background: rgba(green, 0.1)` with matching text colour. Currently the badge is invisible on the dark surface because it only uses border+text colour.
- Make the badge slightly larger and bolder at page level (overall score) vs card level.

### 3.14 TopPeoplePanel

- Add rank medal colours: gold (#fbbf24), silver (#9ca3af), bronze (#d97706) for #1, #2, #3.
- Increase minimum font size from 0.65rem to `--text-xs` (0.75rem).
- Collapse the score breakdown by default, show on hover/click. It's too noisy always visible.
- Add a subtle separator between entries.

### 3.15 PresetRow

- Add hover highlight.
- Show a timestamp in relative format ("2 days ago") instead of locale date.
- Add a subtle icon before the name (bookmark icon).

### 3.16 PresetsView

- Wrap in a max-width container (640px) centred — preset lists don't need full width.
- Add a proper empty state with icon and description.

---

## 4. Layout & page-level improvements

### 4.1 App header

- Stick the header on scroll (`position: sticky; top: 0; z-index: 50; background: var(--color-bg)`).
- Add a `backdrop-filter: blur(8px)` with a semi-transparent background for a frosted glass look.
- Add a subtle bottom shadow when scrolled.

### 4.2 PeopleView layout

- Move the "Balance Teams" button to a sticky bottom bar (or a prominent position in the header) — it's buried in the sidebar.
- Sidebar: make the controls section (`team size + buttons`) stick to the top of the sidebar using `position: sticky`.
- Add section headings with horizontal rules between "Constraints" and "People" blocks.
- When the people list is long (10+), add a max-height with scroll.

### 4.3 TeamsView layout

- Add an instruction banner above the grid on first view: "Drag members between teams to swap."
- Make the overall score badge larger and more prominent (centred, larger font).
- Add a visual divider between the header controls and the team grid.

### 4.4 Responsive breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| > 1024px | Full 2-column layout (main + sidebar) |
| 768–1024px | Sidebar collapses below main content |
| < 768px | Single column, full-width cards, sticky bottom balance button |

Currently only one breakpoint at 768px. Add the 1024px intermediate.

---

## 5. Micro-interactions & feedback

| Action | Feedback |
|--------|----------|
| Add constraint | Row slides in from top, brief green flash |
| Remove constraint | Row fades out + slides up |
| Add person | Row slides in, form resets with focus on name field |
| Remove person | Row fades out |
| Clear all people | Confirmation dialog, then list fades |
| Balance teams | Brief loading spinner (100ms delay), tab switches with a slide transition |
| Drag member | Opacity decrease on source, glow on drop target |
| Drop/swap | Cards briefly pulse |
| Copy to clipboard | Button text changes to "Copied!" for 2 seconds, green colour |
| Save preset | Button text changes to "Saved!" briefly |
| Error | Error banner slides down from top with a shake animation |

---

## 6. Accessibility checklist

- [ ] All form inputs linked to labels via `htmlFor` / `id`
- [ ] `role="tablist"` / `role="tab"` / `aria-selected` on TabBar
- [ ] `aria-label` on icon-only buttons and avatars
- [ ] `:focus-visible` ring on all interactive elements
- [ ] Drag-and-drop: add keyboard alternative (select + arrow keys or a "Move to" dropdown)
- [ ] Destructive actions: confirmation step (dialog or undo toast)
- [ ] Colour is never the sole indicator — badges include text labels alongside colour
- [ ] Minimum text size: 0.75rem (12px)
- [ ] Contrast: check all `--color-text-muted` on `--color-surface` meets WCAG AA (4.5:1)

---

## 7. Implementation order

| Phase | Scope | Effort |
|-------|-------|--------|
| **P0 — Unblock** | Fix CSS import, verify dark theme loads | 5 min |
| **P1 — Foundations** | Design tokens (typography, spacing, shadows, colours), global button/input/form polish | ~1 hr |
| **P2 — Layout** | Sticky header, PeopleView 2-col grid fix, responsive breakpoints, sidebar sticky controls | ~1 hr |
| **P3 — Component polish** | Card shadows, row hover states, badge backgrounds, avatar rings, form grid layouts | ~2 hr |
| **P4 — Interactions** | Add/remove animations, copy feedback, drag states, confirmation dialogs | ~1.5 hr |
| **P5 — Accessibility** | Aria roles, focus rings, label linking, keyboard drag alternative | ~1 hr |

Total estimated scope: ~6.5 hours of implementation.

---

## 8. Out of scope (for now)

- Light mode toggle (dark-only for v1)
- Custom theme colours
- Onboarding walkthrough / tooltips
- Advanced animations (page transitions, spring physics)
- Internationalisation
