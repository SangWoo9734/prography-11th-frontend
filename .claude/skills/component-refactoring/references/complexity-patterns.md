# Complexity Patterns & Heuristics

## Quick Complexity Checklist

Read the component and count:

| Metric | Green ✅ | Yellow ⚠️ | Red 🔴 |
|--------|----------|-----------|--------|
| Lines (excl. imports/types) | < 100 | 100–200 | > 200 |
| useState calls | ≤ 2 | 3 | ≥ 4 |
| useEffect calls | 0 | 1 | ≥ 2 |
| Props received | ≤ 3 | 4–6 | ≥ 7 |
| JSX nesting depth | ≤ 4 | 5–6 | ≥ 7 |
| Conditional renders | ≤ 2 | 3 | ≥ 4 |

**If ≥ 2 Red indicators**: Refactor before adding features.
**If ≥ 2 Yellow indicators**: Consider refactoring.

## Smell 1: Prop Drilling

```typescript
// ❌ Passing the same props 3+ levels deep
<Parent value={v} onChange={onChange} isOpen={isOpen} onClose={onClose}>
  <Child value={v} onChange={onChange} isOpen={isOpen} onClose={onClose}>
    <GrandChild value={v} onChange={onChange} isOpen={isOpen} onClose={onClose} />
  </Child>
</Parent>
```

**Fix**: Extract a Context/hook, or restructure so GrandChild is composed at the Parent level.

## Smell 2: Dual Responsibility

A component has dual responsibility when its name requires "and":

```
// ❌ "AttendanceTableAndEditModal" — table UI AND modal state
// ✅ Split: AttendanceTable (display) + EditAttendanceModal (edit)
```

## Smell 3: Effect Soup

Multiple useEffects that trigger each other or respond to different concerns:

```typescript
// ❌ Each effect does something unrelated
useEffect(() => { fetchUser(id); }, [id]);
useEffect(() => { document.title = user?.name ?? ""; }, [user]);
useEffect(() => { if (error) toast(error.message); }, [error]);
```

**Fix**: Extract data-fetching to a TanStack Query hook; keep only UI-related effects in the component.

## Smell 4: God State Object

```typescript
// ❌ One big useState/useReducer managing everything
const [state, setState] = useState({
  user: null,
  isLoading: false,
  error: null,
  formValues: {},
  modalOpen: false,
  page: 1,
});
```

**Fix**: Split by concern — data state in a query hook, form state in a form hook, UI state (modal, page) as separate `useState` calls.

## Smell 5: Inlined Complex Logic in JSX

```typescript
// ❌ Hard to read, hard to test
{items
  .filter((i) => i.status !== "DELETED")
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice((page - 1) * 10, page * 10)
  .map((item) => <Row key={item.id} item={item} />)}
```

**Fix**: Move the derivation to `useMemo` or a helper function:

```typescript
const visibleItems = useMemo(
  () =>
    items
      .filter((i) => i.status !== "DELETED")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice((page - 1) * 10, page * 10),
  [items, page],
);

return <>{visibleItems.map((item) => <Row key={item.id} item={item} />)}</>;
```

## Decision Tree

```
Is the component > 200 lines?
  └─ Yes → Can I identify 2+ independent UI sections?
              └─ Yes → Split into sub-components
              └─ No  → Extract hooks until it fits

Does it have ≥ 4 useState calls?
  └─ Yes → Are they related to the same concern?
              └─ Yes → Extract to custom hook
              └─ No  → Extract multiple focused hooks

Does it fetch data AND render UI?
  └─ Yes → Extract TanStack Query data hook

Does it manage 3+ modal open states?
  └─ Yes → Extract useModal hook with union type

Is any single function > 30 lines?
  └─ Yes → Extract to named helper or hook
```