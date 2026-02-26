---
name: component-refactoring
description: Analyze and refactor React/Next.js components that are too complex, too large, or mixing concerns. Use when asked to refactor a component, review component structure, extract hooks or sub-components, or when a component exceeds complexity thresholds (>200 lines, multiple useEffect/useState, mixed UI+data logic).
---

# Component Refactoring

## Complexity Thresholds

| Signal | Threshold | Action |
|--------|-----------|--------|
| Line count | > 200 lines | Split into sub-components |
| useState count | ≥ 4 | Extract custom hook |
| useEffect count | ≥ 2 | Extract custom hook |
| Conditional nesting | > 3 levels | Simplify with early returns or lookup tables |
| Mixed concerns | UI + API + state | Separate data hooks from UI |

For detailed complexity heuristics: see [complexity-patterns.md](references/complexity-patterns.md)

## Workflow

### 1. Assess

Read the target component and identify:
- Line count and state count
- Which concerns are mixed (UI / data fetching / business logic / form)
- Repeated JSX patterns

### 2. Plan

Choose refactoring actions based on findings:

| Finding | Action |
|---------|--------|
| Complex state + effects | Extract `use<Feature>.ts` hook |
| Large JSX sections | Split into sub-components |
| API calls in component | Extract data hook with TanStack Query |
| Multiple modal states | Extract `use<Feature>Modal.ts` |
| Repeated JSX patterns | Extract reusable component |

- For hook extraction patterns: see [hook-extraction.md](references/hook-extraction.md)
- For component splitting patterns: see [component-splitting.md](references/component-splitting.md)

### 3. Execute

Refactor one concern at a time:
1. Extract → verify lint/build passes → move to next

### 4. Verify

After refactoring, confirm:
- Each file < 200 lines
- Components do one thing (UI or orchestration, not both)
- Hooks are pure logic with no JSX

## Naming Conventions

- Custom hooks: `use<Feature>.ts` (e.g., `useAttendanceForm.ts`)
- Sub-components: `<Feature><Role>.tsx` (e.g., `AttendanceTableRow.tsx`)
- Data hooks: `useGet<Resource>.ts`, `useUpdate<Resource>.ts`
- Place hooks in `hooks/` sibling directory or alongside the component

## Common Mistakes to Avoid

- Extracting hooks that only wrap a single useState (not worth it)
- Creating sub-components for JSX that's only used once and < 20 lines
- Breaking prop drilling into excessive abstraction layers
- Over-engineering: 3 similar lines is better than a premature abstraction